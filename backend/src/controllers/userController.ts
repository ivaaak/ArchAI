import express from 'express';
import { collections } from '../database';
import { User } from '../models/user';
import { HttpError, asyncHandler, parseObjectId, requireCollection, withoutId } from '../utils/http';

const userController = express.Router();

// Only these fields may be written by clients (the collection rejects unknown fields)
const WRITABLE_FIELDS: (keyof User)[] = ['auth0Id', 'name', 'position', 'email', 'image'];

function pickWritable(body: Record<string, unknown>): Partial<User> {
    const user: Record<string, unknown> = {};
    for (const field of WRITABLE_FIELDS) {
        if (typeof body[field] === 'string') {
            user[field] = (body[field] as string).trim();
        }
    }
    return user as Partial<User>;
}

// GET /api/users/
userController.get('/', asyncHandler(async (_req, res) => {
    console.log("usersService / GET /api/users/ called");
    const users = await requireCollection(collections.users).find().toArray();
    res.json(users);
}));

// GET /api/users/auth0/:auth0Id
userController.get('/auth0/:auth0Id', asyncHandler(async (req, res) => {
    const user = await requireCollection(collections.users).findOne({ auth0Id: req.params.auth0Id });
    if (!user) {
        throw new HttpError(404, 'User not found');
    }
    res.json(user);
}));

// POST /api/users/ - creates a user, or updates the existing one with the same auth0Id
userController.post('/', asyncHandler(async (req, res) => {
    console.log("usersService / POST /api/users/ called");
    const users = requireCollection(collections.users);
    const newUser = pickWritable(req.body);

    if (newUser.auth0Id) {
        const result = await users.findOneAndUpdate(
            { auth0Id: newUser.auth0Id },
            { $set: newUser, $setOnInsert: { hasAccess: false } },
            { upsert: true, returnDocument: 'after' }
        );
        return res.status(200).json({ message: "user synced successfully", userId: result?._id, user: result });
    }

    const result = await users.insertOne({ ...newUser, hasAccess: false });
    res.status(201).json({ message: "user created successfully", userId: result.insertedId });
}));

// PUT /api/users/:id
userController.put('/:id', asyncHandler(async (req, res) => {
    console.log("usersService / PUT /api/users/:id called");
    const update = pickWritable(withoutId(req.body));
    const result = await requireCollection(collections.users).findOneAndUpdate(
        { _id: parseObjectId(req.params.id) },
        { $set: update },
        { returnDocument: 'after' }
    );
    if (!result) {
        throw new HttpError(404, 'user not found');
    }
    res.json(result);
}));

// DELETE /api/users/:id
userController.delete('/:id', asyncHandler(async (req, res) => {
    console.log("usersService / DELETE /api/users/:id called");
    const result = await requireCollection(collections.users).deleteOne({ _id: parseObjectId(req.params.id) });
    if (result.deletedCount === 0) {
        throw new HttpError(404, 'user not found');
    }
    res.status(204).send();
}));

export default userController;
