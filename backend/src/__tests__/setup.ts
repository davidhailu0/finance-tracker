import '@jest/globals';
import { sequelize } from '../config/database';
import '../models'; // Import models to register them

// Setup before all tests
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';
  
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established');
    
    // Drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('Database tables created');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    // Close database connection
    await sequelize.close();
  } catch (error) {
    console.error('Database cleanup failed:', error);
  }
});

// Clear data between tests
afterEach(async () => {
  try {
    // Get all models and truncate them
    const models = Object.values(sequelize.models);
    for (const model of models) {
      await model.destroy({ where: {}, force: true });
    }
  } catch (error) {
    console.error('Table cleanup failed:', error);
  }
});
