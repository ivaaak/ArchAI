import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    name?: string;
    position?: string;
    email?: string;
    image?: string;
    customerId?: string;
    priceId?: string;
    hasAccess?: boolean;
}
