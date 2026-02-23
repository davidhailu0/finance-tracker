import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { hashPassword, comparePassword } from "../utils/passwordUtils";
import { jwtConfig } from "../config/jwt";

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw { status: 409, message: "Email already in use" };

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash });
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    jwtConfig.secret as any,
    {
      expiresIn: jwtConfig.expiresIn as any,
    }
  );
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl,
      createdAt: user.createdAt,
    },
    token,
  };
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw { status: 401, message: "Invalid credentials" };

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) throw { status: 401, message: "Invalid credentials" };

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    jwtConfig.secret as any,
    {
      expiresIn: jwtConfig.expiresIn as any,
    }
  );
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl,
      createdAt: user.createdAt,
    },
    token,
  };
}
