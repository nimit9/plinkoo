import { ScaleIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Game } from '@/const/games';
import Seeds from './Seeds';
import Verify from './Verify';

export function FairnessModal({ game }: { game: Game }): JSX.Element {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'seeds' | 'verify'>('seeds');

  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger>
        <p className="text-neutral-weak text-xs font-medium hover:text-neutral-default">
          Fairness
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto p-0 border-0">
        <DialogHeader className="p-3">
          <DialogTitle className="text-sm font-semibold text-neutral-default flex items-center gap-2">
            <ScaleIcon className="w-4 h-4 icon-neutral-weak" />
            Fairness
          </DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="seeds"
          onValueChange={value => {
            setActiveTab(value as 'seeds' | 'verify');
          }}
        >
          <TabsList className="grid w-52 grid-cols-2 mx-auto h-[44px]">
            <TabsTrigger value="seeds">Seeds</TabsTrigger>
            <TabsTrigger value="verify">Verify</TabsTrigger>
          </TabsList>

          <TabsContent value="seeds">
            <Seeds isEnabled={activeTab === 'seeds' && open} />
          </TabsContent>
          <TabsContent value="verify">
            <Verify game={game} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
