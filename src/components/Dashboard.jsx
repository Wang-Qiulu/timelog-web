import StatsCards from './StatsCards';
import CategoryPieChart from './CategoryPieChart';

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <StatsCards />
      <CategoryPieChart />
    </div>
  );
}