import type { ReactNode } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Label } from './label';

interface CommonSelectProps {
  label: ReactNode;
  options: {
    label: ReactNode;
    value: string;
  }[];
  onValueChange: (value: string) => void;
  value: string | null;
}

function CommonSelect({
  label,
  options,
  onValueChange,
  value,
}: CommonSelectProps): JSX.Element {
  return (
    <div>
      <Label className="pl-px text-xs text-neutral-weak font-medium">
        {label}
      </Label>
      <Select onValueChange={onValueChange} value={value ?? ''}>
        <SelectTrigger className="h-8 pl-2 text-xs font-medium">
          <SelectValue className="text-neutral-default" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              className="h-7 text-xs font-medium"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CommonSelect;
