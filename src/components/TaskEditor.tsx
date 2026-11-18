import { useState, type FormEvent, type KeyboardEvent } from 'react';
import type { Task } from '../types/task';
import { formatDate, maskDate, parseDate } from '../utils/date';
import { CheckIcon, CrossIcon } from './Icons';

export type TaskDraft = Pick<Task, 'text' | 'startDay' | 'endDay'>;

interface Props {
  initial: TaskDraft;
  onSave: (draft: TaskDraft) => void;
  onCancel: () => void;
}

/** Карточка в состоянии редактирования (макет: «#1 card / focus»). */
export const TaskEditor = ({ initial, onSave, onCancel }: Props) => {
  const [start, setStart] = useState(formatDate(initial.startDay));
  const [end, setEnd] = useState(formatDate(initial.endDay));
  const [text, setText] = useState(initial.text);
  const [touched, setTouched] = useState(false);

  const startTs = parseDate(start);
  const endTs = parseDate(end);
  const rangeError = startTs !== null && endTs !== null && startTs > endTs;
  const valid = startTs !== null && endTs !== null && !rangeError && text.trim().length > 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    onSave({ text: text.trim(), startDay: startTs!, endDay: endTs! });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onCancel();
  };

  const err = (bad: boolean) => (touched && bad ? ' field--invalid' : '');

  return (
    <form className="card card--editing" onSubmit={submit} onKeyDown={onKeyDown} noValidate>
      <label className="card__row">
        <span className="card__label">Начало:</span>
        <input
          className={`field${err(startTs === null || rangeError)}`}
          value={start}
          onChange={(e) => setStart(maskDate(e.target.value))}
          placeholder="дд.мм.гггг"
          inputMode="numeric"
          autoFocus
        />
      </label>
      <label className="card__row">
        <span className="card__label">Окончание:</span>
        <input
          className={`field${err(endTs === null || rangeError)}`}
          value={end}
          onChange={(e) => setEnd(maskDate(e.target.value))}
          placeholder="дд.мм.гггг"
          inputMode="numeric"
        />
      </label>
      <label className="card__row">
        <span className="card__label">Описание:</span>
        <input
          className={`field field--wide${err(!text.trim())}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Описание задачи"
        />
      </label>
      {touched && rangeError && <p className="card__error">Окончание раньше начала</p>}
      <div className="card__actions">
        <button type="button" className="round-btn" onClick={onCancel} aria-label="Отменить">
          <CrossIcon className="round-btn__cross" />
        </button>
        <button type="submit" className="round-btn" aria-label="Сохранить">
          <CheckIcon className="round-btn__check" />
        </button>
      </div>
    </form>
  );
};
