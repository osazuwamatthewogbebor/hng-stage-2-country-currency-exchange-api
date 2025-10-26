import sharp from "sharp";
import fs from "fs";
import path from "path";

const CACHE_DIR = path.resolve("cache");
const IMAGE_PATH = path.join(CACHE_DIR, "summary.png");

/**
 * Create a summary image showing:
 *  - total countries
 *  - top 5 by estimated GDP
 *  - last refresh timestamp
 */
export async function createSummaryImage({ totalCountries = 0, topCountries = [], lastRefreshedAt = new Date().toISOString() }) {
  try {
    if (!Array.isArray(topCountries)) {
      topCountries = [];
    }

    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR);
    }

    const topList =
      topCountries.length > 0
        ? topCountries
            .map(
              (c, i) =>
                `<tspan x="50" dy="40">${i + 1}. ${c.name || "N/A"} — ${(c.estimated_gdp ?? 0).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}</tspan>`
            )
            .join("")
        : `<tspan x="50" dy="40">No top countries available</tspan>`;

    const svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffffff" />
        <text x="50" y="70" font-size="32" font-family="Arial" fill="#222">🌍 Country Summary</text>
        <text x="50" y="140" font-size="22" font-family="Arial" fill="#333">
          Total Countries: ${totalCountries}
        </text>
        <text x="50" y="200" font-size="22" font-family="Arial" fill="#333">
          Top 5 Countries by Estimated GDP:
        </text>
        <text x="50" y="240" font-size="20" font-family="Arial" fill="#444">${topList}</text>
        <text x="50" y="550" font-size="18" font-family="Arial" fill="#666">
          Last Refreshed: ${new Date(lastRefreshedAt).toLocaleString()}
        </text>
      </svg>
    `;

    await sharp(Buffer.from(svg)).png().toFile(IMAGE_PATH);

    return IMAGE_PATH;
  } catch (err) {
    console.error("❌ Error creating summary image:", err.message);
    // Don't break the main refresh process
    return null;
  }
}

/**
 * Serve the generated summary image.
 */
export function getSummaryImagePath() {
  return fs.existsSync(IMAGE_PATH) ? IMAGE_PATH : null;
}
