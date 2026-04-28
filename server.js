// server.js
// Жанабекұлы Ислам — Ас үй рецептері (PW2 Hard жаңартылды)
// PORT: 3003 | MongoDB: recipes_db

const express  = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session  = require('express-session');
const flash    = require('connect-flash');

const receptRoutes               = require('./routes/receptRoutes');
const authRoutes                 = require('./routes/authRoutes');
const { qorga }                  = require('./middleware/auth');
const { notFound, qateOndeushi, logJaz } = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipes_db';

// =============================================
// MIDDLEWARE
// =============================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'recipe-app-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(flash());

// Жалпы айнымалыларды view-ге жібер
app.use((req, res, next) => {
  res.locals.qoldanushy   = req.session.qoldanushyAty || null;
  res.locals.qoldanushyId = req.session.qoldanushyId  || null;
  next();
});

// Сұраныстарды логқа жаз
app.use((req, res, next) => {
  logJaz(`REQ | ${req.method} | ${req.originalUrl} | IP: ${req.ip}`);
  next();
});

// =============================================
// MONGODB-ГЕ ҚОСЫЛУ
// =============================================
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB-ге қосылды: ${MONGO_URI}`);
    logJaz(`MongoDB қосылды: ${MONGO_URI}`);
  })
  .catch(err => {
    console.error('❌ MongoDB қосылу қатесі:', err.message);
    logJaz(`MongoDB ҚАТЕ: ${err.message}`);
  });

// =============================================
// МАРШРУТТАР
// =============================================

// Health check API — /api/health
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
  res.json({
    status:    'OK',
    dbStatus:  dbStatus,
    uptime:    Math.floor(process.uptime()) + ' сек',
    timestamp: new Date().toISOString(),
    port:      PORT,
    database:  'recipes_db',
    env:       process.env.NODE_ENV || 'development'
  });
});

// Аутентификация маршруттары
app.use('/', authRoutes);

// Рецепт CRUD маршруттары (қорғалған)
app.use('/', qorga, receptRoutes);

// Басты бет
app.get('/', (req, res) => res.redirect('/recepter'));

// Dashboard (қорғалған)
app.get('/dashboard', qorga, (req, res) => {
  res.render('dashboard', {
    title: 'Жеке кабинет',
    qoldanushyAty: req.session.qoldanushyAty
  });
});

// =============================================
// ҚАТЕ ӨҢДЕУШІЛЕР — барлық маршруттардан КЕЙІН
// =============================================
app.use(notFound);       // 404 өңдеуші
app.use(qateOndeushi);   // 500 өңдеуші

// =============================================
// СЕРВЕРДІ ІСКе ҚОСУ
// =============================================
app.listen(PORT, () => {
  const msg = `Сервер іске қосылды: http://localhost:${PORT}`;
  console.log(`🚀 ${msg}`);
  console.log(`📋 Тіркелу:      http://localhost:${PORT}/tirkelu`);
  console.log(`🔑 Кіру:         http://localhost:${PORT}/kiru`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  logJaz(msg);
});
