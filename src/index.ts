import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import posts from "./routes/posts.routes";
import users from "./routes/users.routes";

var pathfinderUI = require("pathfinder-ui");

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use(
  "/pathfinder",
  (req: Request, res: Response, next: NextFunction) => {
    pathfinderUI(app);
    next();
  },
  pathfinderUI.router
);

app.use("/users", users);
app.use("/posts", posts);

app.listen(process.env.PORT, () =>
  console.log(`http://localhost:${process.env.PORT}`)
);
