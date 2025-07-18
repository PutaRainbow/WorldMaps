import express from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/user.js';
import 'dotenv/config';

const router = express.Router();

// POST /api/auth/signup
router.post('/', async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hash });
    await newUser.save();
    res.status(201).json({ message: 'Usuário criado com sucesso', userId: newUser._id });
  } catch (err) {
    next(err);
  }
});

export default router;
