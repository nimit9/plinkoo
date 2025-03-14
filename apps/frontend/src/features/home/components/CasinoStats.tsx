import { Users, Coins, TrendingUp, Timer } from 'lucide-react';
import { Card } from '@/components/ui/card';

const stats = [
  {
    title: 'Active Players',
    value: '1,234',
    icon: Users,
    change: '+12%',
  },
  {
    title: 'Total Winnings',
    value: '1.2M',
    icon: Coins,
    change: '+5%',
  },
  {
    title: 'House Edge',
    value: '1.5%',
    icon: TrendingUp,
    change: 'Fixed',
  },
  {
    title: 'Average Session',
    value: '45m',
    icon: Timer,
    change: '+8%',
  },
];

export function CasinoStats(): JSX.Element {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Casino Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card className="p-6" key={stat.title}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-sm text-green-500 mt-1">{stat.change}</p>
              </div>
              <stat.icon className="w-8 h-8 text-primary" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
