import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export default function LoadingSpinner({ className, size = 24, ...props }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)} {...props}>
      <Loader2 size={size} className="animate-spin text-[#004E64]" />
      <span className="text-sm font-medium text-slate-500 animate-pulse hidden">Loading...</span>
    </div>
  );
}
