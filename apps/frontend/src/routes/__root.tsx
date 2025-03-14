import * as React from 'react';
import {
  Outlet,
  createRootRouteWithContext,
  useNavigate,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { AuthState, useAuthStore } from '@/features/auth/store/authStore';
import { setupInterceptors } from '@/api/_utils/axiosInstance';

interface IRouterContext {
  authStore: AuthState | undefined;
}

export const Route = createRootRouteWithContext<IRouterContext>()({
  component: () => {
    const navigate = useNavigate();
    const { setUser } = useAuthStore();
    setupInterceptors({
      authErrCb: () => {
        setUser(null);
        navigate({ to: '/login' });
      },
    });
    return (
      <React.Fragment>
        <Outlet />
        <TanStackRouterDevtools />
      </React.Fragment>
    );
  },
});
