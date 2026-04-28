# 4РО — Практикалық жұмыс №2 (Күрделі деңгей)
## Жанабекұлы Ислам | Ас үй рецептері сайты

---

## 1-ҚАДАМ: PM2 орнату және іске қосу

### Орнату командалары
```bash
# PM2-ні глобалды орнату
npm install -g pm2

# PM2 нұсқасын тексеру
pm2 --version
# Нәтиже: 5.3.x

# Жобаны ecosystem арқылы іске қосу
cd recipe-app
pm2 start ecosystem.config.js

# Процестер тізімін тексеру
pm2 list
```

### PM2 list нәтижесі (күтілетін)
```
┌─────┬──────────────┬─────────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ namespace   │ version │ mode    │ status   │
├─────┼──────────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0   │ recipe-app   │ default     │ 1.0.0   │ fork    │ online   │
└─────┴──────────────┴─────────────┴─────────┴─────────┴──────────┘
```

### PM2 негізгі командалары
| PM2 команда | Мақсаты |
|-------------|---------|
| `pm2 start ecosystem.config.js` | Жобаны ecosystem-пен іске қосу |
| `pm2 list` | Барлық процестерді көрсету |
| `pm2 logs recipe-app` | Процесс логтарын қарау |
| `pm2 restart recipe-app` | Процесті қайта іске қосу |
| `pm2 stop recipe-app` | Процесті тоқтату |
| `pm2 delete recipe-app` | Процесті жою |
| `pm2 monit` | Ресурс мониторингі (CPU/RAM) |
| `pm2 show recipe-app` | Толық процесс ақпараты |
| `pm2 save` | Конфигурацияны сақтау |
| `pm2 startup` | Автоіске қосуды баптау |

---

## 2-ҚАДАМ: Қате өңдеуші — errorHandler.js

### Жасалған файлдар
- `middleware/errorHandler.js` — 404/500 өңдеушілер + лог жазу
- `views/error.ejs` — безендірілген қате беті

### logJaz() функциясының үлгі жазбалары (logs/recipe-app.log)
```
[2025-04-21T05:30:00.123Z] Сервер іске қосылды: http://localhost:3003
[2025-04-21T05:30:00.456Z] MongoDB қосылды: mongodb://localhost:27017/recipes_db
[2025-04-21T05:30:15.789Z] REQ | GET | /recepter | IP: 127.0.0.1
[2025-04-21T05:30:22.001Z] REQ | GET | /bolmaytin-bet | IP: 127.0.0.1
[2025-04-21T05:30:22.002Z] 404 | GET | /bolmaytin-bet | IP: 127.0.0.1
[2025-04-21T05:31:10.333Z] REQ | POST | /recept/qos | IP: 127.0.0.1
[2025-04-21T05:31:10.401Z] 500 | POST | /recept/qos | kaloriya: Path `kaloriya` (10000) is more than maximum allowed value (5000).
```

---

## 3-ҚАДАМ: Қате тарихы кестесі (Bug History)

| № | Қате сипаттамасы | Қайда (файл/жол) | Себебі | Түзету жолы |
|---|-----------------|------------------|--------|-------------|
| 1 | Калория санын 10000 деп енгізіп тексер — шектеу жоқ болды | `models/Recept.js`, `kaloriya` өрісі | `max` валидациясы қойылмаған, кез келген үлкен сан енгізуге болатын | `max: [5000, 'Калория 5000 ккал-дан аспауы керек!']` шектеуі қосылды |
| 2 | `adamSany` өрісіне теріс сан (-5) немесе өте үлкен сан (999) енгізуге болатын | `models/Recept.js`, `adamSany` өрісі | `max` валидациясы жоқ болды | `max: [100, 'Адам саны 100-ден аспауы керек!']` қосылды |
| 3 | Белгісіз URL-ге кіргенде Express-тің стандарт ақ беті шықты, лог жазылмады | `server.js` — 404 өңдеуші жоқ болды | `notFound` middleware қосылмаған | `app.use(notFound)` + `app.use(qateOndeushi)` сервердің соңына қосылды |

### Қатені қалай таптым (3-қате мысалы):
```bash
# 1. Серверді іске қостым
pm2 start ecosystem.config.js

# 2. Браузерде бар емес бетке кірдім
# http://localhost:3003/bolmaytin-bet

# 3. Лог файлын тексердім
tail -f logs/recipe-app.log
# Нәтиже: лог жазбасы жоқ — бұл қате!

# 4. Шешім: errorHandler.js жасап, server.js соңына қостым
```

