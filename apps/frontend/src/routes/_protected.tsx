import {
  createFileRoute,
  MatchRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { getAuthState } from '@/features/auth/store/authStore';
import { getUserDetails } from '@/api/auth';
import { Header } from '@/components/Header';

export const Route = createFileRoute('/_protected')({
  async beforeLoad({ context, location }) {
    const { user } = getAuthState();

    const queryClient = new QueryClient();

    if (!user) {
      try {
        // Fetch user details if not already authenticated
        const res = await queryClient.fetchQuery({
          queryKey: ['me'],
          queryFn: getUserDetails,
          retry: false,
        });
        // Assuming fetchAuthStatus sets the user and authentication state
        context.authStore?.setUser(res.data);
      } catch (error) {
        // Redirect to login if fetch fails
        redirect({
          to: '/',
          search: {
            redirect: location.href,
          },
          params: {},
        });
      }
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout(): JSX.Element {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
}
