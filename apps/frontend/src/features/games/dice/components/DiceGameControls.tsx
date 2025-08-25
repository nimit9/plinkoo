import InputWithIcon from '@/common/forms/components/InputWithIcon';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type {
  GameControl,
  NumericControl,
  RollControl,
} from '../config/controls';
import type { DiceStore } from '../store/diceStore';

interface GameControlsProps {
  controls: GameControl[];
  state: DiceStore;
}

function NumericControlInput({
  control,
  state,
}: {
  control: NumericControl;
  state: DiceStore;
}): JSX.Element {
  const value = control.getValue(state);
  const isValid = value >= control.min && value <= control.max;
  const Icon = control.icon;

  return (
    <div className="flex-1">
      <Label className="pl-px text-xs font-semibold">{control.label}</Label>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          {!isValid && (
            <TooltipTrigger>
              <InputWithIcon
                icon={<Icon className="text-gray-500 w-5 h-5" />}
                min={control.min}
                onChange={e => {
                  control.setValue(state, Number(e.target.value));
                }}
                step={control.step}
                type="number"
                value={value}
                wrapperClassName="border-red-500 hover:border-red-500"
              />
            </TooltipTrigger>
          )}
          <TooltipContent className="text-xs p-3 font-semibold" sideOffset={10}>
            <p>{control.getValidationMessage(value)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isValid ? (
        <InputWithIcon
          icon={<Icon className="text-gray-500 w-5 h-5" />}
          min={control.min}
          onChange={e => {
            control.setValue(state, Number(e.target.value));
          }}
          step={control.step}
          type="number"
          value={value}
        />
      ) : null}
    </div>
  );
}

function RollControlInput({
  control,
  state,
}: {
  control: RollControl;
  state: DiceStore;
}): JSX.Element {
  const value = control.getValue(state);
  const condition = control.getCondition(state);
  const Icon = control.icon;

  return (
    <div className="flex-1">
      <Label className="pl-px font-semibold">
        {control.label} {condition === 'above' ? 'Over' : 'Under'}
      </Label>
      <div
        className="bg-background h-10 w-full rounded flex items-center justify-between px-3 text-sm cursor-pointer border-2 border-brand-weaker"
        onClick={() => {
          control.onToggle(state);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            control.onToggle(state);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <span>{value}</span>
        <Icon className="text-gray-500 w-5 h-5 cursor-pointer" />
      </div>
    </div>
  );
}

function ControlInput({
  control,
  state,
}: {
  control: GameControl;
  state: DiceStore;
}): JSX.Element {
  if (control.type === 'numeric') {
    return <NumericControlInput control={control} state={state} />;
  }
  return <RollControlInput control={control} state={state} />;
}

export function DiceGameControls({
  controls,
  state,
}: GameControlsProps): JSX.Element {
  return (
    <div className="bg-brand-weak px-2 py-1 lg:px-4 lg:py-2 lg:pb-3 rounded flex gap-2 lg:gap-4 w-full">
      {controls.map(control => (
        <ControlInput control={control} key={control.id} state={state} />
      ))}
    </div>
  );
}
