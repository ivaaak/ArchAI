import express from 'express';
import { collections } from '../database'; // Assuming you have a database module that exports collections
import { ObjectId } from 'mongodb';
import Project from '../models/project';

const projectController = express.Router();

// GET /api/projects/
projectController.get('/', async (req, res) => {
    console.log("projectService / GET /api/projects/ called");
    try {
        const projects = await collections.projects?.find().toArray();
        if (projects) {
            res.json(projects);
        } else {
            res.status(404).send('No projects found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving projects');
    }
});

// POST /api/projects/
projectController.post('/', async (req, res) => {
    console.log("projectService / POST /api/projects/ called");
    const newProject: Project = req.body;
    try {
        const result = await collections.projects?.insertOne(newProject);
        if (result) {
            res.status(201).json({ message: "Project created successfully", projectId: result.insertedId });
        } else {
            res.status(500).json({ message: "Error creating project" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Error creating project", error: err.message });
    }
});

// PUT /api/projects/:id
projectController.put('/:id', async (req, res) => {
    console.log("projectService / PUT /api/projects/:id called");
    try {
        const updatedProject = req.body;
        const id = new ObjectId(req.params.id);
        const result = await collections.projects?.updateOne({ _id: id }, { $set: updatedProject });
        if (result && result.modifiedCount > 0) {
            res.send(updatedProject);
        } else {
            res.status(404).send('Project not found');
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Error updating project", error: err.message });
    }
});

// DELETE /api/projects/:id
projectController.delete('/:id', async (req, res) => {
    console.log("projectService / DELETE /api/projects/:id called");
    try {
        const id = new ObjectId(req.params.id);
        const result = await collections.projects?.deleteOne({ _id: id });
        if (result && result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).send('Project not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting project');
    }
});

// Export the router
export default projectController;
