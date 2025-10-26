// Sequelize setup
import { Sequelize } from 'sequelize';
import appConfig from './env.js';

const sequelize = new Sequelize(`${appConfig.DB_NAME}`, `${appConfig.DB_USER}`, `${appConfig.DB_PASS}`, {
  host: `${appConfig.DB_HOST}`,
  dialect: 'mysql',
  port: `${appConfig.DB_PORT}` || 3306,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 20000,
  },
});

try{
  await sequelize.authenticate();
  console.log('Connection to database has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;
