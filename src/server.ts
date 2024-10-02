import "dotenv/config";
import express from "express";
import cors from "cors";
const PORT = 3000;
import connectDb from "./config/db";
import TeacherRoutes from './routes/teacherRoutes'
// import './utils/common'

require("dotenv").config();

const app = express();

connectDb();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());



app.use("/api/healthcheck", (req, res) => {
  res.status(200).send("Server is healthy");
});

app.use("/api/teacher",TeacherRoutes)
app.listen(PORT, () => console.log(`API server listening at ${PORT}`));
