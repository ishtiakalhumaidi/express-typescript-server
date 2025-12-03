import type { Request, Response } from "express";
import { todoServices } from "./todo.services";

const createTodo = async (req: Request, res: Response) => {
  const { user_id, title, description, completed, due_date } = req.body;

  try {
    const result = await todoServices.createTodo(
      user_id,
      title,
      description,
      completed,
      due_date
    );

    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "todos inserted successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getTodos();
    res.status(200).json({
      success: true,
      message: "todos retrieved successfully",
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

const getSingleTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getSingleTodo(req.params.id as string)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
}

const updateTodo=async (req:Request, res:Response) => {
  const { title, completed } = req.body;

  try {
    const result = await todoServices.updateTodo(title, completed, req.params.id as string)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
}

const deleteTodo =  async (req:Request, res:Response) => {
  try {
    const result = await todoServices.deleteTodo(req.params.id as string)

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted", data: null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
}

export const todoController = {
  createTodo,
  getTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo
};
