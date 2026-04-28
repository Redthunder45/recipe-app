// routes/receptRoutes.js
// Жанабекұлы Ислам — Express маршруттары мен валидация

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Recept = require('../models/Recept');

// ===== GET: Басты бетке өту — тізімге бағыттау =====
router.get('/', (req, res) => {
  res.redirect('/recepter');
});

// ===== GET: Барлық рецептерді көрсету =====
router.get('/recepter', async (req, res) => {
  try {
    const malumattar = await Recept.find().sort({ createdAt: -1 });
    res.render('index', { malumattar, title: 'Ас үй Рецептері' });
  } catch (err) {
    res.status(500).send('Сервер қатесі: ' + err.message);
  }
});

// ===== GET: Қосу пішінін көрсету =====
router.get('/recept/qos', (req, res) => {
  res.render('add', { title: 'Жаңа Рецепт қосу', qateler: [] });
});

// ===== POST: Пішін валидациясы + дерекқорға сақтау =====
router.post('/recept/qos',
  [
    body('aty')
      .notEmpty().withMessage('aty — міндетті өріс!')
      .isLength({ max: 200 }).withMessage('aty — 200 таңбадан аспауы керек!'),
    body('kategoriya')
      .notEmpty().withMessage('kategoriya — міндетті өріс!'),
    body('aqyldary')
      .notEmpty().withMessage('aqyldary — міндетті өріс!'),
    body('qiyndygy')
      .notEmpty().withMessage('qiyndygy — міндетті өріс!'),
    body('kaloriya')
      .notEmpty().withMessage('kaloriya — міндетті өріс!')
      .isNumeric().withMessage('kaloriya — сандық мән болуы керек!')
      .isFloat({ min: 0 }).withMessage('kaloriya — 0-ден кем болмауы керек!'),
    body('adamSany')
      .notEmpty().withMessage('adamSany — міндетті өріс!')
      .isInt({ min: 1 }).withMessage('adamSany — кемінде 1 болуы керек!'),
  ],
  async (req, res) => {
    const qateler = validationResult(req);

    // Валидация қатесі болса — пішінді қайта көрсет
    if (!qateler.isEmpty()) {
      return res.render('add', {
        title: 'Жаңа Рецепт қосу',
        qateler: qateler.array()
      });
    }

    // Дерекқорға сақтау
    try {
      const janaRecept = new Recept(req.body);
      await janaRecept.save();
      res.redirect('/recepter');
    } catch (err) {
      res.status(500).send('Сақтау қатесі: ' + err.message);
    }
  }
);

// ===== DELETE: Рецептті жою =====
router.delete('/recepter/:id', async (req, res) => {
  try {
    await Recept.findByIdAndDelete(req.params.id);
    res.redirect('/recepter');
  } catch (err) {
    res.status(500).send('Жою қатесі: ' + err.message);
  }
});

module.exports = router;
