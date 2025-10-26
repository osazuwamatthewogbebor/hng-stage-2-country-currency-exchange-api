# 🌍 Country Currency & Exchange API

A RESTful API that fetches, stores, and manages country data along with their currency exchange rates and estimated GDP.  
The API uses external data sources for real-time country and currency information and caches them in a MySQL database.

---

## Overview

This backend system:
- Fetches country data from **REST Countries API**.
- Fetches exchange rate data from **Open Exchange Rate API**.
- Computes each country's **estimated GDP**.
- Stores and manages this data with full CRUD operations.
- Generates a summary image showing statistics after each refresh.

---

## Features

Fetch & Cache all countries and exchange rates  
Calculate estimated GDP automatically  
Support filters, sorting, and search  
Generate summary image of top 5 countries by GDP  
View API status (total countries & last refresh timestamp)  
Error handling with consistent JSON responses  

---

## Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| **POST** | `/countries/refresh` | Fetch all countries & exchange rates, then cache them in the database |
| **GET** | `/countries` | Get all countries (supports filters & sorting) |
| **GET** | `/countries/:name` | Get one country by name |
| **DELETE** | `/countries/:name` | Delete a country record |
| **GET** | `/status` | Show total countries and last refresh timestamp |
| **GET** | `/countries/image` | Serve summary image (top 5 GDP countries) |

---

## Country Fields

| Field | Type | Description |
|--------|------|-------------|
| `id` | INT | Auto-generated |
| `name` | STRING | Required |
| `capital` | STRING | Optional |
| `region` | STRING | Optional |
| `population` | BIGINT | Required |
| `currency_code` | STRING | Required (if available) |
| `exchange_rate` | FLOAT | Exchange rate vs USD |
| `estimated_gdp` | FLOAT | Computed as: `population × random(1000–2000) ÷ exchange_rate` |
| `flag_url` | STRING | Country flag URL |
| `last_refreshed_at` | DATE | Auto timestamp |

---

## Business Logic

### Data Fetching
- Country data is fetched from:  
  `https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies`
- Exchange rates fetched from:  
  `https://open.er-api.com/v6/latest/USD`

---

### Estimated GDP Calculation
```js
estimated_gdp = (population * random(1000–2000)) / exchange_rate;
```

---

### Database Caching

Data is stored or updated only when /countries/refresh is called.

Existing countries are updated (matched by name, case-insensitive).

New countries are inserted.

---

### Summary Image

After refresh, an image (cache/summary.png) is generated showing:

Total number of countries

Top 5 by estimated GDP

Timestamp of last refresh

---

## Example Responses
GET /countries?region=Africa
```
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-22T18:00:00Z"
  },
  {
    "id": 2,
    "name": "Ghana",
    "capital": "Accra",
    "region": "Africa",
    "population": 31072940,
    "currency_code": "GHS",
    "exchange_rate": 15.34,
    "estimated_gdp": 3029834520.6,
    "flag_url": "https://flagcdn.com/gh.svg",
    "last_refreshed_at": "2025-10-22T18:00:00Z"
  }
]
```

GET /status
```
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-22T18:00:00Z"
}
```

Error Example
```
{
  "error": "Validation failed",
  "details": {
    "currency_code": "is required"
  }
}
```
---

## Tech Stack

Backend: Node.js (Express)

Database: MySQL (via Sequelize ORM)

HTTP Client: Axios

Image Generation: Sharp

Environment Management: dotenv

## Folder Structure
```
project-root/
│
├── src/
│   ├── config/
│   │   ├── sequelize.js            # DB configuration
│   │   └── env.js                  # env credentials
│   │
│   ├── models/
│   │   └── Country.js              # Sequelize model
│   │
│   ├── controllers/
│   │   └── countryController.js
│   │
│   ├── services/
│   │   ├── countryService.js       # Fetch & compute logic
│   │   ├── externalApiService.js   # Call APIs
│   │   └── imageService.js         # Image generation logic
│   │
│   ├── routes/
│   │   └── countryRoutes.js        # API routes
│   │
│   ├── utils/
│   │   ├── estimateGDP.js
│   │   └── gdpMultiplier.js
│   │
│   └── server.js                   # Server entry point
│
├── cache/                          # Summary image storage
├── .env                            # Environment variables
├── package.json
└── README.md
```
---

### Environment Variables

Create a .env file in your project root:

PORT=3000

---

### MySQL Config
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=country_db
DB_PORT=3306

---

## Run Locally
1. Install dependencies
```npm install```

2. Start server (development)
```npm run dev```


Server will run on
👉 http://localhost:3000

---

## API Filters & Sorting
Filter by region:

GET /countries?region=Africa

Filter by currency:

GET /countries?currency=USD

Sort by GDP (descending):

GET /countries?sort=gdp_desc

--- 

## Error Handling
|       Code	 |      Description	                |              Example                                 |
|----------------|----------------------------------|------------------------------------------------------|
|       400	     |      Validation failed	        |   { "error": "Validation failed" }                   |
|       404	     |      Country not found	        |   { "error": "Country not found" }                   |
|       503	     |      External API unavailable    |	{ "error": "External data source unavailable" }    |
|       500	     |      Internal server error       |   { "error": "Internal server error" }               |

---

## Author

### Osazuwa Matthew Ogbebor

## License

This project is licensed under the MIT License — free for educational and development use.