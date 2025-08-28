import * as React from 'react';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import type { AuthState } from '@/features/auth/store/authStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { setupInterceptors } from '@/api/_utils/axiosInstance';
import { LoginModal } from '@/features/auth/components/LoginModal';
import { Header } from '@/components/Header';

interface RouterContext {
  authStore: AuthState | undefined;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout(): JSX.Element {
  const { setUser, showLoginModal } = useAuthStore();

  // Setup interceptors to show login modal on auth errors
  React.useEffect(() => {
    setupInterceptors({
      authErrCb: () => {
        setUser(null);
        showLoginModal();
      },
    });
  }, [setUser, showLoginModal]);

  return (
    <>
      <Header />
      <Outlet />
      <LoginModal />
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </>
  );
}
