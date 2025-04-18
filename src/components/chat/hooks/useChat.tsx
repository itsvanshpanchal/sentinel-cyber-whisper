import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { MessageType, AlertLevel } from '../Message';

interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  timestamp?: string;
  alertLevel?: AlertLevel;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch initial messages
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;

        setMessages(
          data.map((msg) => ({
            id: msg.id,
            content: msg.content,
            type: msg.type as MessageType,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            alertLevel: msg.alert_level as AlertLevel | undefined,
          }))
        );
      } catch (error) {
        toast({
          title: "Error loading messages",
          description: "Failed to load chat history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  // Subscribe to new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const newMessage = payload.new;
          setMessages((prev) => [...prev, {
            id: newMessage.id,
            content: newMessage.content,
            type: newMessage.type as MessageType,
            timestamp: new Date(newMessage.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            alertLevel: newMessage.alert_level as AlertLevel | undefined,
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content,
          type: 'user',
          user_id: user.id,
        });

      if (error) throw error;

      // Simulate bot response after user message
      setTimeout(async () => {
        const botResponses = getResponseForMessage(content);
        for (const response of botResponses) {
          await supabase
            .from('chat_messages')
            .insert({
              content: response.content,
              type: 'bot',
              alert_level: response.alertLevel,
              user_id: user.id,
            });
        }
      }, 1000);

    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Failed to send your message",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
}

// Helper function to generate bot responses (keeping existing logic)
const getResponseForMessage = (message: string) => {
  const lowercaseMsg = message.toLowerCase();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Scan for vulnerabilities
  if (lowercaseMsg.includes("scan") || lowercaseMsg.includes("vulnerability")) {
    return [
      {
        content: "Initiating vulnerability scan. This may take a few moments...",
        type: "bot",
        alertLevel: "info"
      },
      {
        content: `$ nmap -sV -p 1-65535 192.168.1.0/24\n$ openvas-scan --target=internal-servers --profile=Full_and_fast\n$ wpscan --url https://example.com --enumerate u`,
        type: "bot",
        alertLevel: "cli"
      },
      {
        content: "Scan complete. Found 3 critical vulnerabilities:\n\n1. CVE-2023-1234: Apache Log4j vulnerable version detected\n2. CVE-2022-5678: Outdated OpenSSL version with known exploits\n3. MS-SQL Server with default credentials on port 1433",
        type: "bot",
        alertLevel: "error"
      }
    ];
  }
  
  // Incident response
  else if (lowercaseMsg.includes("incident") || lowercaseMsg.includes("attack") || lowercaseMsg.includes("breach")) {
    return [
      {
        content: "Incident response protocol initiated. Analyzing potential breach...",
        type: "bot",
        alertLevel: "warning"
      },
      {
        content: `$ last | grep -v "still logged in"\n$ find /var/log -type f -mtime -1 -name "*.log" | xargs grep -l "unauthorized"\n$ netstat -tupln | grep ESTABLISHED`,
        type: "bot",
        alertLevel: "cli"
      },
      {
        content: "Analysis indicates potential unauthorized access via SSH. Recommended actions:\n\n1. Isolate affected system from network\n2. Capture forensic image of the system\n3. Review auth.log for all recent SSH connections\n4. Rotate all user credentials\n5. Enable 2FA for SSH access",
        type: "bot",
        alertLevel: "warning"
      }
    ];
  }
  
  // Compliance check
  else if (lowercaseMsg.includes("compliance") || lowercaseMsg.includes("gdpr") || lowercaseMsg.includes("pci")) {
    return [
      {
        content: "Running compliance assessment against selected frameworks...",
        type: "bot",
        alertLevel: "info"
      },
      {
        content: "Compliance check complete. Your environment is 73% compliant with PCI DSS requirements.\n\nGaps identified:\n1. Requirement 3.4: Full disk encryption not implemented on all systems\n2. Requirement 10.2: Automated audit logs not enabled for all system components\n3. Requirement 8.3: Multi-factor authentication not enforced for all remote access",
        type: "bot",
        alertLevel: "warning"
      }
    ];
  }
  
  // Cloud security
  else if (lowercaseMsg.includes("cloud") || lowercaseMsg.includes("aws") || lowercaseMsg.includes("azure")) {
    return [
      {
        content: "Scanning cloud environment for security issues...",
        type: "bot",
        alertLevel: "info"
      },
      {
        content: `$ aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ConsoleLogin\n$ aws s3api list-buckets --query "Buckets[].Name" | grep -E "public|open"\n$ aws ec2 describe-security-groups | grep "0.0.0.0/0"`,
        type: "bot",
        alertLevel: "cli"
      },
      {
        content: "Cloud security assessment complete. Found issues:\n\n1. S3 bucket 'app-backups-prod' has public read access\n2. EC2 instance i-0123456789abcdef has unrestricted inbound access (0.0.0.0/0)\n3. IAM user 'jenkins-deploy' has overly permissive AdministratorAccess policy\n4. CloudTrail logging is not enabled in region eu-west-1",
        type: "bot",
        alertLevel: "warning"
      }
    ];
  }
  
  // Default response
  else {
    return [
      {
        content: "I'm Sentinel, your AI cybersecurity assistant. I can help with:\n\n• Vulnerability scanning and management\n• Incident response and threat detection\n• Compliance checks (GDPR, PCI DSS, ISO 27001)\n• Cloud security assessment\n• Security best practices\n\nHow can I assist you with your cybersecurity needs today?",
        type: "bot",
        alertLevel: "info"
      }
    ];
  }
};
