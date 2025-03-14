import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';
import { Tally3 } from 'lucide-react';
import { DiceCondition } from '@repo/common/game-utils/dice/types.js';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    condition: DiceCondition;
  }
>(({ className, condition, ...props }, ref) => {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          'relative h-2.5 w-full grow overflow-hidden rounded-full',
          condition === 'below' ? 'bg-red-600' : 'bg-[#00e600]',
        )}
      >
        <SliderPrimitive.Range
          className={cn(
            'absolute h-full',
            condition === 'below' ? 'bg-[#00e600]' : 'bg-red-600',
          )}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb asChild className="focus-visible:outline-none">
        <div className="h-8 w-8 flex items-center justify-center bg-blue-500 rounded-sm">
          <Tally3 className="pl-1.5" />
        </div>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
