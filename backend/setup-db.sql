-- Finance Tracker Database Setup Script
-- Run this script to create the database and a user

-- Create database
CREATE DATABASE IF NOT EXISTS finance_tracker;

-- Use the database
USE finance_tracker;

-- Optional: Create a dedicated user for the application
-- Uncomment and modify if you want a separate database user
-- CREATE USER IF NOT EXISTS 'finance_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON finance_tracker.* TO 'finance_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Show success message
SELECT 'Database finance_tracker created successfully!' AS message;
