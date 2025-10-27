import dotenv from 'dotenv';

dotenv.config();

const appConfig = {
    PORT: Number(process.env.PORT) || 3000,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    COUNTRIES_API: process.env.COUNTRIES_API || "https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies",
    RATES_API: process.env.RATES_API || "https://open.er-api.com/v6/latest/USD",
    TIMEOUT: Number(process.env.TIMEOUT) || 15000,
    AIVEN_CA_BASE64: process.env.AIVEN_CA_BASE64
};

let missing = false;

for (let key in appConfig) {
    if (!appConfig[key]) {
        missing = true;
        console.error(`${key} is not set in environment variables`);
    };
};

if (!missing) {
    console.log(`All required credentials are present in environment vairiables`);
};


export default appConfig;