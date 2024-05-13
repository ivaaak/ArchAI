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
  usereId: string;
  title: string;
  description: string;
  images: Image[];
  prompts: Prompt[];
}

export default Project;
