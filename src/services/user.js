const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar Users' });
  }
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
};

exports.addUser = async (req, res) => {
  const novo = new User(req.body);
  const salvo = await novo.save();
  res.status(201).json(salvo);
};

exports.updateUser = async (req, res) => {
  const atualizado = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(atualizado);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
