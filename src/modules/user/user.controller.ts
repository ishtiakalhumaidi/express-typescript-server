import type { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {

  try {
    const result = await userServices.createUser(
     req.body
    );

    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "user inserted successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsers();
    res.status(200).json({
      success: true,
      message: "users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userServices.getSingleUser(id!);
    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "user retrieved successfully",
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "user has not found",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const putUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, age, phone, address } = req.body;

  try {
    const result = await userServices.putUser(
      name,
      email,
      age,
      phone,
      address,
      id as string
    );
    if (!(result.rows.length === 0)) {
      res.status(200).json({
        success: true,
        message: "user data updated successfully",
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userServices.deleteUser(id!);
    if (result.rowCount! > 0) {
      res.status(200).json({
        success: true,
        message: "user has been deleted successfully",
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "user has not found",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

export const userControllers = {
  createUser,
  getUsers,
  getSingleUser,
  putUser,
  deleteUser,
};
