import { Link } from '@tanstack/react-router';
import { Balance } from './Balance';

export function Header(): JSX.Element {
  return (
    <header className="w-full bg-brand-default lg:px-4 py-2.5 shadow-xl">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/casino/home">
          <img
            alt="SimCasino Logo"
            className="h-6 w-auto sm:block hidden"
            src="/sim-casino-logo.webp"
          />
          <img
            alt="SimCasino Mini Logo"
            className="h-6 w-auto sm:hidden"
            src="/sim-casino-mini-logo.png"
          />
        </Link>
        <Balance />
      </div>
    </header>
  );
}
