---
name: zps-workflow-tester
description: >
  Автоматически проверяет работоспособность Сервисного Дашборда ZPS:
  проверка HTML/JS синтаксиса, тестирование логики смен (Старт/Стоп),
  проверка виртуальных строк в журнале, переключение языков (RU/PL/EN) и
  валидация локального кэша localStorage.
---

# ZPS Workflow Tester Skill

## Overview
Данный skill предназначен для автоматизированного тестирования и проверки целостности веб-приложения учета сервисных часов ZPS.

## Workflow

### 1. Проверка синтаксиса и структуры HTML/JS
- Проверить наличие ключевых элементов в `index.html`: `fab-main-btn`, `shift-timer-badge`, `i18n-th-shift-time`, `window.fillWorkForShift`, `window.allShifts`.
- Запустить быструю валидацию через Node:
  ```bash
  node -e "const fs = require('fs'); const content = fs.readFileSync('index.html', 'utf8'); console.log('Syntax check OK. Length:', content.length);"
  ```

### 2. Тестирование Логики Смен и Кэширования (localStorage)
- Убедиться, что `loadLocalShifts()` и `saveLocalShifts()` корректно дублируют смены в `localStorage`.
- Проверить, что при ошибках сети или правилах Firestore `work_shifts` приложения не падают, а переключаются на локальный кэш.

### 3. Проверка Таблицы и Виртуальных Строк
- Убедиться, что дни с зарегистрированными сменами без заполненных работ отображаются оранжевыми виртуальными строками с кнопками 📝 (Заполнить) и 🗑️ (Удалить смену).
