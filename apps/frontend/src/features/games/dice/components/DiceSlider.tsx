import { Slider as ResultSlider } from '@/components/ui/dice-result-slider';
import { Slider } from '@/components/ui/dice-slider';
import useDiceStore from '../store/diceStore';

interface DiceSliderProps {
  handleValueChange: (value: number[]) => void;
  showResultSlider: boolean;
}

function DiceSlider({
  handleValueChange,
  showResultSlider,
}: DiceSliderProps): JSX.Element {
  const { target, condition, results } = useDiceStore();
  return (
    <>
      <div className="flex items-center justify-between w-full gap-2 pl-6 pr-4">
        {[0, 25, 50, 75, 100].map((value) => (
          <div className="font-semibold" key={value}>
            {value}
          </div>
        ))}
      </div>
      <div className="border-input-disabled border-[12px] p-2 rounded-full relative">
        <Slider
          condition={condition}
          onValueChange={handleValueChange}
          step={1}
          value={[target]}
        />
        {showResultSlider && results.at(-1)?.result.state.result ? (
          <div className="absolute w-full -top-6 transition-transform animate-slideInLeft">
            {(() => {
              const lastResult = results.at(-1);
              if (!lastResult) return null;
              return (
                <ResultSlider
                  success={lastResult.result.payoutMultiplier > 0}
                  value={[lastResult.result.state.result]}
                />
              );
            })()}
          </div>
        ) : null}
      </div>
    </>
  );
}

export default DiceSlider;
