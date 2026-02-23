'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get the first user
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Please seed users first.');
      return;
    }

    const userId = users[0].id;
    const now = new Date();

    await queryInterface.bulkInsert('transactions', [
      {
        userId,
        amount: 5000.00,
        type: 'income',
        category: 'Salary',
        description: 'Monthly salary payment',
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        createdAt: now,
        updatedAt: now,
      },
      {
        userId,
        amount: 1500.00,
        type: 'income',
        category: 'Freelance',
        description: 'Website development project',
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        createdAt: now,
        updatedAt: now,
      },
      {
        userId,
        amount: 800.00,
        type: 'expense',
        category: 'Rent',
        description: 'Monthly rent payment',
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        createdAt: now,
        updatedAt: now,
      },
      {
        userId,
        amount: 150.00,
        type: 'expense',
        category: 'Groceries',
        description: 'Weekly grocery shopping',
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        createdAt: now,
        updatedAt: now,
      },
      {
        userId,
        amount: 50.00,
        type: 'expense',
        category: 'Transportation',
        description: 'Gas and parking',
        date: new Date(now.getFullYear(), now.getMonth(), 12),
        createdAt: now,
        updatedAt: now,
      },
      {
        userId,
        amount: 100.00,
        type: 'expense',
        category: 'Entertainment',
        description: 'Movie tickets and dinner',
        date: new Date(now.getFullYear(), now.getMonth(), 18),
        createdAt: now,
        updatedAt: now,
      },
      {
        userId,
        amount: 200.00,
        type: 'income',
        category: 'Investment',
        description: 'Stock dividend',
        date: new Date(now.getFullYear(), now.getMonth(), 20),
        createdAt: now,
        updatedAt: now,
      },
      {
        userId,
        amount: 75.00,
        type: 'expense',
        category: 'Utilities',
        description: 'Electricity bill',
        date: new Date(now.getFullYear(), now.getMonth(), 22),
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transactions', null, {});
  },
};
