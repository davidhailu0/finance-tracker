import { Transaction } from "../models/Transaction";
import { Op } from "sequelize";
import { sequelize } from "../config/database";

interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: "income" | "expense";
  category?: string;
}

export async function createTransaction(
  userId: number,
  amount: number,
  type: "income" | "expense",
  category: string,
  description: string,
  date: string
) {
  const transaction = await Transaction.create({
    userId,
    amount,
    type,
    category,
    description,
    date: new Date(date),
  });
  return transaction;
}

export async function getTransactions(
  userId: number,
  filters: TransactionFilters = {}
) {
  const where: any = { userId };

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date[Op.gte] = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.date[Op.lte] = new Date(filters.endDate);
    }
  }

  const transactions = await Transaction.findAll({
    where,
    order: [["date", "DESC"]],
  });

  return transactions;
}

export async function getTransactionById(userId: number, transactionId: number) {
  const transaction = await Transaction.findOne({
    where: { id: transactionId, userId },
  });
  return transaction;
}

export async function updateTransaction(
  userId: number,
  transactionId: number,
  updates: {
    amount?: number;
    type?: "income" | "expense";
    category?: string;
    description?: string;
    date?: string;
  }
) {
  const transaction = await Transaction.findOne({
    where: { id: transactionId, userId },
  });

  if (!transaction) {
    return null;
  }

  const updateData: any = { ...updates };
  if (updates.date) {
    updateData.date = new Date(updates.date);
  }

  await transaction.update(updateData);
  return transaction;
}

export async function deleteTransaction(userId: number, transactionId: number) {
  const transaction = await Transaction.findOne({
    where: { id: transactionId, userId },
  });

  if (!transaction) {
    return false;
  }

  await transaction.destroy();
  return true;
}

export async function getSummary(userId: number, filters: TransactionFilters = {}) {
  const where: any = { userId };

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date[Op.gte] = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.date[Op.lte] = new Date(filters.endDate);
    }
  }

  const transactions = await Transaction.findAll({ where });

  const summary = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    byCategory: {} as Record<string, number>,
  };

  transactions.forEach((t) => {
    const amount = parseFloat(t.amount.toString());
    if (t.type === "income") {
      summary.totalIncome += amount;
    } else {
      summary.totalExpenses += amount;
    }

    const key = `${t.type}-${t.category}`;
    summary.byCategory[key] = (summary.byCategory[key] || 0) + amount;
  });

  summary.balance = summary.totalIncome - summary.totalExpenses;

  return summary;
}
