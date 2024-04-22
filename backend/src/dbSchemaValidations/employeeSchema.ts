export const employeeJsonSchema = {
    $jsonSchema: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
            _id: {
                bsonType: "objectId",
                description: "'_id' is an optional ObjectId",
            },
            officeId: {
                bsonType: "objectId",
                description: "'officeId' is an optional ObjectId",
            },
            name: {
                bsonType: "string",
                description: "'name' is optional and is a string",
            },
            position: {
                bsonType: "string",
                description: "'position' is optional and is a string with a minimum length of 5",
                minLength: 5,
            },
            level: {
                bsonType: "string",
                description: "'level' is optional and is one of 'junior', 'mid', or 'senior'",
                enum: ["junior", "mid", "senior"],
            },
        },
    },
};