import { useCallback, useEffect, useState } from 'react';
import initialTasks from '../data/tasks.json';
import type { Task, TaskType } from '../types/task';
import { isTask } from '../utils/tasks';

const STORAGE_KEY = 'kanban.tasks';

const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      // По ТЗ: если в localStorage нет задач — рисуем данные из json
      if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isTask)) {
        return parsed;
      }
    }
  } catch {
    // localStorage недоступен или данные битые — падаем на json
  }
  return (initialTasks as unknown[]).filter(isTask);
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // приватный режим / переполнение — просто не сохраняем
    }
  }, [tasks]);

  const removeTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTask = useCallback((id: number, patch: Partial<Omit<Task, 'id'>>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const moveTask = useCallback((id: number, type: TaskType) => {
    setTasks((prev) => prev.map((t) => (t.id === id && t.type !== type ? { ...t, type } : t)));
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    setTasks((prev) => [...prev, { ...task, id: prev.reduce((max, t) => Math.max(max, t.id), 0) + 1 }]);
  }, []);

  return { tasks, addTask, removeTask, updateTask, moveTask };
};
