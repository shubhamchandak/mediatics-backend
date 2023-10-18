import * as mysql from 'mysql2/promise'
import { IIntentCount, IOffensiveCount, ISentimentCount, IUserDetails, IVideoDetails, IYoutubeComment, IYoutubeComments } from '../models/dbmodels.js';
import { ICommentsSummary, IGetCommentsRequest } from '../models/apimodels.js';
import { isNullOrEmpty } from '../utils/utils.js';

var connection = await mysql.createConnection({
    host     :  process.env.DB_HOST,
    port     :  process.env.DB_PORT,
    user     :  process.env.DB_USER,
    password :  process.env.DB_PASSWORD,
    database :  process.env.DB_NAME
  });

export async function getUserByEmail(email: string): Promise<IUserDetails | null> {
    const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute('SELECT * FROM user_details WHERE email = ?', [email]);
    if(rows.length == 0) {
      return null;
    }
    return rows[0] as IUserDetails;
}

export async function getUserVideosByEmail(email: string): Promise<IVideoDetails[]> {
  const query = `SELECT yvd.*, CASE
                  WHEN ycs.videoId IS NOT NULL THEN 1
                  ELSE 0
                END AS summary_status
                FROM youtube_video_details yvd 
                JOIN youtube_comments_summary ycs ON ycs.videoId = yvd.videoId
                WHERE videoId in 
                (SELECT uvm.videoId 
                FROM user_video_mapping uvm 
                INNER JOIN user_details ud ON uvm.userId = ud.userId 
                WHERE ud.email = ?)`;
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [email]);
  return rows as IVideoDetails[];
}

export async function createNewUser(userDetails: IUserDetails): Promise<boolean> {
  const query = 'INSERT INTO user_details (firstName, lastName, email, createdOn, updatedOn, status, credits) VALUES (?, ?, ?, ?, ?, ?, ?)';
  try {
    const createdOn = getMySqlTimeString(userDetails.createdOn)
    const updatedOn = getMySqlTimeString(userDetails.updatedOn)
    await connection.execute(query, [userDetails.firstName, userDetails.lastName, userDetails.email, createdOn, updatedOn, 1, 0]);
  } catch(error) {
    console.log(error);
    return false;
  }
  return true;
}

export async function getVideoDetails(videoId: string, email: string): Promise<IVideoDetails | null> {
  const query = `SELECT yvd.*, CASE
                  WHEN ycs.videoId IS NOT NULL THEN 1
                  ELSE 0
                END AS summary_status
                FROM youtube_video_details yvd
                JOIN user_video_mapping uvm ON yvd.videoId = uvm.videoId
                JOIN user_details ud ON uvm.userId = ud.userId
                JOIN youtube_comments_summary ycs ON ycs.videoId = yvd.videoId 
                WHERE yvd.videoId = ? AND ud.email = ?`;
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [videoId, email]);
  if(rows.length == 0)
    return null 
  return rows[0] as IVideoDetails;
}

export async function getSentimentCountByVideoId(videoId: string, email: string): Promise<ISentimentCount[]> {
  const query = `SELECT Sentiment AS type, COUNT(*) AS count FROM youtube_comments yc
                JOIN user_video_mapping uvm ON uvm.videoId = yc.videoId
                JOIN user_details ud ON uvm.userId = ud.userId 
                WHERE yc.videoId = ? AND ud.email = ? GROUP BY sentiment`;
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [videoId, email]);
  return rows as ISentimentCount[];
}

export async function getIntentCountByVideoId(videoId: string, email: string): Promise<IIntentCount[]> {
  const query = `SELECT Intent AS type, COUNT(*) AS count FROM youtube_comments yc
                JOIN user_video_mapping uvm ON uvm.videoId = yc.videoId
                JOIN user_details ud ON uvm.userId = ud.userId 
                WHERE yc.videoId = ? AND ud.email = ? GROUP BY intent`;
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [videoId, email]);
  return rows as IIntentCount[];
}

export async function getOffensiveCountByVideoId(videoId: string, email: string): Promise<IOffensiveCount[]> {
  const query = `SELECT Offensive AS type, COUNT(*) AS count FROM youtube_comments yc
                JOIN user_video_mapping uvm ON uvm.videoId = yc.videoId
                JOIN user_details ud ON uvm.userId = ud.userId 
                WHERE yc.videoId = ? AND ud.email = ? GROUP BY offensive`;
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [videoId, email]);
  return rows as IOffensiveCount[];
}

export async function getCommentsSummary(videoId: string, email: string): Promise<ICommentsSummary | null> {
  const query = `SELECT * FROM youtube_comments_summary ycs
                JOIN user_video_mapping uvm ON uvm.videoId = ycs.videoId
                JOIN user_details ud ON uvm.userId = ud.userId 
                WHERE ycs.videoId = ? AND ud.email = ?`;
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [videoId, email]);
  if(isNullOrEmpty(rows)) {
    return null;
  }
  const result = rows[0];
  return {
    topTopics: result["top_topics"],
    positiveFeedback: result["positive_topics"],
    negativeFeedback: result["negative_topics"],
    suggestions: result["suggestion_topics"]
  };
}

