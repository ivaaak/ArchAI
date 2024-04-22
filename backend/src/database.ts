import * as mongodb from "mongodb";
import { employeeJsonSchema } from "./dbSchemaValidations/employeeSchema";
import { Employee } from "./models/employee";


export const collections: {
    employees?: mongodb.Collection<Employee>;
} = {};


export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("archai");
    await applySchemaValidation(db);

    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;
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
