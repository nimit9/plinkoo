import { Link, Outlet, useLocation } from '@tanstack/react-router';
import { ScaleIcon } from 'lucide-react';
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
      <div className="lg:grid grid-cols-6 gap-4 my-4 items-start">
        <div className="lg:flex flex-col col-span-1 bg-brand-stronger rounded-md py-2 hidden">
          {provablyFairRoutes.map(route => (
            <Link key={route.path} to={route.path}>
              <p
                className={cn(
                  'text-sm font-medium text-neutral-default p-3 border-l-3 hover:bg-brand-strongest bg-transparent border-brand-stronger hover:border-l-brand-strongest',
                  {
                    'bg-brand-strongest  border-l-[#1475e1] hover:border-l-[#1475e1]':
                      route.path === pathname,
                  }
                )}
              >
                {route.label}
              </p>
            </Link>
          ))}
        </div>
        <div className="w-full flex flex-col col-span-5 p-2 lg:p-4 bg-brand-stronger rounded-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProvablyFair;
