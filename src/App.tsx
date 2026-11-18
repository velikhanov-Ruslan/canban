import { useCallback, useMemo, useState, type ComponentType } from 'react';
import { Column } from './components/Column';
import { GhostIcon, HappyIcon, SmileIcon, UpsideDownIcon } from './components/Icons';
import { SearchBar } from './components/SearchBar';
import { TaskEditor } from './components/TaskEditor';
import { useTasks } from './hooks/useTasks';
import type { TaskType } from './types/task';
import { startOfDay } from './utils/date';
import { filterTasks, groupByType, sortByStartDay } from './utils/tasks';

const COLUMNS: { type: TaskType; title: string; Icon: ComponentType<{ className?: string }> }[] = [
  { type: 'todo', title: 'To Do', Icon: HappyIcon },
  { type: 'in_progress', title: 'In Progress', Icon: SmileIcon },
  { type: 'review', title: 'Review', Icon: UpsideDownIcon },
  { type: 'done', title: 'Done', Icon: GhostIcon },
];

export const App = () => {
  const { tasks, addTask, removeTask, updateTask, moveTask } = useTasks();
  const [query, setQuery] = useState('');
  const [dragging, setDragging] = useState(false);
  const [creating, setCreating] = useState(false);

  const grouped = useMemo(() => groupByType(sortByStartDay(filterTasks(tasks, query))), [tasks, query]);

  const handleDragStart = useCallback(() => setDragging(true), []);
  const handleDragEnd = useCallback(() => setDragging(false), []);

  const today = startOfDay(Date.now());

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1 className="header__title">Your tasks</h1>
          <SearchBar value={query} onChange={setQuery} />
        </header>
        <main className="board">
          {COLUMNS.map(({ type, title, Icon }) => {
            const isTodo = type === 'todo';
            return (
              <Column
                key={type}
                type={type}
                title={title}
                Icon={Icon}
                tasks={grouped[type]}
                dragging={dragging}
                editable={isTodo}
                action={
                  isTodo && (
                    <button type="button" className="add-btn" onClick={() => setCreating(true)} disabled={creating}>
                      + Добавить
                    </button>
                  )
                }
                draft={
                  isTodo &&
                  creating && (
                    <TaskEditor
                      initial={{ text: '', startDay: today, endDay: today }}
                      onCancel={() => setCreating(false)}
                      onSave={(draft) => {
                        addTask({ ...draft, type: 'todo' });
                        setCreating(false);
                      }}
                    />
                  )
                }
                onRemove={removeTask}
                onUpdate={updateTask}
                onMove={moveTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            );
          })}
        </main>
      </div>
    </div>
  );
};
