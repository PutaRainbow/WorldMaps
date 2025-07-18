import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import 'dotenv/config';

const router = express.Router();

// POST /api/auth/signin
router.post('/', async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, user: { id: user._id, name: user.name } });
  } catch (err) {
    next(err);
  }
});

export default router;
