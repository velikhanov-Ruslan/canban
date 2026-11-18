import type { Task } from '../types/task';
import { startOfDay } from './date';

/**
 * Задача просрочена, если её дедлайн (endDay) раньше сегодняшней даты
 * и она не находится в статусе 'done'.
 * Сравнение идёт с началом текущих суток: задача с дедлайном «сегодня» ещё не просрочена.
 */
export const isOverdue = (task: Pick<Task, 'type' | 'endDay'>, now: Date | number = Date.now()): boolean => {
  if (task.type === 'done') return false;
  return task.endDay < startOfDay(now);
};
