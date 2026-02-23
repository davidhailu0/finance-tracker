import { Router } from "express";
import * as transactionController from "../controllers/transactionController";
import { authenticateJWT } from "../middleware/authMiddleware";
import {
  createTransactionValidator,
  updateTransactionValidator,
  listTransactionsValidator,
} from "../validators/transactionValidators";

const router = Router();

/**
 * @openapi
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *               - description
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100.50
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *               category:
 *                 type: string
 *                 example: Salary
 *               description:
 *                 type: string
 *                 example: Monthly salary payment
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticateJWT,
  createTransactionValidator,
  transactionController.createTransaction
);

/**
 * @openapi
 * /api/transactions:
 *   get:
 *     summary: Get all transactions with optional filters
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by transaction type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authenticateJWT,
  listTransactionsValidator,
  transactionController.getTransactions
);

/**
 * @openapi
 * /api/transactions/summary:
 *   get:
 *     summary: Get financial summary
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *     responses:
 *       200:
 *         description: Financial summary with totals and category breakdown
 *       401:
 *         description: Unauthorized
 */
router.get("/summary", authenticateJWT, transactionController.getSummary);

/**
 * @openapi
 * /api/transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authenticateJWT, transactionController.getTransactionById);

/**
 * @openapi
 * /api/transactions/{id}:
 *   put:
 *     summary: Update transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  authenticateJWT,
  updateTransactionValidator,
  transactionController.updateTransaction
);

/**
 * @openapi
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     responses:
 *       204:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authenticateJWT, transactionController.deleteTransaction);

export default router;
