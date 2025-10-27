// // Sequelize setup
// import { Sequelize } from 'sequelize';
// import appConfig from './env.js';
// import { Buffer } from 'node:buffer';


// const caCert = Buffer.from(appConfig.AIVEN_CA_BASE64, 'base64').toString('utf-8');

// const sequelize = new Sequelize(`${appConfig.DB_NAME}`, `${appConfig.DB_USER}`, `${appConfig.DB_PASS}`, {
//   host: `${appConfig.DB_HOST}`,
//   dialect: 'mysql',
//   port: `${appConfig.DB_PORT}` || 3306,
//   dialectOptions: {
//     ssl: {
//       ca: caCert,
//       require: true,
//       rejectUnauthorized: false
//     },
//   },
// });

// try{
//   await sequelize.authenticate();
//   console.log('Connection to database has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

// export default sequelize;


// using sqlite
import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'database.sqlite');
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a SQLite database file in your project directory
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // turn off SQL logs for clarity
});

try {
  await sequelize.authenticate();
  console.log('SQLite connection established successfully.');
} catch (error) {
  console.error('Unable to connect to SQLite database:', error);
}

export default sequelize;
