
import React from "react";
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, CheckCircle, Terminal } from "lucide-react";

export type MessageType = "user" | "bot" | "system";
export type AlertLevel = "info" | "warning" | "success" | "error" | "cli";

interface MessageProps {
  content: string;
  type: MessageType;
  timestamp?: string;
  alertLevel?: AlertLevel;
  isTyping?: boolean;
}

export function Message({ content, type, timestamp, alertLevel = "info", isTyping = false }: MessageProps) {
  const isUser = type === "user";
  const isSystem = type === "system";
  
  // Format the timestamp
  const formattedTime = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Get the appropriate icon based on alert level
  const getIcon = () => {
    switch (alertLevel) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-cyberWarning" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-cyberSuccess" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-cyberDanger" />;
      case "cli":
        return <Terminal className="h-4 w-4 text-cyberPrimary" />;
      default:
        return <Shield className="h-4 w-4 text-cyberPrimary" />;
    }
  };
  
  // Handle CLI message formatting (adding monospace and terminal-like styling)
  const formattedContent = alertLevel === "cli" ? 
    <pre className="whitespace-pre-wrap font-mono text-xs bg-black/50 p-3 rounded-md overflow-x-auto max-w-full">{content}</pre> :
    content;
  
  return (
    <div 
      className={cn(
        "flex w-full max-w-[85%] animate-fade-in",
        isUser ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col rounded-lg px-4 py-3 shadow-sm", 
          isUser ? "bg-muted text-muted-foreground animate-fade-in-left" : 
            isSystem ? "bg-cyberSurface border border-cyberPrimary/20 animate-fade-in" :
            "bg-cyberSurface text-primary-foreground animate-fade-in-right"
        )}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            {getIcon()}
            <span className="text-xs font-medium text-muted-foreground">
              {isSystem ? "SYSTEM" : "Sentinel"}
            </span>
            <span className="text-xs text-muted-foreground/60">{formattedTime}</span>
          </div>
        )}
        
        <div className={cn(
          "text-sm",
          isTyping && "after:content-['|'] after:ml-0.5 after:animate-typing after:text-cyberPrimary",
          alertLevel === "warning" && "text-cyberWarning",
          alertLevel === "error" && "text-cyberDanger",
          alertLevel === "success" && "text-cyberSuccess"
        )}>
          {formattedContent}
        </div>
        
        {isUser && (
          <div className="flex justify-end mt-1">
            <span className="text-xs text-muted-foreground/60">{formattedTime}</span>
          </div>
        )}
      </div>
    </div>
  );
}
