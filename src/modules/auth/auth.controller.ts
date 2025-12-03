import type { Request, Response } from "express";
import { authServices } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.loginUser(email, password);

    switch (result) {
      case null:
        res.status(404).json({
          success: false,
          message: "User not found!",
        });
        break;
      case false:
        res.status(401).json({
          success: false,
          message: "Incorrect password!",
        });
        break;

      default:
        res.status(200).json({
          success: true,
          message: "Login successful!",
          data: result,
        });
        break;
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authController = {
  loginUser,
};
