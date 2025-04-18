
import React, { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Terminal, Mic, UploadCloud } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing?: boolean;
}

export function ChatInput({ onSendMessage, isProcessing = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (message.trim() && !isProcessing) {
      onSendMessage(message);
      setMessage("");
    } else if (!message.trim()) {
      toast({
        description: "Please enter a message",
        variant: "default",
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center shadow-lg bg-card rounded-lg">
        <Button 
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary hover:bg-transparent"
          aria-label="Toggle CLI mode"
        >
          <Terminal className="h-5 w-5" />
        </Button>
        
        <Input
          placeholder={isProcessing ? "Processing..." : "Ask Sentinel about cybersecurity..."}
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent py-6"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
        />
        
        <div className="flex items-center gap-1 px-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary hover:bg-transparent"
            aria-label="Upload file"
            disabled={isProcessing}
          >
            <UploadCloud className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary hover:bg-transparent"
            aria-label="Voice input"
            disabled={isProcessing}
          >
            <Mic className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isProcessing}
            className={`bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 transition-all ${
              message.trim() ? "opacity-100" : "opacity-70"
            }`}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
