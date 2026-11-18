import type { Task } from '../../types/task';
import { maskDate, parseDate } from '../date';
import { filterTasks, sortByStartDay } from '../tasks';

const ts = (d: number, m: number, y: number, h = 0) => new Date(y, m - 1, d, h).getTime();

const tasks: Task[] = [
  { id: 1, type: 'todo', startDay: ts(5, 1, 2026), endDay: ts(10, 1, 2026), text: 'Написать документацию' },
  { id: 2, type: 'done', startDay: ts(1, 1, 2026), endDay: ts(5, 1, 2026, 15), text: 'Провести код-ревью' },
  { id: 3, type: 'review', startDay: ts(3, 1, 2026), endDay: ts(4, 1, 2026), text: 'Обновить ДОКУМЕНТАЦИЮ API' },
];

describe('parseDate', () => {
  it('парсит dd.mm.yyyy в начало суток', () => {
    expect(parseDate('05.01.2026')).toBe(ts(5, 1, 2026));
  });

  it.each(['5.1.2026', '2026-01-05', '31.02.2026', '00.01.2026', 'текст'])('отклоняет «%s»', (value) => {
    expect(parseDate(value)).toBeNull();
  });
});

describe('maskDate', () => {
  it('расставляет точки и обрезает лишнее', () => {
    expect(maskDate('0501')).toBe('05.01');
    expect(maskDate('050120261')).toBe('05.01.2026');
    expect(maskDate('05.01.2026')).toBe('05.01.2026');
  });
});

describe('sortByStartDay', () => {
  it('сортирует по возрастанию startDay', () => {
    expect(sortByStartDay(tasks).map((t) => t.id)).toEqual([2, 3, 1]);
  });
});

describe('filterTasks', () => {
  it('пустой запрос — все задачи', () => {
    expect(filterTasks(tasks, '  ')).toHaveLength(3);
  });

  it('ищет по подстроке в описании без учёта регистра', () => {
    expect(filterTasks(tasks, 'документац').map((t) => t.id)).toEqual([1, 3]);
  });

  it('дата dd.mm.yyyy совпадает со startDay или endDay (в любое время суток)', () => {
    expect(filterTasks(tasks, '05.01.2026').map((t) => t.id)).toEqual([1, 2]);
  });

  it('дата без совпадений — пусто', () => {
    expect(filterTasks(tasks, '20.01.2026')).toEqual([]);
  });
});
