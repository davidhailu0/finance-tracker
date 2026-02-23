import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface TransactionAttrs {
  id: number;
  userId: number;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type TransactionCreationAttrs = Optional<
  TransactionAttrs,
  "id" | "createdAt" | "updatedAt"
>;

export class Transaction
  extends Model<TransactionAttrs, TransactionCreationAttrs>
  implements TransactionAttrs
{
  public id!: number;
  public userId!: number;
  public amount!: number;
  public type!: "income" | "expense";
  public category!: string;
  public description!: string;
  public date!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    type: {
      type: DataTypes.ENUM("income", "expense"),
      allowNull: false,
    },
    category: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, tableName: "transactions", timestamps: true }
);
