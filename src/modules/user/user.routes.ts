import { Router, type Request, type Response } from "express";
import logger from "../../middleware/logger";
import { userControllers } from "./user.controller";

const router = Router();

router.post("/", logger, userControllers.createUser);
router.get("/", logger, userControllers.getUsers);
router.get("/:id", logger, userControllers.getSingleUser);
router.put("/:id", logger, userControllers.putUser);
router.delete("/:id", logger, userControllers.deleteUser);

export const userRoutes = router;
