// middleware/auth.js
// Жанабекұлы Ислам — Аутентификация тексергіші (қорғаныш middleware)

/**
 * qorga() — қорғалған маршруттарға кіру алдында сессияны тексереді.
 * Егер пайдаланушы кірмеген болса — /kiru бетіне бағыттайды.
 */
function qorga(req, res, next) {
  if (req.session && req.session.qoldanushyId) {
    return next(); // ✅ Кірген — маршрутты жалғастыр
  }
  res.redirect('/kiru'); // ❌ Кірмеген — кіру бетіне жібер
}

module.exports = { qorga };
