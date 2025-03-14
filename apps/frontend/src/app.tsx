import './index.css';
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { AuthState, useAuthStore } from './features/auth/store/authStore';
import axios from 'axios';
import { setupInterceptors } from './api/_utils/axiosInstance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    authStore: undefined,
  } as { authStore: AuthState | undefined },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const authStore = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ authStore }} />
    </QueryClientProvider>
  );
}

export default App;
