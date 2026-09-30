import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    // Auth0 user id (user.sub)
    auth0Id?: string;
    officeId?: ObjectId;
    name?: string;
    position?: string;
    email?: string;
    image?: string;
    customerId?: string;
    priceId?: string;
    hasAccess?: boolean;
}
