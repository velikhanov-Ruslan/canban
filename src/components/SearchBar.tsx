import { SearchIcon } from './Icons';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: Props) => (
  <label className="search">
    <SearchIcon className="search__icon" />
    <input
      className="search__input"
      type="search"
      placeholder="поиск..."
      title="Поиск по описанию или по дате в формате дд.мм.гггг"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Поиск задач по описанию или дате (дд.мм.гггг)"
    />
  </label>
);
