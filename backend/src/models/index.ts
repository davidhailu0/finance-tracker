import { sequelize } from "../config/database";
import { User } from "./User";
import { Transaction } from "./Transaction";

User.hasMany(Transaction, { foreignKey: "userId", as: "transactions" });
Transaction.belongsTo(User, { foreignKey: "userId", as: "user" });

export { sequelize, User, Transaction };
