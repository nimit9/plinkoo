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
  forceHide?: boolean;
}

function CommonTooltip({
  children,
  content,
  open,
  onOpenChange = () => {
    void 0;
  },
  forceHide = false,
}: CommonTooltipProps): JSX.Element {
  if (forceHide) {
    return <>{children}</>;
  }
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
