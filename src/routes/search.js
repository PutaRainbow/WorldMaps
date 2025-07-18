const express = require('express');
const axios   = require('axios');
const router  = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'Parâmetro q é obrigatório' });

    // 1. Buscar coordenadas com OpenCage
    const geoRes = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q,
        key: process.env.OPENCAGE_API_KEY, // Nome da variável deve bater com o teu .env
        limit: 5
      }
    });

    const locations = geoRes.data.results;

    // 2. Para cada local, buscar o clima atual com OpenWeather
    const enrichedResults = await Promise.all(
      locations.map(async (r) => {
        const lat = r.geometry.lat;
        const lon = r.geometry.lng;

        try {
          const weatherRes = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
              lat,
              lon,
              appid: process.env.OPENWEATHER_API_KEY,
              units: 'metric',
              lang: 'pt'
            }
          });

          const weather = weatherRes.data;

          return {
            name:        r.formatted,
            countryCode: r.components.country_code.toUpperCase(),
            latitude:    lat,
            longitude:   lon,
            temperature: weather.main.temp,
            feels_like:  weather.main.feels_like,
            weather:     weather.weather[0].description,
            icon:        weather.weather[0].icon
          };
        } catch (weatherErr) {
          // Se falhar a API do clima, continua sem os dados
          return {
            name:        r.formatted,
            countryCode: r.components.country_code.toUpperCase(),
            latitude:    lat,
            longitude:   lon,
            error:       'Erro ao obter clima'
          };
        }
      })
    );

    res.json({ results: enrichedResults });

  } catch (err) {
    next(err);
  }
});

module.exports = router;

