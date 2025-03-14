import { Link } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';

const featuredGames = [
  {
    id: 'dice',
    name: 'Dice',
    description: 'Roll the dice and test your luck',
    image: '/games/dice.png',
  },
  {
    id: 'roulette',
    name: 'Roulette',
    description: 'Classic casino roulette with multiple betting options',
    image: '/games/roulette.png',
  },
  {
    id: 'mines',
    name: 'Mines',
    description: 'Avoid the mines and collect your rewards',
    image: '/games/mines.png',
  },
  {
    id: 'plinkoo',
    name: 'Plinkoo',
    description: 'Watch the ball bounce and win big',
    image: '/games/plinkoo.png',
  },
];

export function FeaturedGames(): JSX.Element {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Featured Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredGames.map((game) => (
          <Link
            className="block"
            key={game.id}
            params={{ gameId: game.id }}
            to="/casino/games/$gameId"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  alt={game.name}
                  className="object-cover w-full h-full"
                  src={game.image}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{game.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {game.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
