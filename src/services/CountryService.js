import { Op, fn, col } from 'sequelize';
import Country from '../models/Country.js';
import sequelize from '../config/sequelize.js';
import { fetchCountries, fetchExchangeRates } from './externalApiService.js';
import { createSummaryImage } from './imageService.js';

export async function refreshCountries() {
  try {
  const [countries, rates] = await Promise.all([
    fetchCountries(),
    fetchExchangeRates()
  ]);

  const now = new Date();

  await sequelize.transaction(async (t) => {
    for (const c of countries) {
      const name = c.name?.trim();
      if (!name || !c.population) continue;

      let currency_code = null, exchange_rate = null, estimated_gdp = null;
      const multiplier = Math.floor(Math.random() * 1001) + 1000;

      if (c.currencies?.length && c.currencies[0]?.code) {
        currency_code = c.currencies[0].code;
        if (rates[currency_code]) {
          exchange_rate = rates[currency_code];
          estimated_gdp = (c.population * multiplier) / exchange_rate;
        }
      } else {
        estimated_gdp = 0;
      }

      const data = {
        name,
        capital: c.capital,
        region: c.region,
        population: c.population,
        currency_code,
        exchange_rate,
        estimated_gdp,
        flag_url: c.flag,
        last_refreshed_at: now
      };

      await Country.upsert(data, { transaction: t });
    };

    const top5 = await Country.findAll({
      where: { estimated_gdp: { [Op.ne]: null } },
      order: [['estimated_gdp', 'DESC']],
      limit: 5,
      transaction: t
    });

    const total = await Country.count({ transaction: t });

    try {
      await createSummaryImage({ totalCountries: total, topCountries: top5, lastRefreshedAt: now });
    } catch(err) {
      console.error("Summary image creation failed:", err);
    };

  });
} catch (error) {
  console.error("Error in refreshCountries:", error);
  throw new Error("Refresh failed");
};

}

export async function getCountries(filters) {
  const where = {};
  if (filters.region) where.region = filters.region;
  if (filters.currency) where.currency_code = filters.currency;

  const order = filters.sort === 'gdp_desc'
    ? [['estimated_gdp', 'DESC']]
    : [['name', 'ASC']];

  return Country.findAll({ where, order });
}

export async function getCountry(name) {
  return Country.findOne({
    where: sequelize.where(fn('LOWER', col('name')), name.toLowerCase())
  });
}

export async function deleteCountry(name) {
  return Country.destroy({
    where: sequelize.where(fn('LOWER', col('name')), name.toLowerCase())
  });
}
