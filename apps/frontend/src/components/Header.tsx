import { Balance } from './Balance';

export function Header(): JSX.Element {
  return (
    <header className="w-full bg-brand-default px-4 py-2.5 shadow-lg">
      <div className="container mx-auto flex items-center justify-center">
        <Balance />
      </div>
    </header>
  );
}
