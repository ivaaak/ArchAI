import * as mongodb from "mongodb";

export interface Employee {
    _id?: mongodb.ObjectId;
    officeId?: mongodb.ObjectId;
    name?: string;
    position?: string;
    level?: "junior" | "mid" | "senior";
}
