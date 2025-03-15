import * as React from 'react';
import {
  Outlet,
  createRootRouteWithContext,
  useNavigate,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import type { AuthState } from '@/features/auth/store/authStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { setupInterceptors } from '@/api/_utils/axiosInstance';

interface RouterContext {
  authStore: AuthState | undefined;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout(): JSX.Element {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  setupInterceptors({
    authErrCb: () => {
      setUser(null);
      void navigate({ to: '/login' });
    },
  });
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
