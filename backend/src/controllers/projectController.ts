import express from 'express';
import { Filter } from 'mongodb';
import { collections } from '../database';
import Project from '../models/project';
import { HttpError, asyncHandler, parseObjectId, requireCollection, withoutId } from '../utils/http';

const projectController = express.Router();

// GET /api/projects/?auth0UserId=
projectController.get('/', asyncHandler(async (req, res) => {
    console.log("projectService / GET /api/projects/ called");
    const filter: Filter<Project> = {};
    if (typeof req.query.auth0UserId === 'string') {
        filter.auth0UserId = req.query.auth0UserId;
    }
    const projects = await requireCollection(collections.projects).find(filter).sort({ _id: -1 }).toArray();
    res.json(projects);
}));

// GET /api/projects/:id
projectController.get('/:id', asyncHandler(async (req, res) => {
    const project = await requireCollection(collections.projects).findOne({ _id: parseObjectId(req.params.id) });
    if (!project) {
        throw new HttpError(404, 'Project not found');
    }
    res.json(project);
}));

// POST /api/projects/
projectController.post('/', asyncHandler(async (req, res) => {
    console.log("projectService / POST /api/projects/ called");
    const { title, auth0UserId } = req.body;
    if (!title || !auth0UserId) {
        throw new HttpError(400, 'title and auth0UserId are required');
    }
    const now = new Date();
    const newProject: Project = {
        images: [],
        prompts: [],
        ...withoutId(req.body),
        title: String(title),
        auth0UserId: String(auth0UserId),
        createdAt: now,
        updatedAt: now,
    };
    const result = await requireCollection(collections.projects).insertOne(newProject);
    res.status(201).json({ message: "Project created successfully", projectId: result.insertedId });
}));

// PUT /api/projects/:id
projectController.put('/:id', asyncHandler(async (req, res) => {
    console.log("projectService / PUT /api/projects/:id called");
    const result = await requireCollection(collections.projects).findOneAndUpdate(
        { _id: parseObjectId(req.params.id) },
        { $set: { ...withoutId(req.body), updatedAt: new Date() } },
        { returnDocument: 'after' }
    );
    if (!result) {
        throw new HttpError(404, 'Project not found');
    }
    res.json(result);
}));

// DELETE /api/projects/:id
projectController.delete('/:id', asyncHandler(async (req, res) => {
    console.log("projectService / DELETE /api/projects/:id called");
    const result = await requireCollection(collections.projects).deleteOne({ _id: parseObjectId(req.params.id) });
    if (result.deletedCount === 0) {
        throw new HttpError(404, 'Project not found');
    }
    res.status(204).send();
}));

export default projectController;
