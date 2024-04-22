import express from 'express';
import { collections } from '../database'; // Assuming you have a database module that exports collections
import { ObjectId } from 'mongodb';
import { Employee } from '../models/employee';
const employeeService = express.Router();

// GET /api/employees/
employeeService.get('/', async (req, res) => {
    console.log("employeesService / GET /api/employees/ called");
    try {
        const employees = await collections.employees?.find().toArray();
        if (employees) {
            res.json(employees);
        } else {
            res.status(404).send('No employees found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving employees');
    }
});

// POST /api/employees/
employeeService.post('/', async (req, res) => {
    console.log("employeesService / POST /api/employees/ called");
    const newEmployee: Employee = req.body;
    //newEmployee._id = new ObjectId(req.body.id);
    console.log("newEmployee", newEmployee)
    try {
        const result = await collections.employees?.insertOne(newEmployee);
        if (result) {
            res.status(201).json({ message: "Employee created successfully", employeeId: result.insertedId });
        } else {
            res.status(500).json({ message: "Error creating employee" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Error creating employee", error: err.message });
    }
});

// PUT /api/employees/id
employeeService.put('/:id', async (req, res) => {
    console.log("employeesService / PUT /api/employees/:id called");
    try {
        const updatedEmployee = req.body;
        const id = new ObjectId(req.params.id);
        const result = await collections.employees?.updateOne({ _id: id }, { $set: updatedEmployee });
        if (result && result.modifiedCount > 0) {
            res.send(updatedEmployee);
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Error creating employee", error: err.message });
    }
});

// DELETE /api/employees/id
employeeService.delete('/:id', async (req, res) => {
    console.log("employeesService / DELETE /api/employees/:id called");
    try {
        const id = new ObjectId(req.params.id);
        const result = await collections.employees?.deleteOne({ _id: id });
        if (result && result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting employee');
    }
});

// Export the router
export default employeeService;
