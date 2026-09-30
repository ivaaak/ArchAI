import express from 'express';
import { collections } from '../database';
import { Lead } from '../models/lead';
import { HttpError, asyncHandler, requireCollection } from '../utils/http';

const leadController = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Store the leads that are generated from the landing page.
// Duplicate emails just return 200 OK
leadController.post('/', asyncHandler(async (req, res) => {
  const leads = requireCollection(collections.leads);
  const email = String(req.body.email ?? '').trim().toLowerCase();

  if (!email) {
    throw new HttpError(400, "Email is required");
  }
  if (!EMAIL_PATTERN.test(email)) {
    throw new HttpError(400, "Please enter a valid email address");
  }

  const existingLead = await leads.findOne({ email });
  if (existingLead) {
    return res.status(200).json({ message: "Already subscribed", id: existingLead._id });
  }

  const newLead: Lead = {
    email,
    timestamp: new Date(),
  };
  const result = await leads.insertOne(newLead);
  // TODO: send a welcome email (mailgun)
  res.status(201).json({ message: "Lead created successfully", id: result.insertedId });
}));

export default leadController;
