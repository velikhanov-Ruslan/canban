import { isOverdue } from '../isOverdue';

// «Сегодня» в тестах — 18.11.2026, 15:30 по локальному времени
const NOW = new Date(2026, 10, 18, 15, 30);
const day = (d: number, h = 0) => new Date(2026, 10, d, h).getTime();

describe('isOverdue', () => {
  it('дедлайн в прошлом — просрочена', () => {
    expect(isOverdue({ type: 'todo', endDay: day(17) }, NOW)).toBe(true);
  });

  it('дедлайн сегодня — ещё не просрочена (даже если время уже прошло)', () => {
    expect(isOverdue({ type: 'todo', endDay: day(18) }, NOW)).toBe(false);
    expect(isOverdue({ type: 'todo', endDay: day(18, 9) }, NOW)).toBe(false);
  });

  it('дедлайн в будущем — не просрочена', () => {
    expect(isOverdue({ type: 'in_progress', endDay: day(19) }, NOW)).toBe(false);
  });

  it('последняя миллисекунда вчерашнего дня — просрочена', () => {
    expect(isOverdue({ type: 'review', endDay: day(18) - 1 }, NOW)).toBe(true);
  });

  it("задача в статусе 'done' никогда не считается просроченной", () => {
    expect(isOverdue({ type: 'done', endDay: day(1) }, NOW)).toBe(false);
  });

  it.each(['todo', 'in_progress', 'review'] as const)("статус '%s' с прошедшим дедлайном — просрочена", (type) => {
    expect(isOverdue({ type, endDay: day(10) }, NOW)).toBe(true);
  });

  it('по умолчанию сравнивает с текущей датой', () => {
    expect(isOverdue({ type: 'todo', endDay: 0 })).toBe(true);
    expect(isOverdue({ type: 'todo', endDay: Date.now() + 86_400_000 })).toBe(false);
  });
});
