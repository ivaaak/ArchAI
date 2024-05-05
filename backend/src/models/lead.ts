import * as mongodb from "mongodb";

export interface Lead {
    _id?: mongodb.ObjectId;
    email?: string;
    timestamp?: Date;
}
