import { Balance } from './Balance';

export function Header(): JSX.Element {
  return (
    <header className="w-full bg-brand-default px-4 py-2.5 shadow-xl">
      <div className="container mx-auto flex items-center justify-between">
        <img
          alt="SimCasino Logo"
          className="h-6 w-auto"
          src="/sim-casino-logo.webp"
        />
        <Balance />
      </div>
    </header>
  );
}
