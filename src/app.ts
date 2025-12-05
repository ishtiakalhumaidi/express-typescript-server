import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import initDB, { pool } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { todoRouter } from "./modules/todo/todo.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();

// parser
app.use(express.json());
// app.use(express.urlencoded());

// initializing db
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello friends!");
});

// logger middleware

// user CRUD
app.use("/users", userRoutes);

// todos CRUD
app.use("/todos", todoRouter);

// auth routes
app.use("/auth", authRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "route not found",
    path: req.path,
  });
});

export default app;
