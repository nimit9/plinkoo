import { useEffect } from 'react';
import { SiGoogle } from '@icons-pack/react-simple-icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '../store/authStore';

export function LoginModal(): JSX.Element {
  const { user, isModalOpen, hideLoginModal } = useAuthStore();

  const handleGoogleLogin = (): void => {
    // Save current URL to redirect back after login
    const currentUrl = window.location.href;
    localStorage.setItem('auth_redirect', currentUrl);

    // Redirect to Google OAuth endpoint
    window.location.href = 'http://localhost:5000/api/v1/auth/google';
  };

  // Close the modal when user becomes authenticated
  useEffect(() => {
    if (user) {
      hideLoginModal();
    }
  }, [user, hideLoginModal]);

  return (
    <Dialog onOpenChange={hideLoginModal} open={isModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to Fake Stake
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 pt-4">
          <Button
            className="w-full py-4 text-base font-medium"
            onClick={handleGoogleLogin}
            variant="outline"
          >
            <SiGoogle className="mr-3 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <Button className="p-0 h-auto font-normal text-xs" variant="link">
              Terms of Service
            </Button>{' '}
            and{' '}
            <Button className="p-0 h-auto font-normal text-xs" variant="link">
              Privacy Policy
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
