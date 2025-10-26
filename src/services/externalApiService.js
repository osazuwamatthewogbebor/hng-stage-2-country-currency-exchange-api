import axios from 'axios';
import appConfig from '../config/env.js';

export async function fetchCountries() {
    try {
        const response = await axios.get(appConfig.COUNTRIES_API, { timeout: appConfig.TIMEOUT});
        return response.data;        
    } catch (error) {
        console.error(error);
        throw new Error({ "error": "External data source unavailable", "details": "Could not fetch data from Countries API" })
    };
};


export async function fetchExchangeRates() {
    try {
        const response = await axios.get(appConfig.RATES_API, { timeout: appConfig.TIMEOUT });
        return response.data.rates;    
    } catch (error) {
        console.error(error);
        throw new Error({ "error": "External data source unavailable", "details": "Could not fetch data from Countries API" })
    };
};