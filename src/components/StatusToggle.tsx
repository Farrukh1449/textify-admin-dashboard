
import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface StatusToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  enabledText: string;
  disabledText: string;
  className?: string;
}

const StatusToggle = ({
  pressed,
  onPressedChange,
  enabledText,
  disabledText,
  className,
}: StatusToggleProps) => {
  return (
    <Toggle
      pressed={pressed}
      onPressedChange={onPressedChange}
      className={cn(
        "text-xs font-medium rounded-full px-3 transition-colors",
        pressed 
          ? "bg-green-500 hover:bg-green-600 text-white" 
          : "bg-gray-200 hover:bg-gray-300 text-gray-700",
        className
      )}
    >
      {pressed ? enabledText : disabledText}
    </Toggle>
  );
};

export default StatusToggle;
