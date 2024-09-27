import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import jwtAuthRoutes from "./routes/jwtAuth.js";
import dashboardRoutes from "./routes/dashboard.js";
import boooksRoutes from "./routes/books.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js";
import friendRoutes from "./routes/friend.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(cors());

//register and login routes
app.use("/auth", jwtAuthRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/books", boooksRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/friend", friendRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html")); // Serve the React app
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
