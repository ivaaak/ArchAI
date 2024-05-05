import * as mongodb from "mongodb";
import { employeeJsonSchema } from "./dbSchemaValidations/employeeSchema";
import { Employee } from "./models/employee";
import { Image } from "./models/image";
import { Lead } from "./models/lead";

export const collections: {
    employees?: mongodb.Collection<Employee>;
    images?: mongodb.Collection<Image>;
    leads?: mongodb.Collection<Image>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("archai");
    await applySchemaValidation(db);

    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;

    const imagesCollection = db.collection<Image>("images");
    collections.images = imagesCollection;

    const leadsCollection = db.collection<Lead>("lead");
    collections.leads = leadsCollection;
}


async function applySchemaValidation(db: mongodb.Db) {
    await db.command({
        collMod: "employees",
        validator: employeeJsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("employees", { validator: employeeJsonSchema });
        }
    });
}
