const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
}, { 
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      // substitui _id por id e remove _id
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

// middleware para hash de password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema, 'users');