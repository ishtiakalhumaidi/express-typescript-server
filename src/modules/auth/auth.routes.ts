import { Router } from "express";
import logger from "../../middleware/logger";
import { authController } from "./auth.controller";

const router = Router();

router.post("/login", logger, authController.loginUser);

export const authRoutes = router;
