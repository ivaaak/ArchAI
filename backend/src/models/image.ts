import * as mongodb from "mongodb";

export interface Image {
    _id?: mongodb.ObjectId;
    userId?: mongodb.ObjectId;
    name?: string;
    imageData?: string;
    imageUrl?: string;
    createdAt?: Date;
}
