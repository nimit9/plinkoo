import { TrendingUp, Target, Dice6 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import crashGame from '@/assets/crash-game.jpg';
// import plinkoGame from '@/assets/plinko-game.jpg';
// import diceGame from '@/assets/dice-game.jpg';

const games = [
  {
    title: 'Crash',
    description:
      'Watch the multiplier soar and cash out before it crashes. Test your timing and risk management.',
    // image: crashGame,
    icon: TrendingUp,
    difficulty: 'Medium',
    minBet: '0.01',
    maxMultiplier: '1000x',
  },
  {
    title: 'Plinko',
    description:
      'Drop the ball and watch it bounce through the pegs. Pure chance with strategic bet sizing.',
    // image: plinkoGame,
    icon: Target,
    difficulty: 'Easy',
    minBet: '0.01',
    maxMultiplier: '100x',
  },
  {
    title: 'Dice',
    description:
      'Predict if the dice roll will be over or under your chosen number. Simple yet strategic.game',
    // image: diceGame,
    icon: Dice6,
    difficulty: 'Easy',
    minBet: '0.01',
    maxMultiplier: '9900x',
  },
];

export function FeaturedGames(): JSX.Element {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Featured{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Games
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice on real casino games with fake money. Perfect your
            strategies risk-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map(game => {
            const IconComponent = game.icon;
            return (
              <Card
                className="group hover:shadow-glow transition-all duration-300 hover:scale-[1.02] bg-card/50 backdrop-blur-sm border-border/50"
                key={game.title}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  {/* <img
                    alt={`${game.title} game interface`}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    src={game.image}
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  <Badge className="absolute top-4 right-4 bg-primary/20 text-primary border-primary/30">
                    {game.difficulty}
                  </Badge>
                </div>

                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-xl">{game.title}</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {game.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Min Bet</div>
                      <div className="font-semibold">{game.minBet} coins</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Max Win</div>
                      <div className="font-semibold text-success">
                        {game.maxMultiplier}
                      </div>
                    </div>
                  </div>

                  <Button className="w-full group gap-2" variant="neon">
                    Try {game.title}
                    <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
