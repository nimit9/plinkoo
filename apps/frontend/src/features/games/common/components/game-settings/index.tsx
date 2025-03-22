import { SettingsIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import CommonTooltip from '@/components/ui/common-tooltip';
import type { Game } from '@/const/games';
import { FairnessModal } from '../fairness-modal';

function GameSettingsBar({ game }: { game: Game }): JSX.Element {
  return (
    <div className="bg-brand-stronger w-full pr-4 p-2 flex items-center justify-between rounded-b-md border-t-brand-weak border-t-2">
      <div className="flex items-center gap-2">
        <CommonTooltip content={<p>Game Settings</p>}>
          <Button className="hover:bg-transparent" size="icon" variant="ghost">
            <SettingsIcon className="size-3.5 icon-neutral-weak hover:icon-neutral-default" />
          </Button>
        </CommonTooltip>
      </div>
      <FairnessModal game={game} />
    </div>
  );
}

export default GameSettingsBar;
