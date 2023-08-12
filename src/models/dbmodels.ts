import { RowDataPacket } from "mysql2";

export interface IUserDetails {
    firstName : string;
    lastName : string;
    email : string;
    createdOn : Date;
    updatedOn : Date;
    status : number;
}