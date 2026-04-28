// ecosystem.config.js
// Жанабекұлы Ислам — PM2 экосистема конфигурациясы

module.exports = {
  apps: [{
    name: 'recipe-app',
    script: './server.js',
    watch: true,
    ignore_watch: ['node_modules', 'logs', '*.log'],

    // Орта айнымалылары — Development
    env: {
      NODE_ENV: 'development',
      PORT: 3003,
      MONGO_URI: 'mongodb://localhost:27017/recipes_db'
    },

    // Орта айнымалылары — Production
    env_production: {
      NODE_ENV: 'production',
      PORT: 3003,
      MONGO_URI: 'mongodb://localhost:27017/recipes_db'
    },

    // Лог файлдары
    log_file:   './logs/recipe-app.log',
    error_file: './logs/recipe-app-error.log',
    out_file:   './logs/recipe-app-out.log',

    // Қайта іске қосу баптаулары
    max_restarts:  10,
    restart_delay: 3000
  }]
};

/*
  ===== PM2 НЕГІЗГІ КОМАНДАЛАРЫ =====
  pm2 start ecosystem.config.js              — жобаны іске қосу
  pm2 start ecosystem.config.js --env prod   — production режімінде
  pm2 list                                   — процестер тізімі
  pm2 logs recipe-app                        — логтар
  pm2 logs recipe-app --lines 50             — соңғы 50 жол
  pm2 restart recipe-app                     — қайта іске қосу
  pm2 stop recipe-app                        — тоқтату
  pm2 delete recipe-app                      — жою
  pm2 monit                                  — CPU/RAM мониторинг
  pm2 show recipe-app                        — толық ақпарат
  pm2 save                                   — конфигурацияны сақтау
  pm2 startup                                — автоіске қосу
*/
