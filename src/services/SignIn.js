/* eslint-disable consistent-return */
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');

const secret = 'xpto_2024%API';

module.exports = (app) => {
  const router = express.Router();

  router.post('/', async (req, res, next) => {
    try {
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
      const user = await app.services.user.findUsername(username);

      if (user === 'user not found') {
        return res
          .status(400)
          .json({ error: 'Utilizador não encontrado' });
      }

      if (bcrypt.compareSync(password, user.password)) {
        const payload = {
          username,
          password,
        };
        const token = jwt.encode(payload, secret);

        const userData = {
          id: user.id,
          username: user.username,
          img_path: user.img_path,
          created_at: user.created_at,
        };

        const response = {
          message: 'Utilizador logado com sucesso!',
          token,
          userData,
        };
        return res.status(200).json({ response });
      }
      return res
        .status(400)
        .json({ error: 'Autenticacao invalida' });
    } catch (err) {
      next(err);
    }
  });

  module.exports = router;

  return router;
};
