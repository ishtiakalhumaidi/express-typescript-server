import { pool } from "../../config/db";

const createTodo = async (
  user_id: string,
  title: string,
  description: string,
  completed: boolean,
  due_date: string
) => {
  const result = await pool.query(
    `
        INSERT INTO todos(user_id, title, description, completed, due_date) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [user_id, title, description, completed, due_date]
  );
  return result;
};

const getTodos = async () => {
  const result = await pool.query(`
      SELECT * FROM todos
      `);
  return result;
};

const getSingleTodo = async (id: string) => {
  const result = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
  return result
};

const updateTodo = async (title:string, completed:boolean, id:string)=>{
    const result = await pool.query(
      "UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
      [title, completed, id]
    );
    return result
}

const deleteTodo = async (id:string) => {
    const result = await pool.query(
      "DELETE FROM todos WHERE id=$1 RETURNING *",
      [id]
    );
    return result
}

export const todoServices = {
  createTodo,
  getTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo
};
