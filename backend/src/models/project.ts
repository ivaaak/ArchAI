import { ObjectId } from 'mongodb';

interface Image {
  url: string;
  description?: string;
}

interface Prompt {
  text: string;
  type: string; // e.g., "open-ended", "multiple-choice"
}

interface Project {
  _id: ObjectId;
  auth0UserId: string; // Assuming this is the Auth0 user ID
  employeeId: string; // Assuming this is the ID of the associated employee
  title: string;
  description: string;
  images: Image[];
  prompts: Prompt[];
}

export default Project;
