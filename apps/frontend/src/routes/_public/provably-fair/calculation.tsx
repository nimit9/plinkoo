import { createFileRoute } from '@tanstack/react-router';
import ProvablyFairCalculation from '@/features/provaly-fair/ProvablyFairCalculation';

export const Route = createFileRoute('/_public/provably-fair/calculation')({
  component: ProvablyFairCalculation,
});
