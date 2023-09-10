import * as mysql from 'mysql2/promise'
import { IIntentCount, IOffensiveCount, ISentimentCount, IUserDetails, IVideoDetails } from '../models/dbmodels.js';

var connection = await mysql.createConnection({
    host     :  process.env.DB_HOST,
    port     :  process.env.DB_PORT,
    user     :  process.env.DB_USER,
    password :  process.env.DB_PASSWORD,
    database :  process.env.DB_NAME
  });

export async function getUserByEmail(email: string): Promise<IUserDetails | null> {
    const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute('SELECT * FROM user_details WHERE email = ?', [email]);
    console.log(rows);
    if(rows.length == 0) {
      return null;
    }
    return rows[0] as IUserDetails;
}

export async function getUserVideosByEmail(email: string): Promise<IVideoDetails[]> {
  const query = `SELECT * FROM youtube_video_details WHERE videoId in 
                (SELECT uvm.videoId 
                FROM user_video_mapping uvm 
                INNER JOIN user_details ud ON uvm.userId = ud.userId 
                WHERE ud.email = ?)`;
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [email]);
  return rows as IVideoDetails[];
}

export async function createNewUser(userDetails: IUserDetails): Promise<boolean> {
  const query = 'INSERT INTO user_details (firstName, lastName, email, createdOn, updatedOn, status) VALUES (?, ?, ?, ?, ?, ?)';
  try {
    const createdOn = getMySqlTimeString(userDetails.createdOn)
    const updatedOn = getMySqlTimeString(userDetails.updatedOn)
    await connection.execute(query, [userDetails.firstName, userDetails.lastName, userDetails.email, createdOn, updatedOn, 1]);
  } catch(error) {
    console.log("Error inserting into database!", query, userDetails);
    console.log(error);
    return false;
  }
  return true;
}

export async function getVideoDetails(videoId: string, email: string): Promise<IVideoDetails | null> {
  const query = `SELECT * FROM youtube_video_details yvd
                JOIN user_video_mapping uvm ON yvd.videoId = uvm.videoId
                JOIN user_details ud ON uvm.userId = ud.userId
                WHERE yvd.videoId = ? AND ud.email = ?`;
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [videoId, email]);
  if(rows.length == 0)
    return null 
  return rows[0] as IVideoDetails;
}

export async function getSentimentCountByVideoId(videoId: string, email: string): Promise<ISentimentCount[]> {
  const query = `SELECT Sentiment AS sentiment, COUNT(*) AS count FROM youtube_comments yc
                JOIN user_video_mapping uvm ON uvm.videoId = yc.videoId
                JOIN user_details ud ON uvm.userId = ud.userId 
                WHERE yc.videoId = ? AND ud.email = ? GROUP BY sentiment`;
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [videoId, email]);
  return rows as ISentimentCount[];
}

export async function getIntentCountByVideoId(videoId: string, email: string): Promise<IIntentCount[]> {
  const query = `SELECT Intent AS intent, COUNT(*) AS count FROM youtube_comments yc
                JOIN user_video_mapping uvm ON uvm.videoId = yc.videoId
                JOIN user_details ud ON uvm.userId = ud.userId 
                WHERE yc.videoId = ? AND ud.email = ? GROUP BY intent`;
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [videoId, email]);
  return rows as IIntentCount[];
}

export async function getOffensiveCountByVideoId(videoId: string, email: string): Promise<IOffensiveCount[]> {
  const query = `SELECT Offensive AS offensive, COUNT(*) AS count FROM youtube_comments yc
                JOIN user_video_mapping uvm ON uvm.videoId = yc.videoId
                JOIN user_details ud ON uvm.userId = ud.userId 
                WHERE yc.videoId = ? AND ud.email = ? GROUP BY offensive`;
  const [rows, _]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await connection.execute(query, [videoId, email]);
  return rows as IOffensiveCount[];
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

function getMySqlTimeString(datetime: Date): string {
  return datetime.toISOString().slice(0, 19).replace("T", " ");
}