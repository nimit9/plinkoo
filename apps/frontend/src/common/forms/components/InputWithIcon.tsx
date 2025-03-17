import type { ReactNode } from 'react';
import type { InputProps } from '@/components/ui/input';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputWithIconProps extends InputProps {
  icon: ReactNode;
  wrapperClassName?: string;
}

function InputWithIcon({
  icon,
  wrapperClassName,
  ...inputProps
}: InputWithIconProps): JSX.Element {
  return (
    <div
      className={cn(
        'bg-brand-stronger flex items-center rounded pr-2',
        {
          'border-brand-weaker hover:border-brand-weakest border-2':
            !inputProps.disabled,
        },
        wrapperClassName,
      )}
    >
      <Input
        {...inputProps}
        className={cn(
          'focus-visible:ring-0 border-0 bg-transparent pl-2',
          inputProps.className,
        )}
      />
      {icon}
    </div>
  );
}

export default InputWithIcon;
