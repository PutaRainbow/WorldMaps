const express = require('express');

module.exports = (app) => {
  app.use(express.json());
  app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message }); // Resposta ao cliente
    next();
  });
};
