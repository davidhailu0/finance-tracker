import { Sequelize } from "sequelize";
const config = require('./config.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

export const sequelize = new Sequelize(dbConfig);

