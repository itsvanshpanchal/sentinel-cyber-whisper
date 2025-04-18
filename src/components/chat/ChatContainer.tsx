
import React, { useState, useEffect, useRef } from "react";
import { Message, MessageType, AlertLevel } from "./Message";
import { ChatInput } from "./ChatInput";
import { Shield, AlertTriangle, Bell, LineChart, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Define message interface
interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  timestamp: string;
  alertLevel?: AlertLevel;
}

// Sample responses based on user input
const getResponseForMessage = (message: string): ChatMessage[] => {
  const lowercaseMsg = message.toLowerCase();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Scan for vulnerabilities
  if (lowercaseMsg.includes("scan") || lowercaseMsg.includes("vulnerability")) {
    return [
      {
        id: Date.now().toString(),
        content: "Initiating vulnerability scan. This may take a few moments...",
        type: "bot",
        timestamp: currentTime,
        alertLevel: "info"
      },
      {
        id: (Date.now() + 1).toString(),
        content: `$ nmap -sV -p 1-65535 192.168.1.0/24\n$ openvas-scan --target=internal-servers --profile=Full_and_fast\n$ wpscan --url https://example.com --enumerate u`,
        type: "bot",
        timestamp: currentTime,
        alertLevel: "cli"
      },
      {
        id: (Date.now() + 2).toString(),
        content: "Scan complete. Found 3 critical vulnerabilities:\n\n1. CVE-2023-1234: Apache Log4j vulnerable version detected\n2. CVE-2022-5678: Outdated OpenSSL version with known exploits\n3. MS-SQL Server with default credentials on port 1433",
        type: "bot",
        timestamp: currentTime,
        alertLevel: "error"
      }
    ];
  }
  
  // Incident response
  else if (lowercaseMsg.includes("incident") || lowercaseMsg.includes("attack") || lowercaseMsg.includes("breach")) {
    return [
      {
        id: Date.now().toString(),
        content: "Incident response protocol initiated. Analyzing potential breach...",
        type: "bot",
        timestamp: currentTime,
        alertLevel: "warning"
      },
      {
        id: (Date.now() + 1).toString(),
        content: `$ last | grep -v "still logged in"\n$ find /var/log -type f -mtime -1 -name "*.log" | xargs grep -l "unauthorized"\n$ netstat -tupln | grep ESTABLISHED`,
        type: "bot",
        timestamp: currentTime,
        alertLevel: "cli"
      },
      {
        id: (Date.now() + 2).toString(),
        content: "Analysis indicates potential unauthorized access via SSH. Recommended actions:\n\n1. Isolate affected system from network\n2. Capture forensic image of the system\n3. Review auth.log for all recent SSH connections\n4. Rotate all user credentials\n5. Enable 2FA for SSH access",
        type: "bot",
        timestamp: currentTime,
        alertLevel: "warning"
      }
    ];
  }
  
  // Compliance check
  else if (lowercaseMsg.includes("compliance") || lowercaseMsg.includes("gdpr") || lowercaseMsg.includes("pci")) {
    return [
      {
        id: Date.now().toString(),
        content: "Running compliance assessment against selected frameworks...",
        type: "bot",
        timestamp: currentTime,
        alertLevel: "info"
      },
      {
        id: (Date.now() + 1).toString(),
        content: "Compliance check complete. Your environment is 73% compliant with PCI DSS requirements.\n\nGaps identified:\n1. Requirement 3.4: Full disk encryption not implemented on all systems\n2. Requirement 10.2: Automated audit logs not enabled for all system components\n3. Requirement 8.3: Multi-factor authentication not enforced for all remote access",
        type: "bot",
        timestamp: currentTime,
        alertLevel: "warning"
      }
    ];
  }
  
  // Cloud security
  else if (lowercaseMsg.includes("cloud") || lowercaseMsg.includes("aws") || lowercaseMsg.includes("azure")) {
    return [
      {
        id: Date.now().toString(),
        content: "Scanning cloud environment for security issues...",
        type: "bot",
        timestamp: currentTime,
        alertLevel: "info"
      },
      {
        id: (Date.now() + 1).toString(),
        content: `$ aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ConsoleLogin\n$ aws s3api list-buckets --query "Buckets[].Name" | grep -E "public|open"\n$ aws ec2 describe-security-groups | grep "0.0.0.0/0"`,
        type: "bot",
        timestamp: currentTime,
        alertLevel: "cli"
      },
      {
        id: (Date.now() + 2).toString(),
        content: "Cloud security assessment complete. Found issues:\n\n1. S3 bucket 'app-backups-prod' has public read access\n2. EC2 instance i-0123456789abcdef has unrestricted inbound access (0.0.0.0/0)\n3. IAM user 'jenkins-deploy' has overly permissive AdministratorAccess policy\n4. CloudTrail logging is not enabled in region eu-west-1",
        type: "bot",
        timestamp: currentTime,
        alertLevel: "warning"
      }
    ];
  }
  
  // Default response
  else {
    return [
      {
        id: Date.now().toString(),
        content: "I'm Sentinel, your AI cybersecurity assistant. I can help with:\n\n• Vulnerability scanning and management\n• Incident response and threat detection\n• Compliance checks (GDPR, PCI DSS, ISO 27001)\n• Cloud security assessment\n• Security best practices\n\nHow can I assist you with your cybersecurity needs today?",
        type: "bot",
        timestamp: currentTime,
        alertLevel: "info"
      }
    ];
  }
};

// Initial welcome message
const initialMessages: ChatMessage[] = [
  {
    id: "welcome-1",
    content: "Welcome to Sentinel AI Cybersecurity Assistant",
    type: "system",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: "welcome-2",
    content: "I'm your AI-powered cybersecurity assistant. I can help with vulnerability scanning, incident response, compliance checks, and security best practices. What would you like assistance with today?",
    type: "bot",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    alertLevel: "info"
  }
];

export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      type: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      const botResponses = getResponseForMessage(content);
      
      // Display each bot response with a typing animation
      botResponses.forEach((response, index) => {
        setTimeout(() => {
          setTypingIndex(messages.length + index + 1);
          
          // After a short delay, show the complete message
          setTimeout(() => {
            setTypingIndex(null);
            setMessages((prev) => [...prev, response]);
            
            // If this is the last response, stop loading
            if (index === botResponses.length - 1) {
              setLoading(false);
            }
          }, 1000 + Math.random() * 1000);
        }, index * 2000);
      });
    }, 1000);
  };
  
  // Function to handle quick action buttons
  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };
  
  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <Message
              key={message.id}
              content={message.content}
              type={message.type}
              timestamp={message.timestamp}
              alertLevel={message.alertLevel}
              isTyping={typingIndex === index}
            />
          ))}
          
          {/* Show typing indicator when loading new messages */}
          {loading && typingIndex === null && (
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
          <ChatInput onSendMessage={handleSendMessage} isProcessing={loading} />
        </div>
      </div>
    </div>
  );
}
