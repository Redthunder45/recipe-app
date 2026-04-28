// models/Recept.js
// Жанабекұлы Ислам — Recept моделі (PW2 Hard: валидация нақтыланды)

const mongoose = require('mongoose');

const receptSchema = new mongoose.Schema({
  aty: {
    type: String,
    required: [true, 'Рецепт атауы міндетті өріс!'],
    maxlength: [200, 'Атауы 200 таңбадан аспауы керек!'],
    trim: true
  },

  kategoriya: {
    type: String,
    required: [true, 'Категория міндетті өріс!'],
    enum: {
      values: ['Ет', 'Көкөніс', 'Тәтті', 'Сусын', 'Балық', 'Ботқа', 'Сорпа'],
      message: 'Категория тізімнен таңдалуы керек!'
    }
  },

  aqyldary: {
    type: String,
    required: [true, 'Дайындалу уақыты міндетті өріс!'],
    trim: true
  },

  qiyndygy: {
    type: String,
    required: [true, 'Қиындық деңгейі міндетті өріс!'],
    enum: {
      values: ['Оңай', 'Орта', 'Қиын'],
      message: 'Қиындық деңгейі: Оңай / Орта / Қиын болуы керек!'
    }
  },

  // ===== БUG ТҮЗЕТУ: kaloriya max шектеуі қосылды =====
  // ДЕЙІН (before): kaloriya: { type: Number, required: true, min: 0 }
  // КЕЙІН (after):  max: 5000 шектеуі қосылды — шексіз сан енгізуге болмайды
  kaloriya: {
    type: Number,
    required: [true, 'Калория міндетті өріс!'],
    min: [0,    'Калория 0-ден кем болмауы керек!'],
    max: [5000, 'Калория 5000 ккал-дан аспауы керек!']
  },

  adamSany: {
    type: Number,
    required: [true, 'Адам саны міндетті өріс!'],
    min: [1,   'Кем дегенде 1 адам болуы керек!'],
    max: [100, 'Адам саны 100-ден аспауы керек!']
  },

  qosylganKun: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model('Recept', receptSchema);
