import type { ProvablyFairStateResponse } from '@repo/common/types';
import { useState } from 'react';
import { CopyIcon } from 'lucide-react';
import InputWithIcon from '@/common/forms/components/InputWithIcon';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { generateRandomString } from '@/lib/crypto';

interface RotateSeedPairProps {
  rotateSeedPair: (clientSeed: string) => void;
  activeSeeds: ProvablyFairStateResponse | null;
  isLoading: boolean;
}

function RotateSeedPair({
  rotateSeedPair,
  activeSeeds,
  isLoading,
}: RotateSeedPairProps): JSX.Element {
  const [nextClientSeed, setNextClientSeed] = useState<string>(
    generateRandomString(10)
  );

  return (
    <div className="flex flex-col gap-2 p-3 bg-brand-stronger">
      <div className="text-center text-sm font-semibold">Rotate Seed Pair</div>
      <div>
        <Label className="pl-px text-xs text-neutral-weak font-medium">
          Next Client Seed <span className="text-red-500">*</span>
        </Label>
        <div className="flex h-8 rounded-sm overflow-hidden group">
          <div className="flex items-center bg-brand-weaker w-full">
            <InputWithIcon
              className="text-neutral-default font-medium text-xs"
              icon={null}
              onChange={e => {
                setNextClientSeed(e.target.value);
              }}
              value={nextClientSeed}
              wrapperClassName={cn(
                'bg-brand-stronger border-brand-weaker shadow-none w-full pr-0 h-8 rounded-r-none'
              )}
            />
          </div>

          <Button
            className="text-xs rounded-none h-8 hover:bg-opacity-80 bg-[#00e600] hover:bg-[#1fff20] shadow-none"
            disabled={!nextClientSeed}
            onClick={() => {
              rotateSeedPair(nextClientSeed);
              setNextClientSeed(generateRandomString(10));
            }}
          >
            Change
          </Button>
        </div>
      </div>
      <div>
        <Label className="pl-px text-xs text-neutral-weak font-medium">
          Next Server Seed (Hashed)
        </Label>
        <div className="flex h-8 rounded-sm overflow-hidden group">
          <div className="rounded-l-sm flex items-center bg-brand-weaker w-full">
            <InputWithIcon
              className="text-neutral-default disabled:opacity-100 font-medium text-xs"
              disabled={isLoading}
              icon={null}
              value={isLoading ? '⏳' : activeSeeds?.hashedNextServerSeed}
              wrapperClassName={cn(
                'bg-brand-weaker border-brand-weaker shadow-none h-8 w-full pr-0'
              )}
            />
          </div>

          <Button
            className="bg-brand-weaker text-white rounded-none h-full hover:bg-opacity-80 hover:bg-brand-weakest shadow-none"
            onClick={() => {
              void navigator.clipboard.writeText('8ealkfnwqSFN');
            }}
          >
            <CopyIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RotateSeedPair;
