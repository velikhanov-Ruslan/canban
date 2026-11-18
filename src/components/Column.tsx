import { useState, type ComponentType, type DragEvent, type ReactNode } from 'react';
import type { Task, TaskType } from '../types/task';
import { DRAG_MIME, TaskCard } from './TaskCard';

interface Props {
  type: TaskType;
  title: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
  tasks: Task[];
  dragging: boolean;
  editable: boolean;
  /** Кнопка в заголовке (например «+ Добавить») */
  action?: ReactNode;
  /** Карточка-черновик новой задачи, рисуется первой */
  draft?: ReactNode;
  onRemove: (id: number) => void;
  onUpdate: (id: number, patch: Partial<Omit<Task, 'id'>>) => void;
  onMove: (id: number, type: TaskType) => void;
  onDragStart: (id: number) => void;
  onDragEnd: () => void;
}

export const Column = ({
  type,
  title,
  Icon,
  tasks,
  dragging,
  editable,
  action,
  draft,
  onRemove,
  onUpdate,
  onMove,
  onDragStart,
  onDragEnd,
}: Props) => {
  const [over, setOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!over) setOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    // игнорируем переходы между дочерними элементами колонки
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setOver(false);
    const id = Number(e.dataTransfer.getData(DRAG_MIME));
    if (Number.isFinite(id)) onMove(id, type);
  };

  return (
    <section
      className={`column${over && dragging ? ' column--over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label={title}
    >
      <header className="column__header">
        <h2 className="column__title">
          <Icon className="column__icon" />
          {title}
        </h2>
        {action}
      </header>
      {draft}
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          editable={editable}
          onRemove={onRemove}
          onUpdate={onUpdate}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </section>
  );
};
