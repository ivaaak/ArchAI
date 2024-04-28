import * as dotenv from "dotenv";
import express from "express";
import routes from "./routes";
import cors from "cors";
import path from "path";
import { connectToDatabase } from "./database";

dotenv.config();
const { ATLAS_URI } = process.env;
const app = express();
const port = 3000;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}


async function startServer() {
  await connectToDatabase(ATLAS_URI!);

  // Use the routes module
  app.use(cors());
  app.use(express.json());
  app.use('/src/uploads', express.static(path.join(__dirname, 'uploads'))); // Static image serving for uploads
  app.use('/api', routes); // Prefix all routes with '/api'

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((error) => console.error(error));