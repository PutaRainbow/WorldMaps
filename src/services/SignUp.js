/* eslint-disable consistent-return */
const express = require('express');
const jwt = require('jwt-simple');

const secret = 'xpto_2024%API';

module.exports = (app) => {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    if (!req.query.username) {
      return res
        .status(400)
        .json({ error: 'Username e um atributo obrigatorio' });
    }
    if (!req.query.password) {
      return res
        .status(400)
        .json({ error: 'Password e um atributo obrigatorio' });
    }
    const { username, password } = req.query;
    app.services.user
      .save(username, password)
      .then((user) => {
        if (user === 'Username duplicado na BD') {
          return res
            .status(400)
            .json({ error: 'O username inserido já existe' });
        }
        const payload = {
          username,
          password,
        };
        const token = jwt.encode(payload, secret);

        const response = {
          message: 'Utilizador registado com sucesso!',
          token,
          userData: user.userData,
        };

        return res.status(200).json({ response });
      })
      .catch((err) => {
        next(err);
      });
  });

  module.exports = router;

  return router;
};
