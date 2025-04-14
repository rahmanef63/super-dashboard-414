import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, X } from "lucide-react";

interface SettingsContentProps {
  isOpen: boolean;
  toggleDevTools: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function SettingsContent({ isOpen, toggleDevTools, isDarkMode, toggleDarkMode }: SettingsContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Dev Tools Settings</Label>
        <Button variant="ghost" size="icon" onClick={toggleDevTools}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode-toggle" className="flex items-center gap-2">
          {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span>Dark Mode</span>
        </Label>
        <Switch id="dark-mode-toggle" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
      </div>

       <div className="text-xs text-muted-foreground mt-4">
         Press <kbd className="px-1 bg-muted rounded">Ctrl</kbd> +{" "}
         <kbd className="px-1 bg-muted rounded">Shift</kbd> + <kbd className="px-1 bg-muted rounded">D</kbd> to
         toggle
       </div>
    </div>
  );
}
