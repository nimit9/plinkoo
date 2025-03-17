import { Link, Outlet, useLocation, useParams } from '@tanstack/react-router';
import { ScaleIcon } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

const provablyFairRoutes = [
  {
    label: 'Overview',
    path: '/provably-fair',
  },
  {
    label: 'Implementation',
    path: '/provably-fair/implementation',
  },
  {
    label: 'Conversions',
    path: '/provably-fair/conversions',
  },
  {
    label: 'Game Events',
    path: '/provably-fair/game-events',
  },
  {
    label: 'Unhash Server Seed',
    path: '/provably-fair/unhash-server-seed',
  },
  {
    label: 'Calculation',
    path: '/provably-fair/calculation',
  },
];

function ProvablyFair(): JSX.Element {
  const { pathname } = useLocation();

  return (
    <div className="container py-6">
      <div className="flex items-center gap-2">
        <ScaleIcon className="size-4 icon-neutral-weak" />
        <h2 className="font-semibold">Provably Fair</h2>
      </div>
      <div className="grid grid-cols-12 gap-4 my-4 items-start">
        <div className="flex flex-col col-span-2 bg-brand-stronger rounded-md py-2">
          {provablyFairRoutes.map((route) => (
            <Link key={route.path} to={route.path}>
              <p
                className={cn(
                  'text-sm font-medium text-neutral-default p-3 border-l-3 hover:bg-brand-strongest bg-transparent border-brand-stronger hover:border-l-brand-strongest',
                  {
                    'bg-brand-strongest  border-l-[#1475e1] hover:border-l-[#1475e1]':
                      route.path === pathname,
                  },
                )}
              >
                {route.label}
              </p>
            </Link>
          ))}
        </div>
        <div className="w-full flex flex-col col-span-10 p-4 bg-brand-stronger rounded-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProvablyFair;
