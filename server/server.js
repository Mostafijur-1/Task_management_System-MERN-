import express from "express";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/auth.js";
import taskRouter from "./routes/tasks.js";
import projectRouter from "./routes/projects.js";
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", router);
app.use("/api/task", taskRouter);
app.use("/api/project", projectRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

connectDB();
