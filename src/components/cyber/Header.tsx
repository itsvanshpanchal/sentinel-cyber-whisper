
import React from "react";
import { Bell, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

interface HeaderProps {
  threatLevel: "low" | "medium" | "high";
  notifications: number;
}

export function Header({ threatLevel, notifications }: HeaderProps) {
  const { signOut } = useAuth();

  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2 font-semibold">
          <Shield className="h-5 w-5 text-cyberPrimary" />
          <span>Sentinel</span>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyberDanger text-[10px] font-medium flex items-center justify-center text-white">
                  {notifications}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut()}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
