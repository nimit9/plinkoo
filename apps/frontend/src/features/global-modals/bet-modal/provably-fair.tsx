import CopyIcon from '@/assets/icons/copy';
import InputWithIcon from '@/common/forms/components/InputWithIcon';
import { Button } from '@/components/ui/button';
import CommonTooltip from '@/components/ui/common-tooltip';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import React from 'react';

const ProvablyFair = ({
  serverSeed,
  hashedServerSeed,
  clientSeed,
  nonce,
}: {
  serverSeed?: string;
  hashedServerSeed: string;
  clientSeed: string;
  nonce: number;
}) => {
  const activeSeedInputs = [
    {
      key: 'serverSeed',
      label: 'Server Seed',
      value: serverSeed,
      isCopyActive: true,
      disabled: !serverSeed,
    },
    {
      key: 'hashedServerSeed',
      label: 'Server Seed (Hashed)',
      value: hashedServerSeed,
      isCopyActive: true,
    },
    {
      key: 'clientSeed',
      label: 'Client Seed',
      value: clientSeed,
      isCopyActive: true,
    },
    {
      key: 'nonce',
      label: 'Nonce',
      value: nonce,
      isCopyActive: true,
    },
  ];
  const [showCopiedText, setShowCopiedText] = React.useState<{
    [key: string]: boolean;
  }>({});

  return (
    <div className="flex flex-col gap-2">
      {activeSeedInputs.map(input => (
        <div key={input.key}>
          <Label className="pl-px text-xs text-neutral-weak font-medium">
            {input.label}
          </Label>
          <div className="flex h-8 rounded-sm overflow-hidden group">
            <div className="rounded-l-sm flex items-center bg-brand-weaker w-full">
              <InputWithIcon
                className="text-neutral-default disabled:opacity-100 font-medium text-xs disabled:cursor-text disabled:text-neutral-weak"
                disabled={input.disabled}
                icon={null}
                value={
                  input.disabled ? "Seed hasn't been revealed yet" : input.value
                }
                wrapperClassName={cn(
                  'bg-brand-weaker h-8 border-brand-weaker shadow-none w-full pr-0 '
                )}
              />
            </div>
            {input.isCopyActive && !input.disabled ? (
              <CommonTooltip
                content={'Copied!'}
                contentClassName="p-2 px-3 bg-primary text-primary-foreground text-xs"
                open={showCopiedText[input.key]}
                arrowClassName="fill-primary"
              >
                <Button
                  className="bg-brand-weaker text-white rounded-none h-full hover:bg-opacity-80 hover:bg-brand-weakest shadow-none"
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      String(input.value || '')
                    );
                    setShowCopiedText(prev => ({ ...prev, [input.key]: true }));
                    setTimeout(() => {
                      setShowCopiedText(prev => ({
                        ...prev,
                        [input.key]: false,
                      }));
                    }, 2000);
                  }}
                >
                  <CopyIcon className="size-4" />
                </Button>
              </CommonTooltip>
            ) : null}
          </div>
        </div>
      ))}
      <div className="w-full text-neutral-weak text-xs text-center mt-1 flex flex-col gap-2">
        {!serverSeed && (
          <span>Server seed needs to be changed to verify bet...</span>
        )}
        <Link to="/provably-fair" className="font-semibold hover:text-primary">
          What is Provable Fairness?
        </Link>
      </div>
    </div>
  );
};

export default ProvablyFair;
