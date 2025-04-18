
import React, { useRef } from "react";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, LineChart, Terminal } from "lucide-react";
import { useChat } from "./hooks/useChat";

export function ChatContainer() {
  const { messages, loading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <Message
              key={message.id}
              content={message.content}
              type={message.type}
              timestamp={message.timestamp}
              alertLevel={message.alertLevel}
            />
          ))}
          
          {loading && (
            <Message
              content=""
              type="bot"
              isTyping={true}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick action buttons */}
        <div className="p-2 bg-card/50 border-t border-border">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              variant="outline" 
              className="bg-card hover:bg-muted text-xs h-8"
              onClick={() => handleQuickAction("Scan my system for vulnerabilities")}
            >
              <Shield className="h-3 w-3 mr-1" /> Scan Vulnerabilities
            </Button>
            <Button 
              variant="outline" 
              className="bg-card hover:bg-muted text-xs h-8"
              onClick={() => handleQuickAction("Help! I think there's been a security incident")}
            >
              <AlertTriangle className="h-3 w-3 mr-1" /> Incident Response
            </Button>
            <Button 
              variant="outline" 
              className="bg-card hover:bg-muted text-xs h-8"
              onClick={() => handleQuickAction("Check my GDPR compliance status")}
            >
              <LineChart className="h-3 w-3 mr-1" /> Compliance Check
            </Button>
            <Button 
              variant="outline" 
              className="bg-card hover:bg-muted text-xs h-8"
              onClick={() => handleQuickAction("Analyze AWS cloud security")}
            >
              <Terminal className="h-3 w-3 mr-1" /> Cloud Security
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <ChatInput onSendMessage={sendMessage} isProcessing={loading} />
        </div>
      </div>
    </div>
  );
}
