import { memo, useState, type DragEvent } from 'react';
import type { Task } from '../types/task';
import { isOverdue } from '../utils/isOverdue';
import { formatDate } from '../utils/date';
import { EditIcon, TrashIcon } from './Icons';
import { TaskEditor, type TaskDraft } from './TaskEditor';

interface Props {
  task: Task;
  /** По макету редактировать можно только карточки в колонке To Do */
  editable: boolean;
  onRemove: (id: number) => void;
  onUpdate: (id: number, patch: Partial<Omit<Task, 'id'>>) => void;
  onDragStart: (id: number) => void;
  onDragEnd: () => void;
}

export const DRAG_MIME = 'application/x-kanban-task';

const TaskCardComponent = ({ task, editable, onRemove, onUpdate, onDragStart, onDragEnd }: Props) => {
  const [editing, setEditing] = useState(false);

  if (editing && editable) {
    return (
      <TaskEditor
        initial={task}
        onCancel={() => setEditing(false)}
        onSave={(draft: TaskDraft) => {
          onUpdate(task.id, draft);
          setEditing(false);
        }}
      />
    );
  }

  const overdue = isOverdue(task);

  const handleDragStart = (e: DragEvent<HTMLElement>) => {
    e.dataTransfer.setData(DRAG_MIME, String(task.id));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(task.id);
  };

  return (
    <article
      className={`card${overdue ? ' card--overdue' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDoubleClick={editable ? () => setEditing(true) : undefined}
    >
      <div className="card__row">
        <span className="card__label">Начало:</span>
        <span className="card__value">{formatDate(task.startDay)}</span>
        <div className="card__tools">
          {editable && (
            <button type="button" className="icon-btn icon-btn--edit" onClick={() => setEditing(true)} aria-label="Редактировать задачу">
              <EditIcon size={18} />
            </button>
          )}
          <button type="button" className="icon-btn icon-btn--trash" onClick={() => onRemove(task.id)} aria-label="Удалить задачу">
            <TrashIcon size={18} />
          </button>
        </div>
      </div>
      <div className="card__row">
        <span className="card__label">Окончание:</span>
        <span className={`card__value${overdue ? ' card__value--overdue' : ''}`} title={overdue ? 'Срок истёк' : undefined}>
          {formatDate(task.endDay)}
        </span>
      </div>
      <div className="card__row card__row--text">
        <span className="card__label">Описание:</span>
        <span className="card__value card__value--text">{task.text}</span>
      </div>
    </article>
  );
};

export const TaskCard = memo(TaskCardComponent);
