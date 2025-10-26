import * as countryService from '../services/CountryService.js';
import { getSummaryImagePath } from "../services/imageService.js";

export async function refresh(req, res) {
  try {
    await countryService.refreshCountries();
    res.json({ message: 'Countries refreshed successfully' });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: 'External data source unavailable' });
  }
}

export async function getAll(req, res) {
  const countries = await countryService.getCountries(req.query);
  res.json(countries);
}

export async function getOne(req, res) {
  const country = await countryService.getCountry(req.params.name);
  if (!country) return res.status(404).json({ error: 'Country not found' });
  res.json(country);
}

export async function remove(req, res) {
  const deleted = await countryService.deleteCountry(req.params.name);
  if (!deleted) return res.status(404).json({ error: 'Country not found' });
  res.json({ message: 'Country deleted successfully' });
}

export async function status(req, res) {
  const total = await countryService.getCountries({});
  res.json({
    total_countries: total.length,
    last_refreshed_at: total[0]?.last_refreshed_at || null
  });
};


export async function getSummaryImage(req, res) {
  const imagePath = getSummaryImagePath();

  if (!imagePath) {
    return res.status(404).json({ error: "Summary image not found" });
  }

  res.sendFile(imagePath);
}
