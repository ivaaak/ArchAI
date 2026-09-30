import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import { FRONTEND_URL, PORT, UPLOADS_DIR, UPLOADS_ROUTE } from "./config";
import routes from "./routes";
import { connectToDatabase } from "./database";
import { HttpError } from "./utils/http";

const { ATLAS_URI } = process.env;
const app = express();

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in backend/.env"
  );
  process.exit(1);
}
if (!process.env.REPLICATE_API_TOKEN) {
  console.warn("REPLICATE_API_TOKEN is not set - image generation requests will fail.");
}

// Turns thrown errors into JSON responses: { error: message }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  let status = 500;
  let message = "Something went wrong";

  if (error instanceof HttpError) {
    ({ status, message } = error);
  } else if (error instanceof multer.MulterError) {
    status = 400;
    message = error.message;
  } else if (error instanceof Error) {
    console.error(error);
    // Replicate API errors carry a useful message (e.g. NSFW content detected, invalid input)
    const replicateStatus = (error as Error & { response?: { status?: number } }).response?.status;
    if (replicateStatus) {
      status = 502;
      // Replicate messages end with the raw JSON body - show only its "detail" when there is one
      const detail = error.message.match(/"detail"\s*:\s*"([^"]+)"/)?.[1];
      message = `Image model error: ${detail || error.message}`;
    }
  }
  res.status(status).json({ error: message });
}

async function startServer() {
  await connectToDatabase(ATLAS_URI!);

  const allowedOrigins = [FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"];
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: "20mb" }));

  // Static image serving for uploads. /src/uploads is kept for images stored by older versions.
  app.use(UPLOADS_ROUTE, express.static(UPLOADS_DIR));
  app.use('/src/uploads', express.static(UPLOADS_DIR));

  app.use('/api', routes); // Prefix all routes with '/api'
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the server:", error);
  process.exit(1);
});
