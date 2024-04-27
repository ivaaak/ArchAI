import * as mongodb from "mongodb";

export interface Image {
    _id?: mongodb.ObjectId;
    employeeId?: mongodb.ObjectId;
    name?: string;
    imageData?: Buffer;
}
