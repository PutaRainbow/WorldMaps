const passport = require('passport');
const passportJwt = require('passport-jwt');

const secret = 'xpto_2024%API';

const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, (payload, done) => {
    app.services.user.find({ id: payload.id })
      .then((user) => {
        if (user) {
          return done(null, { ...payload });
        }
        return done(null, false, { message: 'Usuário não encontrado' });
      })
      .catch((err) => {
        done(err, false);
      });
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
