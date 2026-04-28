// middleware/errorHandler.js
// Жанабекұлы Ислам — 404/500 қате өңдеуші + лог жазу

const fs   = require('fs');
const path = require('path');

// ===== Лог қалтасын жасау (жоқ болса) =====
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

/**
 * logJaz() — logs/recipe-app.log файлына жол жазады
 * Формат: [ISO уақыт] мазмұн
 */
function logJaz(mazmun) {
  const waqyt = new Date().toISOString();
  const jol   = `[${waqyt}] ${mazmun}\n`;
  try {
    fs.appendFileSync(path.join(logDir, 'recipe-app.log'), jol);
  } catch (e) {
    console.error('Лог жазу қатесі:', e.message);
  }
}

/**
 * notFound() — 404 middleware
 * Белгісіз маршрутқа сұраныс келгенде орындалады
 */
function notFound(req, res, next) {
  const qate    = new Error(`404 — Бет табылмады: ${req.originalUrl}`);
  qate.status   = 404;
  logJaz(`404 | ${req.method} | ${req.originalUrl} | IP: ${req.ip}`);
  next(qate);
}

/**
 * qateOndeushi() — 500 (жалпы) қате middleware
 * Express-тің 4 параметрлі қате өңдеушісі
 */
function qateOndeushi(err, req, res, next) {
  const statusCode = err.status || 500;
  logJaz(`${statusCode} | ${req.method} | ${req.originalUrl} | ${err.message}`);

  // Development — толық stack trace
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).render('error', {
      title:   `Қате ${statusCode}`,
      message: err.message,
      stack:   err.stack
    });
  }

  // Production — қысқа хабарлама
  res.status(statusCode).render('error', {
    title:   `Қате ${statusCode}`,
    message: statusCode === 404 ? 'Бет табылмады' : 'Сервер қатесі орын алды',
    stack:   null
  });
}

module.exports = { notFound, qateOndeushi, logJaz };
