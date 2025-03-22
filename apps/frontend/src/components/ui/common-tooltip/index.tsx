import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CommonTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function CommonTooltip({
  children,
  content,
  open,
  onOpenChange = () => {
    void 0;
  },
}: CommonTooltipProps): JSX.Element {
  return (
    <TooltipProvider>
      <Tooltip
        {...{
          ...(open !== undefined && { onOpenChange, open }),
        }}
      >
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="font-medium">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default CommonTooltip;
