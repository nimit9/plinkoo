import * as React from 'react';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import type { AuthState } from '@/features/auth/store/authStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { setupInterceptors } from '@/api/_utils/axiosInstance';
import { LoginModal } from '@/features/auth/components/LoginModal';
import { Header } from '@/components/Header';
import { z } from 'zod';
import { GLOBAL_MODAL } from '@/features/global-modals/types';
import GlobalModals from '@/features/global-modals';

interface RouterContext {
  authStore: AuthState | undefined;
}

export const rootSearchSchema = z.object({
  iid: z.number().optional(),
  modal: z.enum([GLOBAL_MODAL.BET]).optional(),
});

export const Route = createRootRouteWithContext<RouterContext>()({
  validateSearch: rootSearchSchema,
  component: RootLayout,
});

function RootLayout(): JSX.Element {
  const { setUser, showLoginModal } = useAuthStore();
  const { iid, modal } = Route.useSearch();

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
      <GlobalModals iid={iid} modal={modal} />
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </>
  );
}