export async function getPendingVideoIdsByUser(email: string): Promise<string[] | null> {
  const query = `SELECT uvm.videoId FROM user_video_mapping uvm
                JOIN user_details ud ON uvm.userId = ud.userId
                WHERE ud.email = ? AND uvm.videoId NOT IN (SELECT DISTINCT videoId FROM youtube_video_details)`
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [email]);
  if(isNullOrEmpty(rows)) {
    return null;
  }
  return rows.map(x => x["videoId"]);
}

export async function getCommentsByVideoId(request: IGetCommentsRequest, email: string): Promise<IYoutubeComments | null> {
  console.log("request: ", request);
  const offset = (request.pageNumber-1) * request.recordsPerPage;
  const queryParams = [];
  let query = `SELECT yc.*, COUNT(*) OVER() as totalCount FROM youtube_comments yc
                JOIN user_video_mapping uvm ON yc.videoId = uvm.videoId
                JOIN user_details ud ON ud.userId = uvm.userId
                WHERE yc.videoId = ? AND ud.email = ? `;
  queryParams.push(...[request.videoId, email]);
  if(!isNullOrEmpty(request.columnFilters)) {
    request.columnFilters.map(filter => {
      filter.field = filter.field?.trim();
      if(['Sentiment', 'Offensive', 'Intent'].indexOf(filter.field) != -1 && !isNullOrEmpty(filter.values)) {
        query += ` AND yc.${filter.field} IN ( ? ) `;
        queryParams.push(filter.values);
      }
    });
  }
  query += ` GROUP BY yc.id, uvm.userId LIMIT ? , ?`;
  queryParams.push(...[offset, request.recordsPerPage]);
  console.log("query: ", query);
  console.log("params: ", queryParams);
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.query(query, queryParams);
  if(rows.length == 0) {
    return null;
  }
  const totalCount = rows[0]["totalCount"]
  const comments = rows.map(x => {
    delete x["id"];
    delete x["totalCount"];
    return x;
  })
  const response: IYoutubeComments = {
    totalCount: totalCount,
    comments: comments as IYoutubeComment[],
  }
  return response;
}

/// return true if video needs to be processed and false if it has been already processed for analysis
export async function processVideoByVideoId(videoId: string, createdOn: Date, email: string): Promise<boolean> {
  // return if videoId already exist/inprogress for given user
  const query1 = `SELECT * FROM user_video_mapping uvm
                  JOIN user_details ud ON uvm.userId = ud.userId 
                  WHERE uvm.videoId=? AND ud.email=?`;
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query1, [videoId, email]);
  if(rows.length > 0) {
    return false;
  }

  // insert into user_video_mapping table
  const query2 = `INSERT INTO user_video_mapping (videoId, userId, createdOn)
                  SELECT ?, userId, ? FROM user_details
                  WHERE email = ?`;
  const createdOnString = getMySqlTimeString(createdOn);
  await connection.execute(query2, [videoId, createdOnString, email]);

  // check if videoId already exist/processed previously
  const query3 = `SELECT * FROM user_video_mapping WHERE videoId = ? LIMIT 2`
  const [rows3, _3]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query3, [videoId]);
  if(rows3.length > 1) {
    return false;
  }
  return true;
}

export async function checkFreeEntryForToday(email: string): Promise<boolean> {
  const FREE_DAILY_LIMIT = 1; 
  const query = `SELECT COUNT(*) AS free_entry_count
                FROM usage_audit ua
                JOIN user_details ud ON ua.userId = ud.userId
                WHERE ud.email = ? 
                AND DATE(ua.createdOn)=CURDATE() 
                AND ua.creditUsage = 0`
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [email]);
  return rows[0]['free_entry_count'] < FREE_DAILY_LIMIT;
}

export async function getAvailableCredits(email: string): Promise<number> {
  const query = `SELECT credits FROM user_details WHERE email = ?`
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [email]);
  return rows[0]["credits"];
}

export async function addTransaction(email: string, videoId: string, creditUsage: number, transactionType: string) {
  const query = `INSERT INTO usage_audit (userId, videoId, creditUsage, transactionType, createdOn) 
                SELECT userId, ?, ?, ?, ? FROM user_details ud
                WHERE ud.email = ?`;
  const createdOnString = getMySqlTimeString(new Date());
  await connection.execute(query, [videoId, creditUsage, transactionType, createdOnString, email]);
}

function getMySqlTimeString(datetime: Date): string {
  return datetime.toISOString().slice(0, 19).replace("T", " ");
}