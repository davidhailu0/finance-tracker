import { Op } from "sequelize";
import { User } from "../models/User";

export async function listUsers(params: {
  page?: string;
  limit?: string;
  search?: string;
}) {
  const { page = 1, limit = 10, search } = params;

  const where: any = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await User.findAndCountAll({
    where,
    attributes: ["id", "name", "email", "avatarUrl", "createdAt"],
    limit: Number(limit),
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    users: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / Number(limit)),
    },
  };
}

export async function updateUser(
  userId: number,
  data: Partial<{ name: string; email: string; avatarUrl: string }>
) {
  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: "User not found" };
  await user.update(data);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatarUrl,
  };
}
