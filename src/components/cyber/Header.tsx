
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, LineChart, AlertTriangle, TerminalSquare, Shield as ShieldIcon, Computer, Lock } from "lucide-react";

interface HeaderProps {
  threatLevel?: "low" | "medium" | "high" | "critical";
  notifications?: number;
}

export function Header({ threatLevel = "low", notifications = 3 }: HeaderProps) {
  // Get threat level color
  const getThreatLevelColor = () => {
    switch (threatLevel) {
      case "low":
        return "bg-cyberSuccess text-black";
      case "medium":
        return "bg-yellow-500 text-black";
      case "high":
        return "bg-orange-500 text-black";
      case "critical":
        return "bg-cyberDanger text-white";
      default:
        return "bg-cyberSuccess text-black";
    }
  };
  
  // Get threat level name
  const getThreatLevelName = () => {
    return threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1);
  };

  return (
    <header className="border-b bg-card/50 shadow-sm backdrop-blur-sm">
      <div className="container flex items-center h-16 px-4">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldIcon className="h-6 w-6 text-cyberPrimary animate-pulse-subtle" />
          <span className="font-mono text-xl tracking-tight">SENTINEL</span>
          <Badge variant="outline" className="ml-2 font-mono text-[10px] px-1 py-0 h-4">ALPHA</Badge>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Computer className="h-4 w-4" />
              <span>Systems</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4" />
              <span>Threats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LineChart className="h-4 w-4" />
              <span>Compliance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TerminalSquare className="h-4 w-4" />
              <span>CLI Mode</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">Threat level:</div>
            <Badge className={`${getThreatLevelColor()} h-6 px-2`}>
              {getThreatLevelName()}
            </Badge>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyberDanger text-[10px] text-white">
                {notifications}
              </span>
            )}
          </Button>
          
          <Button size="sm" className="gap-1 h-8 font-mono">
            <Lock className="h-3.5 w-3.5" />
            <span className="text-xs">CLI ACCESS</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
