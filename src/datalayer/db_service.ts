import * as mysql from 'mysql2/promise'
import { IUserDetails } from '../models/dbmodels';

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

export async function getUserVideosByEmail(email: string) {
  const query = 'SELECT * FROM youtube_video_details WHERE videoId in (SELECT uvm.videoId FROM user_video_mapping uvm INNER JOIN user_details ud ON uvm.userId = ud.userId WHERE ud.email = ?)';
  const [rows, _] = await connection.execute(query, [email]);
  return rows;
}

export async function createNewUser(userDetails: IUserDetails) {
  const query = 'INSERT INTO user_details (firstName, lastName, email, createdOn, updatedOn, status) VALUES (?, ?, ?, ?, ?, ?)';
  const createdOn = userDetails.createdOn.toISOString().slice(0, 19).replace("T", " ");
  const updatedOn = userDetails.updatedOn.toISOString().slice(0, 19).replace("T", " ");
  const response = await connection.execute(query, [userDetails.firstName, userDetails.lastName, userDetails.email, createdOn, updatedOn]);
  console.log("Create user db response: ", response);
}


