import express from 'express';
// import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
// import rateLimit from 'express-rate-limit';
import sequelize from './config/sequelize.js';
import appConfig from './config/env.js';
import countryRoutes from './routes/countryRoutes.js';

import * as controller from './controllers/countryController.js';


const app = express();
const port = appConfig.PORT || 3000;

// app.use(helmet());
app.use(morgan('tiny'));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// app.use(rateLimit({ 
//     windowMs: 15 * 60 * 1000, 
//     max: 100, 
//     message: "Too many requests fron this IP, please try again later!"
// }));

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "Welcome",
        allCountries: "GET /countries → Get all countries from the DB (support filters and sorting) - ?region=Africa | ?currency=NGN | ?sort=gdp_desc",
        oneCoubtrt: "GET /countries/:name → Get one country by name",
        status: "GET /status → Show total countries and last refresh timestamp",
        image: "GET /countries/image → serve summary image"
    });
});

app.get('/status', controller.status);
app.use('/countries', countryRoutes);

// app.use((req, res, next) => {
//     res.status(404).json("Route not found");
// })
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error"});
});

try {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
    });
} catch (error) {
    console.log("Unable to synchronize database", error);
};