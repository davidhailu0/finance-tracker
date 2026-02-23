import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as transactionService from "../services/transactionService";

export async function createTransaction(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = (req as any).user.userId;
    const { amount, type, category, description, date } = req.body;

    const transaction = await transactionService.createTransaction(
      userId,
      amount,
      type,
      category,
      description,
      date
    );

    // Ensure amount is a number
    const formattedTransaction = {
      ...transaction.toJSON(),
      amount: parseFloat(transaction.amount as any),
    };

    res.status(201).json(formattedTransaction);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function getTransactions(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = (req as any).user.userId;
    const { startDate, endDate, type, category } = req.query;

    const transactions = await transactionService.getTransactions(userId, {
      startDate: startDate as string,
      endDate: endDate as string,
      type: type as "income" | "expense",
      category: category as string,
    });

    // Ensure amounts are numbers
    const formattedTransactions = transactions.map(t => ({
      ...t.toJSON(),
      amount: parseFloat(t.amount as any),
    }));

    res.json(formattedTransactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function getTransactionById(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const transactionId = parseInt(req.params.id as string);

    const transaction = await transactionService.getTransactionById(
      userId,
      transactionId
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Ensure amount is a number
    const formattedTransaction = {
      ...transaction.toJSON(),
      amount: parseFloat(transaction.amount as any),
    };

    res.json(formattedTransaction);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function updateTransaction(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = (req as any).user.userId;
    const transactionId = parseInt(req.params.id as string);
    const updates = req.body;

    const transaction = await transactionService.updateTransaction(
      userId,
      transactionId,
      updates
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Ensure amount is a number
    const formattedTransaction = {
      ...transaction.toJSON(),
      amount: parseFloat(transaction.amount as any),
    };

    res.json(formattedTransaction);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function deleteTransaction(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const transactionId = parseInt(req.params.id as string);

    const deleted = await transactionService.deleteTransaction(
      userId,
      transactionId
    );

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function getSummary(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { startDate, endDate } = req.query;

    const summary = await transactionService.getSummary(userId, {
      startDate: startDate as string,
      endDate: endDate as string,
    });

    // Ensure all amounts are numbers
    const formattedSummary = {
      totalIncome: parseFloat(summary.totalIncome as any),
      totalExpenses: parseFloat(summary.totalExpenses as any),
      balance: parseFloat(summary.balance as any),
      byCategory: Object.entries(summary.byCategory).reduce((acc, [key, value]) => {
        acc[key] = parseFloat(value as any);
        return acc;
      }, {} as Record<string, number>),
    };

    res.json(formattedSummary);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}
