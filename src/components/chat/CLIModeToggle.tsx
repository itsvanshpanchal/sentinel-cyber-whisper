
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Terminal } from "lucide-react";

interface CLIModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function CLIModeToggle({ enabled, onToggle }: CLIModeToggleProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
      <Terminal className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground">CLI Mode</span>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-cyberPrimary"
      />
    </div>
  );
}
