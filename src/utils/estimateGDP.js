export default (population, multiplier, exchange_rate) => {
    const estimated_gdp = (population * multiplier) / exchange_rate;

    return estimated_gdp;
};