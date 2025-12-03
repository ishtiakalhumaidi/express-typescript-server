import { Router } from "express";
import logger from "../../middleware/logger";
import { todoController } from "./todo.controller";

const router = Router();

router.post("/", logger, todoController.createTodo);
router.get("/", logger, todoController.getTodos);
router.get("/:id", logger, todoController.getSingleTodo);
router.put("/:id", logger, todoController.updateTodo);
router.delete("/:id", logger, todoController.deleteTodo);

export const todoRouter = router;
