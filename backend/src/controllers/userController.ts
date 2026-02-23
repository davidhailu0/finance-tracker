import { Request, Response, NextFunction } from "express";
import { userUpdateSchema } from "../validators/userValidators";
import { listUsers, updateUser } from "../services/userService";

export async function getUsers(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page, limit, search } = _req.query as {
      page?: string;
      limit?: string;
      search?: string;
    };
    const users = await listUsers({ page, limit, search });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { value, error } = userUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const me = (req as any).user;
    const updated = await updateUser(me.userId, value);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const me = (req as any).user;
    const file = (req as any).file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });
    const updated = await updateUser(me.userId, {
      avatarUrl: `/uploads/${file.filename}`,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
