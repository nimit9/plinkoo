import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import debounce from 'lodash/debounce';
import { Link, useLocation } from '@tanstack/react-router';
import { Label } from '@/components/ui/label';
import InputWithIcon from '@/common/forms/components/InputWithIcon';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getVerificationOutcome } from '@/lib/verificationOutcomes';

export interface VerificationInputsState {
  clientSeed: string;
  serverSeed: string;
  nonce: string;
}

function VerificationInputs({
  setOutcome,
  onSetVerificationInputs,
}: {
  setOutcome: (outcome: string | null) => void;
  onSetVerificationInputs?: (inputs: VerificationInputsState | null) => void;
}): JSX.Element {
  const { pathname } = useLocation();
  const [verificationInputs, setVerificationInputs] =
    useState<VerificationInputsState>({
      clientSeed: '',
      serverSeed: '',
      nonce: '0',
    });

  const handleInputChange = (
    input: keyof VerificationInputsState,
    value: string,
  ): void => {
    setVerificationInputs((prev) => ({ ...prev, [input]: value }));
  };

  const incrementNonce = (): void => {
    setVerificationInputs((prev) => ({
      ...prev,
      nonce: String(Number(prev.nonce) + 1),
    }));
  };

  const decrementNonce = (): void => {
    setVerificationInputs((prev) => ({
      ...prev,
      nonce: Math.max(0, Number(prev.nonce) - 1).toString(),
    }));
  };

  useEffect(() => {
    const { clientSeed, serverSeed, nonce } = verificationInputs;
    if (!clientSeed || !serverSeed) {
      setOutcome(null);
      onSetVerificationInputs?.(null);
      return;
    }

    void (async () => {
      try {
        const outcome = await getVerificationOutcome({
          game: 'dice',
          clientSeed,
          serverSeed,
          nonce,
        });
        setOutcome(outcome);
        onSetVerificationInputs?.(verificationInputs);
      } catch (error: unknown) {
        return error;
      }
    })();
  }, [verificationInputs, setOutcome, onSetVerificationInputs]);

  return (
    <div className="flex flex-col gap-2">
      <div>
        <Label className="pl-px text-xs text-neutral-weak font-medium">
          Client Seed
        </Label>
        <div className="flex h-8 rounded-sm overflow-hidden group">
          <InputWithIcon
            className="text-neutral-default disabled:opacity-100 font-medium text-xs disabled:cursor-text"
            icon={null}
            onChange={(e) => {
              handleInputChange('clientSeed', e.target.value);
            }}
            value={verificationInputs.clientSeed}
            wrapperClassName={cn(
              'bg-brand-stonger h-8 border-brand-weaker shadow-none w-full pr-0 ',
            )}
          />
        </div>
      </div>
      <div>
        <Label className="pl-px text-xs text-neutral-weak font-medium">
          Server Seed
        </Label>
        <div className="flex h-8 rounded-sm overflow-hidden group">
          <InputWithIcon
            className="text-neutral-default disabled:opacity-100 font-medium text-xs disabled:cursor-text"
            icon={null}
            onChange={(e) => {
              handleInputChange('serverSeed', e.target.value);
            }}
            value={verificationInputs.serverSeed}
            wrapperClassName={cn(
              'bg-brand-stronger h-8 border-brand-weaker shadow-none w-full pr-0 ',
            )}
          />
        </div>
      </div>
      <div>
        <Label className="pl-px text-xs text-neutral-weak font-medium">
          Nonce
        </Label>
        <div className="flex h-8 rounded-sm overflow-hidden group">
          <div className="rounded-l-sm flex items-center bg-brand-weaker w-full">
            <InputWithIcon
              className="text-neutral-default disabled:opacity-100 font-medium text-xs disabled:cursor-text"
              icon={null}
              min={0}
              onChange={(e) => {
                handleInputChange('nonce', e.target.value);
              }}
              step={1}
              type="number"
              value={verificationInputs.nonce}
              wrapperClassName={cn(
                'bg-brand-stronger h-8 border-brand-weaker shadow-none w-full pr-0 rounded-r-none',
              )}
            />
          </div>

          <Button
            className="bg-brand-weaker text-white rounded-none h-full hover:bg-opacity-80 hover:bg-brand-weakest shadow-none"
            onClick={incrementNonce}
          >
            <ChevronUpIcon className="size-4" />
          </Button>
          <Button
            className="bg-brand-weaker text-white rounded-none h-full hover:bg-opacity-80 hover:bg-brand-weakest shadow-none"
            onClick={decrementNonce}
          >
            <ChevronDownIcon className="size-4" />
          </Button>
        </div>
      </div>
      {!pathname.includes('/provably-fair/calculation') && (
        <Link target="_blank" to="/provably-fair/calculation">
          <p className="text-xs text-center font-medium my-2">
            View calculation breakdown
          </p>
        </Link>
      )}
    </div>
  );
}

export default VerificationInputs;
