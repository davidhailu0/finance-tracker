import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../validators/authValidators";
import { registerUser, loginUser } from "../services/authService";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const result = await registerUser(value.name, value.email, value.password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const result = await loginUser(value.email, value.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
