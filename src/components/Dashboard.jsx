import StatsCards from './StatsCards';
import CategoryPieChart from './CategoryPieChart';

export default function Dashboard({ mode = 'today' }) {
  return (
    <div className="space-y-4">
      <StatsCards mode={mode} />
      <CategoryPieChart mode={mode} />
    </div>
  );
}