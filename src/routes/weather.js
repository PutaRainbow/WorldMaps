import express from 'express';
import axios from 'axios';
import 'dotenv/config';

const router = express.Router();

// GET /api/weather?lat={latitude}&lon={longitude}
router.get('/', async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Parâmetros lat e lon são obrigatórios' });
    }
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

export default router;
