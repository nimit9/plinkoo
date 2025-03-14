import { getAuthState } from '@/features/auth/store/authStore';
import {
  createFileRoute,
  MatchRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { getUserDetails } from '@/api/auth';

export const Route = createFileRoute('/_protected/')({
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

        if (!res.data) {
          throw redirect({
            to: '/',
            search: {
              redirect: location.href,
            },
          });
        }

        // Assuming fetchAuthStatus sets the user and authentication state
        context.authStore?.setUser(res.data);
      } catch (error) {
        // Redirect to login if fetch fails
        throw redirect({
          to: '/',
          search: {
            redirect: location.href,
          },
        });
      }
    }
  },
  component: () => (
    <>
      <MatchRoute to="/">
        <>HOmeeeee</>
      </MatchRoute>
      <Outlet />
    </>
  ),
});
