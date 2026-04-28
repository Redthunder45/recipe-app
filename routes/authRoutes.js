// routes/authRoutes.js
// Жанабекұлы Ислам — Тіркелу / Кіру / Шығу маршруттары

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// ===== GET: Тіркелу беті =====
router.get('/tirkelu', (req, res) => {
  res.render('register', {
    title: 'Тіркелу',
    qateler: [],
    flash: req.flash ? req.flash() : {}
  });
});

// ===== POST: Тіркелу — валидация + bcrypt + сақтау =====
router.post('/tirkelu', [
  body('aty')
    .notEmpty().withMessage('Аты-жөні міндетті!'),
  body('email')
    .isEmail().withMessage('Дұрыс email енгіз!'),
  body('parol')
    .isLength({ min: 6 }).withMessage('Пароль кем дегенде 6 таңба!'),
  body('parolRastau').custom((val, { req }) => {
    if (val !== req.body.parol) throw new Error('Парольдер сәйкес келмейді!');
    return true;
  }),
], async (req, res) => {
  const qateler = validationResult(req);
  if (!qateler.isEmpty()) {
    return res.render('register', {
      title: 'Тіркелу',
      qateler: qateler.array(),
      flash: {}
    });
  }

  try {
    // Email бар-жоғын тексеру
    const barlygynTeksher = await User.findOne({ email: req.body.email });
    if (barlygynTeksher) {
      return res.render('register', {
        title: 'Тіркелу',
        qateler: [{ msg: 'Бұл email тіркелген!' }],
        flash: {}
      });
    }

    // Жаңа пайдаланушы жасау (bcrypt pre-hook автоматты хэштейді)
    const janaQoldanushy = new User({
      aty:   req.body.aty,
      email: req.body.email,
      parol: req.body.parol
    });
    await janaQoldanushy.save();

    // Сессияны орнату
    req.session.qoldanushyId  = janaQoldanushy._id;
    req.session.qoldanushyAty = janaQoldanushy.aty;

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Тіркелу қатесі: ' + err.message);
  }
});

// ===== GET: Кіру беті =====
router.get('/kiru', (req, res) => {
  res.render('login', {
    title: 'Жүйеге кіру',
    qateler: [],
    flash: req.flash ? req.flash() : {}
  });
});

// ===== POST: Кіру — email + пароль тексеру =====
router.post('/kiru', [
  body('email').isEmail().withMessage('Дұрыс email енгіз!'),
  body('parol').notEmpty().withMessage('Пароль міндетті!'),
], async (req, res) => {
  const qateler = validationResult(req);
  if (!qateler.isEmpty()) {
    return res.render('login', {
      title: 'Жүйеге кіру',
      qateler: qateler.array(),
      flash: {}
    });
  }

  try {
    // Пайдаланушыны табу
    const qoldanushy = await User.findOne({ email: req.body.email });
    if (!qoldanushy) {
      return res.render('login', {
        title: 'Жүйеге кіру',
        qateler: [{ msg: 'Email табылмады!' }],
        flash: {}
      });
    }

    // Парольді тексеру
    const parolDurus = await qoldanushy.parolTeksher(req.body.parol);
    if (!parolDurus) {
      return res.render('login', {
        title: 'Жүйеге кіру',
        qateler: [{ msg: 'Пароль дұрыс емес!' }],
        flash: {}
      });
    }

    // Сессияны орнату
    req.session.qoldanushyId  = qoldanushy._id;
    req.session.qoldanushyAty = qoldanushy.aty;

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Кіру қатесі: ' + err.message);
  }
});

// ===== GET: Шығу =====
router.get('/shygu', (req, res) => {
  req.session.destroy();
  res.redirect('/kiru');
});

module.exports = router;
