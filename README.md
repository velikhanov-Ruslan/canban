# Kanban board

Тестовое задание: канбан-доска на webpack + React + TypeScript.

**Демо:** https://velikhanov-ruslan.github.io/canban/

Макет: [Figma — Test task IP Kanban](https://www.figma.com/design/NSuWg7GOGgrUCug3zkafJJ/Test-task-IP-Kanban)

## Запуск

Требуется Node.js 18.18.0+ (см. `.nvmrc`).

```bash
npm install
npm run start   # дев-сервер на http://localhost:3000
npm run test    # unit-тесты (jest)
npm run build   # production-сборка в dist/
npm run deploy  # сборка и публикация на GitHub Pages (ветка gh-pages)
```

## Тесты

Unit-тест функции определения просроченной задачи:
**[`src/utils/__tests__/isOverdue.test.ts`](src/utils/__tests__/isOverdue.test.ts)**

Тестируемая функция: [`src/utils/isOverdue.ts`](src/utils/isOverdue.ts)

Дополнительно: тесты поиска, сортировки и парсинга дат — [`src/utils/__tests__/tasks.test.ts`](src/utils/__tests__/tasks.test.ts).

## Что реализовано

### Обязательные требования

- задачи из [`tasks.json`](src/data/tasks.json) отрисовываются по колонкам в зависимости от статуса;
- сортировка по `startDay` по возрастанию;
- просроченные задачи (`endDay` раньше сегодняшней даты, кроме статуса `done`) обводятся красным, дата окончания тоже подсвечивается красным, как в макете. Задача с дедлайном «сегодня» ещё не считается просроченной;
- удаление поштучно: иконка корзины появляется при наведении на карточку;
- минимальная ширина 768px (уже — горизонтальный скролл), максимальная 1920px (шире — отступы по бокам). На ширине до 1280px колонки раскладываются сеткой 2×2.

### Дополнительные требования

- редактирование задач прямо в карточке (иконка карандаша или двойной клик). По макету редактирование доступно в колонке **To Do**. Даты вводятся в формате `дд.мм.гггг` с маской и валидацией;
- drag & drop между колонками на нативном HTML5 DnD, без библиотек;
- состояние хранится в `localStorage`; если там нет задач, берутся данные из json;
- поиск: по подстроке в описании (без учёта регистра) или по дате `дд.мм.гггг` (совпадение со `startDay` или `endDay`);
- unit-тест функции `isOverdue`.

### Сверх ТЗ (по макету)

- кнопка «+ Добавить» в колонке To Do создаёт новую задачу.

## Структура

```
src/
  components/   Column, TaskCard, TaskEditor, SearchBar, Icons (иконки из макета)
  hooks/        useTasks — состояние задач и синхронизация с localStorage
  utils/        isOverdue, работа с датами, сортировка/фильтрация
  data/         tasks.json — исходные данные
  assets/       фон из макета (webp + jpg)
  styles/       стили (значения цветов/отступов из Figma)
```
