import { SiGoogle } from '@icons-pack/react-simple-icons';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function Login(): JSX.Element {
  const handleGoogleLogin = (): void => {
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
          className="w-full"
          onClick={handleGoogleLogin}
          variant="outline"
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
          <Input id="email" placeholder="m@example.com" type="email" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="Enter password" type="password" />
        </div>
        <Button className="w-full" type="submit">
          Sign In
        </Button>
        <div className="flex justify-between text-sm">
          <Button
            className="underline underline-offset-4 p-0 h-min font-normal"
            variant="link"
          >
            Forgot Password?
          </Button>
          <Button
            className="underline underline-offset-4 p-0 h-min font-normal"
            variant="link"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
