import type { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const logText = `[${new Date().toISOString()}] ${req.method} ${req.path}\n`;

  console.log(logText.trim());
  next();
};

export default logger;
