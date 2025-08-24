import type { PaginatedBetData } from '@repo/common/types';
import type { ColumnDef } from '@tanstack/react-table';
import { BadgeDollarSign } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { format, isValid } from 'date-fns';
import { GAME_VALUES_MAPPING } from '@/const/games';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<PaginatedBetData>[] = [
  {
    header: 'Game',
    accessorKey: 'game',
    cell: ({ row }) => {
      const game =
        GAME_VALUES_MAPPING[
          row.original.game as keyof typeof GAME_VALUES_MAPPING
        ];

      return (
        <Link to={game.path}>
          <div className="flex items-center gap-2 font-semibold group hover:cursor-pointer">
            {'icon' in game && (
              <game.icon className="size-3 icon-neutral-weak group-hover:icon-neutral-default" />
            )}
            {game.label}
          </div>
        </Link>
      );
    },
  },
  {
    header: 'User',
    accessorKey: 'user',
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="font-semibold">{user ? user.name : 'Unknown'}</div>
      );
    },
  },
  {
    header: 'Date',
    accessorKey: 'date',
    cell: ({ row }) => {
      // Format the date using date-fns
      const date = new Date(row.original.date);
      const formattedDate = isValid(date)
        ? format(date, 'h:mm a M/d/yyyy')
        : String(row.original.date);

      return (
        <div className="text-neutral-weak font-medium">{formattedDate}</div>
      );
    },
    meta: {
      alignment: 'right',
    },
  },
  {
    header: 'Bet Amount',
    accessorKey: 'betAmount',
    cell: ({ row }) => {
      return (
        <div className="text-neutral-weak font-medium flex items-center gap-1 justify-end">
          {row.original.betAmount.toFixed(2)}{' '}
          <BadgeDollarSign className="size-3.5 icon-neutral-weak" />
        </div>
      );
    },
    meta: {
      alignment: 'right',
    },
  },
  {
    header: 'Multiplier',
    accessorKey: 'payoutMultiplier',
    cell: ({ row }) => {
      return (
        <div className="text-neutral-weak font-medium">
          {row.original.payoutMultiplier.toFixed(2)}x
        </div>
      );
    },
    meta: {
      alignment: 'right',
    },
  },
  {
    header: 'Payout',
    accessorKey: 'payout',
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            'text-neutral-weak font-medium flex items-center gap-1 justify-end',
            {
              'text-green-500': row.original.payout > 0,
            }
          )}
        >
          {row.original.payout.toFixed(2)}{' '}
          <BadgeDollarSign className="size-3.5 icon-neutral-weak" />
        </div>
      );
    },
    meta: {
      alignment: 'right',
    },
  },
];
