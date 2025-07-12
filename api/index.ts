// In api/index.ts
import 'dotenv/config';
import express from "express";
import { registerRoutes } from "../server/routes.js"; // Static import

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Call the function directly and synchronously
registerRoutes(app);

// Export the fully configured app for Vercel
export default app;