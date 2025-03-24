// components/ui/custom-progress.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress as ShadcnProgress } from "@/components/ui/progress";

interface CustomProgressProps
  extends React.ComponentProps<typeof ShadcnProgress> {
  indicatorClassName?: string;
}

export function Progress({
  className,
  indicatorClassName,
  ...props
}: CustomProgressProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <ShadcnProgress {...props} className="bg-transparent" />
      <div
        className={cn(
          "absolute top-0 left-0 h-full rounded-full transition-all",
          indicatorClassName
        )}
        style={{ width: `${(props.value! / (props.max || 100)) * 100}%` }}
      />
    </div>
  );
}
