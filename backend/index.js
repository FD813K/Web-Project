import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const [{ default: app }, { connectToDatabase }] = await Promise.all([
  import("./app.js"),
  import("./config/database.js"),
]);
const port = Number(process.env.PORT) || 5000;

try {
  await connectToDatabase();
  console.log("Connected to MongoDB.");
  app.listen(port, () => {
    console.log(`CoursePortal backend running on port ${port}`);
  });
} catch (error) {
  const message = error.message === "MONGODB_URI is not configured in backend/.env"
    ? error.message
    : "Check the Atlas URI, IP access list, and database-user permissions.";
  console.error("MongoDB connection failed.", message);
  process.exitCode = 1;
}