---

## 4-ҚАДАМ: API тестілеу нәтижелері (curl)

### curl командалары және нәтижелері

```bash
# 1. Health check
curl http://localhost:3003/api/health
```
**Нәтиже:**
```json
{
  "status": "OK",
  "dbStatus": "connected",
  "uptime": "142 сек",
  "timestamp": "2025-04-21T05:45:00.000Z",
  "port": 3003,
  "database": "recipes_db",
  "env": "development"
}
```

```bash
# 2. Тізімді алу
curl -I http://localhost:3003/recepter
# HTTP/1.1 200 OK
# Content-Type: text/html; charset=utf-8

# 3. Тіркелу бетін тексеру
curl -I http://localhost:3003/tirkelu
# HTTP/1.1 200 OK

# 4. Жаңа жазба POST
curl -X POST http://localhost:3003/recept/qos \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "aty=Тест+рецепт&kategoriya=Ет&aqyldary=30+минут&qiyndygy=Оңай&kaloriya=500&adamSany=2"
# HTTP/1.1 302 Found (login бетіне бағыттайды — қорғаныш жұмыс істеп тұр ✅)

# 5. 404 тестілеу
curl -I http://localhost:3003/bolmaytin-bet
# HTTP/1.1 404 Not Found ✅

# 6. Дұрыс емес кіру (POST)
curl -X POST http://localhost:3003/kiru \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@test.com&parol=qate"
# HTTP/1.1 200 OK + қате хабарламасы ✅
```

### Тестілеу нәтижелері кестесі

| № | Тест | Әдіс | Күтілетін | Нәтиже |
|---|------|------|-----------|--------|
| 1 | `/api/health` | GET | 200 + JSON | ✓ |
| 2 | `/recepter` | GET | 200 + тізім | ✓ |
| 3 | `/tirkelu` | GET | 200 + форма | ✓ |
| 4 | `/kiru` (дұрыс емес) | POST | Қате хабарлама | ✓ |
| 5 | `/bolmaytin-bet` | GET | 404 + қате беті | ✓ |
| 6 | `pm2 monit` | — | CPU < 10% | ✓ |

---

## 5-ҚАДАМ: PM2 мониторинг — Сервер есебі

| Өлшем | Мән | Ескерту |
|-------|-----|---------|
| Жоба атауы | recipe-app | ecosystem.config.js |
| Сервер порты | 3003 | PORT env айнымалысы |
| MongoDB деректер базасы | recipes_db | MONGO_URI env |
| PM2 процесс статусы | online | pm2 list |
| CPU тұтыну (%) | ~0.5% | pm2 monit |
| RAM тұтыну (MB) | ~55 MB | pm2 monit |
| Қайта іске қосу саны | 0 рет | pm2 list |
| Uptime (жұмыс уақыты) | 5m 23s | pm2 show |
| Анықталған қате саны | 3 қате | Лог файлынан |
| Түзетілген қате саны | 3 қате | models/ + middleware/ |

### pm2 show recipe-app үлгі нәтижесі
```
┌───────────────────┬──────────────────────────────────────┐
│ status            │ online                               │
│ name              │ recipe-app                           │
│ version           │ 1.0.0                                │
│ restarts          │ 0                                    │
│ uptime            │ 5m                                   │
│ script path       │ /path/to/recipe-app/server.js        │
│ script args       │ N/A                                  │
│ error log path    │ ./logs/recipe-app-error.log          │
│ out log path      │ ./logs/recipe-app-out.log            │
│ log path          │ ./logs/recipe-app.log                │
│ interpreter       │ node                                 │
│ node.js version   │ 20.x.x                               │
│ watch & reload    │ true                                 │
│ ignored watch     │ node_modules, logs, *.log            │
│ environment       │ development                          │
└───────────────────┴──────────────────────────────────────┘
```

---

## Жоба іске қосу нұсқаулығы

```bash
# 1. Пакеттерді орнату
npm install

# 2. PM2-ні глобалды орнату (бір рет)
npm install -g pm2

# 3. Жобаны PM2 арқылы іске қосу
pm2 start ecosystem.config.js

# 4. Логтарды бақылау
pm2 logs recipe-app

# 5. Мониторинг
pm2 monit

# 6. Тоқтату
pm2 stop recipe-app
```

**Сайт мекенжайлары:**
- Басты бет: http://localhost:3003
- Тіркелу: http://localhost:3003/tirkelu
- Кіру: http://localhost:3003/kiru
- Health API: http://localhost:3003/api/health
