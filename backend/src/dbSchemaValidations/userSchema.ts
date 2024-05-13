export const userJsonSchema = {
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
                description: "'name' is optional and is a string that may be trimmed and converted to lowercase",
            },
            email: {
                bsonType: "string",
                description: "'email' is optional and is a string that may be trimmed, converted to lowercase, and marked as private",
            },
            image: {
                bsonType: "string",
                description: "'image' is optional and is a string",
            },
            customerId: {
                bsonType: "string",
                description: "'customerId' is optional and is a string that should include 'cus_'",
            },
            priceId: {
                bsonType: "string",
                description: "'priceId' is optional and is a string that should include 'price_'",
            },
            // hasAccess: {
            //     bsonType: "boolean",
            //     description: "'hasAccess' is optional and is a boolean with a default value of false",
            // },
        },
    },
};
