import { createFileRoute } from '@tanstack/react-router';
import MyBets from '@/features/my-bets';

export const Route = createFileRoute('/_protected/casino/my-bets')({
  component: MyBets,
});
