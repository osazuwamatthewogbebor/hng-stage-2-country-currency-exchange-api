// Sequelize setup
import { Sequelize } from 'sequelize';
import appConfig from './env.js';
import { Buffer } from 'node:buffer';


const caCert = Buffer.from(appConfig.AIVEN_CA_BASE64, 'base64').toString('utf-8');

const sequelize = new Sequelize(`${appConfig.DB_NAME}`, `${appConfig.DB_USER}`, `${appConfig.DB_PASS}`, {
  host: `${appConfig.DB_HOST}`,
  dialect: 'mysql',
  port: `${appConfig.DB_PORT}` || 3306,
  dialectOptions: {
    ssl: {
      ca: caCert,
      require: true,
      rejectUnauthorized: false
    },
  },
});

try{
  await sequelize.authenticate();
  console.log('Connection to database has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;
