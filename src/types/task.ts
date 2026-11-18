export type TaskType = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  /** id задачи */
  id: number;
  /** статус задачи */
  type: TaskType;
  /** timestamp начала задачи */
  startDay: number;
  /** timestamp дедлайна */
  endDay: number;
  /** описание задачи */
  text: string;
}
