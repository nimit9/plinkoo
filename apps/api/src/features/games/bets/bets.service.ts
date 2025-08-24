import db from '@repo/db';

export const getTopBets = async () => {
  // Get paginated bets
  const bets = await db.bet.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    take: 10,
  });

  return {
    bets: bets.map(bet => ({
      // Format betId as a 12-digit string with leading zeros
      betId: bet.betId.toString().padStart(12, '0'),
      game: bet.game,
      date: bet.createdAt,
      betAmount: bet.betAmount / 100,
      payoutMultiplier: bet.payoutAmount / bet.betAmount,
      payout: bet.payoutAmount / 100,
      id: bet.id,
      user: {
        id: bet.user.id,
        name: bet.user.name,
      },
    })),
  };
};
