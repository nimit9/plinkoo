import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SiGoogle } from '@icons-pack/react-simple-icons';
import { Link } from '@tanstack/react-router';

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/v1/auth/google';
  };

  return (
    <div className="mx-auto max-w-md space-y-6 mt-16 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground">
          Welcome back! Sign in to your account.
        </p>
      </div>
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          <SiGoogle className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        {/* <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" />
        </div> */}
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter password" />
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
        <div className="flex justify-between text-sm">
          <Button
            variant="link"
            className="underline underline-offset-4 p-0 h-min font-normal"
          >
            Forgot Password?
          </Button>
          <Button
            variant="link"
            className="underline underline-offset-4 p-0 h-min font-normal"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
