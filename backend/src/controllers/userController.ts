import express from 'express';
import { collections } from '../database'; // Assuming you have a database module that exports collections
import { ObjectId } from 'mongodb';
import { User } from '../models/user';
const userController = express.Router();

// GET /api/users/
userController.get('/', async (req, res) => {
    console.log("usersService / GET /api/users/ called");
    try {
        const users = await collections.users?.find().toArray();
        if (users) {
            res.json(users);
        } else {
            res.status(404).send('No users found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving users');
    }
});

// POST /api/users/
userController.post('/', async (req, res) => {
    console.log("usersService / POST /api/users/ called");
    const newuser: User = req.body;
    //newuser._id = new ObjectId(req.body.id);
    console.log("newuser", newuser)
    try {
        const result = await collections.users?.insertOne(newuser);
        if (result) {
            res.status(201).json({ message: "user created successfully", userId: result.insertedId });
        } else {
            res.status(500).json({ message: "Error creating user" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
});

// PUT /api/users/id
userController.put('/:id', async (req, res) => {
    console.log("usersService / PUT /api/users/:id called");
    try {
        const updateduser = req.body;
        const id = new ObjectId(req.params.id);
        const result = await collections.users?.updateOne({ _id: id }, { $set: updateduser });
        if (result && result.modifiedCount > 0) {
            res.send(updateduser);
        } else {
            res.status(404).send('user not found');
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
});

// DELETE /api/users/id
userController.delete('/:id', async (req, res) => {
    console.log("usersService / DELETE /api/users/:id called");
    try {
        const id = new ObjectId(req.params.id);
        const result = await collections.users?.deleteOne({ _id: id });
        if (result && result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).send('user not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
});

// Export the router
export default userController;
