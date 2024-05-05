import express from 'express';
import { collections } from '../database';
import { Lead } from '../models/lead';

const leadService = express.Router();

// Store the leads that are generated from the landing page.
// Duplicate emails just return 200 OK
leadService.post('/', async (req, res) => {

  const body = req.body;

  if (!body.email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const existingLead = await collections.leads?.findOne({ email: body.email });

    if (!existingLead) {
      const newLead: Lead = {
        email: body.email,
        timestamp: new Date(),
      }

      const result = await collections.leads?.insertOne(newLead);
      if (result) {
        res.status(201).json({ message: "Lead created successfully", id: result.insertedId });
        // Send a welcome email /mailgun
    } else {
        res.status(500).json({ message: "Error creating lead" });
    }
    }

    res.json({});
  } catch (e) {
    const err = e as Error;
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default leadService;
