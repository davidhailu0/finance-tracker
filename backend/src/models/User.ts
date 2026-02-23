import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface UserAttrs {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttrs = Optional<
  UserAttrs,
  "id" | "avatarUrl" | "createdAt" | "updatedAt"
>;

export class User
  extends Model<UserAttrs, UserCreationAttrs>
  implements UserAttrs
{
  public id!: number;
  public name!: string;
  public email!: string;
  public passwordHash!: string;
  public avatarUrl!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    avatarUrl: { type: DataTypes.STRING(255), allowNull: true },
  },
  { sequelize, tableName: "users", timestamps: true }
);
