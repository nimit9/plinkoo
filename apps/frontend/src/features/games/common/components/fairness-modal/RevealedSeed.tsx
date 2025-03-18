import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputWithIcon from '@/common/forms/components/InputWithIcon';
import { fetchRevealedServerSeed } from '@/api/user';

function RevealedSeed(): JSX.Element {
  const [hashedSeed, setHashedSeed] = useState<string>('');
  const [revealedSeed, setRevealedSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutate: fetchSeed, isPending } = useMutation({
    mutationFn: async (hashedServerSeed: string) => {
      setError(null);
      const result = await fetchRevealedServerSeed(hashedServerSeed);
      return result.data;
    },
    onSuccess: (data) => {
      if (data.serverSeed) {
        setRevealedSeed(data.serverSeed);
      } else {
        setError('No revealed seed found. The seed may not be revealed yet.');
      }
    },
    onError: () => {
      setError('Failed to fetch the revealed seed. Please try again.');
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label className="pb-1 block">Reveal Server Seed</Label>
        <p className="text-xs text-neutral-weak mb-3">
          Enter a hashed server seed to get its original value (only revealed
          seeds can be fetched)
        </p>
        <div className="flex gap-2">
          <input
            className="flex-1 h-10 px-3 rounded border border-input bg-background"
            onChange={(e) => {
              setHashedSeed(e.target.value);
            }}
            placeholder="Enter hashed server seed"
            value={hashedSeed}
          />
          <Button
            disabled={!hashedSeed || isPending}
            onClick={() => {
              fetchSeed(hashedSeed);
            }}
            type="button"
            variant="outline"
          >
            {isPending ? 'Loading...' : 'Reveal'}
          </Button>
        </div>
      </div>

      {error ? <div className="text-red-500 text-sm mt-2">{error}</div> : null}

      {revealedSeed ? (
        <div className="mt-2">
          <Label>Revealed Server Seed</Label>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 relative">
              <input
                className="w-full h-10 px-3 rounded border border-input bg-background pr-10"
                readOnly
                value={revealedSeed}
              />
              <CopyIcon
                className="text-gray-500 w-5 h-5 cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => {
                  navigator.clipboard.writeText(revealedSeed);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default RevealedSeed;
