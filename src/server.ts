import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = 5000;

// parser
app.use(express.json());
// app.use(express.urlencoded());

// absolute path to log folder
const logDir = path.join(__dirname, "..", "log");
const logFile = path.join(logDir, "app.log");

// ensure log folder exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// DB
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async () => {
  await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            age INT,
            phone VARCHAR(15),
            address TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);

  await pool.query(`
            CREATE TABLE IF NOT EXISTS todos(
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello friends!");
});

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  const logText = `[${new Date().toISOString()}] ${req.method} ${req.path}\n`;

  fs.appendFile(logFile, logText, (err) => {
    if (err) console.error("Failed to write log:", err);
  });

  console.log(logText.trim());
  next();
};

// user CRUD
app.post("/users", logger, async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;

  try {
    const result = await pool.query(
      `
        INSERT INTO users(name, email, age, phone, address) VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [name, email, age, phone, address]
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
});

app.get("/users", logger, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `);
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
});

app.get("/users/:id", logger, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id = $1
      `,
      [id]
    );
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
});

app.put("/users/:id", logger, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, age, phone, address } = req.body;

  try {
    const result = await pool.query(
      `
     UPDATE users SET name=$1, email=$2, age=$3, phone=$4, address=$5 WHERE id=$6 RETURNING *
      `,
      [name, email, age, phone, address, id]
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
});

app.delete("/users/:id", logger, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      DELETE FROM users WHERE id = $1 RETURNING *
      `,
      [id]
    );
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
});

// todos CRUD
app.post("/todos", logger, async (req: Request, res: Response) => {
  const { user_id, title, description, completed, due_date } = req.body;

  try {
    const result = await pool.query(
      `
        INSERT INTO todos(user_id, title, description, completed, due_date) VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [user_id, title, description, completed, due_date]
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
});

app.get("/todos", logger, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM todos
      `);
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
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
