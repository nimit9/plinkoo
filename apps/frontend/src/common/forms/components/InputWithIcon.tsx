import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface InputWithIconProps extends InputProps {
  icon: ReactNode;
  wrapperClassName?: string;
}

const InputWithIcon = ({
  icon,
  wrapperClassName,
  ...inputProps
}: InputWithIconProps) => {
  return (
    <div
      className={cn(
        'has-[:focus]:border-background bg-background flex items-center rounded pr-2',
        wrapperClassName,
      )}
    >
      <Input
        {...inputProps}
        className={cn(
          'focus-visible:ring-0 border-0 bg-transparent',
          inputProps?.className,
        )}
      />
      {icon}
    </div>
  );
};

export default InputWithIcon;
