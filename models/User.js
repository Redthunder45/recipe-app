// models/User.js
// Жанабекұлы Ислам — Пайдаланушы моделі (bcrypt хэштеумен)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  aty:       { type: String, required: true, maxlength: 100 },              // Аты-жөні
  email:     { type: String, required: true, unique: true, lowercase: true }, // Email (бірегей)
  parol:     { type: String, required: true, minlength: 6 },                // Хэшталған пароль
  rol:       { type: String, enum: ['user', 'admin'], default: 'user' },    // Рөлі
  tirkelgen: { type: Date, default: Date.now },                              // Тіркелген күні
}, { timestamps: true });

// ===== Пароль сақтамас бұрын хэштеу (pre-hook) =====
userSchema.pre('save', async function(next) {
  if (!this.isModified('parol')) return next();
  const salt = await bcrypt.genSalt(10);
  this.parol = await bcrypt.hash(this.parol, salt);
  next();
});

// ===== Парольді тексеру әдісі =====
userSchema.methods.parolTeksher = async function(engizilenParol) {
  return await bcrypt.compare(engizilenParol, this.parol);
};

module.exports = mongoose.model('User', userSchema);
