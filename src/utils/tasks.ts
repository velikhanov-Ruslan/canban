import type { Task, TaskType } from '../types/task';
import { parseDate, startOfDay } from './date';

/** Сортировка по startDay по возрастанию (стабильная, при равенстве — по id). */
export const sortByStartDay = (tasks: Task[]): Task[] =>
  [...tasks].sort((a, b) => a.startDay - b.startDay || a.id - b.id);

/**
 * Фильтр по поисковой строке:
 *  - пустая строка — все задачи;
 *  - дата dd.mm.yyyy — задачи, у которых startDay или endDay приходится на эту дату;
 *  - иначе — задачи, в описании которых есть подстрока (без учёта регистра).
 */
export const filterTasks = (tasks: Task[], query: string): Task[] => {
  const q = query.trim();
  if (!q) return tasks;

  const date = parseDate(q);
  if (date !== null) {
    return tasks.filter((t) => startOfDay(t.startDay) === date || startOfDay(t.endDay) === date);
  }

  const needle = q.toLowerCase();
  return tasks.filter((t) => t.text.toLowerCase().includes(needle));
};

export const groupByType = (tasks: Task[]): Record<TaskType, Task[]> => {
  const groups: Record<TaskType, Task[]> = { todo: [], in_progress: [], review: [], done: [] };
  for (const task of tasks) groups[task.type].push(task);
  return groups;
};

const TYPES: TaskType[] = ['todo', 'in_progress', 'review', 'done'];

/** Проверка данных из localStorage / JSON, чтобы битые данные не роняли приложение. */
export const isTask = (value: unknown): value is Task => {
  if (typeof value !== 'object' || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'number' &&
    typeof t.text === 'string' &&
    typeof t.startDay === 'number' &&
    typeof t.endDay === 'number' &&
    TYPES.includes(t.type as TaskType)
  );
};
