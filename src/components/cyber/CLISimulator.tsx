
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";

interface CLISimulatorProps {
  startCommand?: string;
  autoStart?: boolean;
}

export function CLISimulator({ startCommand = "sentinel --help", autoStart = true }: CLISimulatorProps) {
  const [output, setOutput] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  
  const outputEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [output]);
  
  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  // Helper to simulate typing
  const typeText = (text: string, callback?: () => void) => {
    setIsTyping(true);
    let index = 0;
    setCurrentLine("");
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setCurrentLine(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setCurrentLine("");
        if (callback) callback();
      }
    }, 20);
  };
  
  // Simulated CLI responses
  const commandResponses: Record<string, string[]> = {
    "sentinel --help": [
      "SENTINEL CLI v1.0.3 - AI Cybersecurity Assistant",
      "Usage: sentinel [command] [options]",
      "",
      "Available Commands:",
      "  --scan            Run vulnerability scan on specified target",
      "  --analyze-log     Analyze security logs for threats",
      "  --incident        Initiate incident response protocol",
      "  --compliance      Check compliance against standards",
      "  --threat-intel    Query latest threat intelligence",
      "  --help            Display this help menu",
      "",
      "Examples:",
      "  sentinel --scan 192.168.1.0/24",
      "  sentinel --analyze-log /var/log/auth.log",
      "  sentinel --incident --severity high"
    ],
    "sentinel --scan": [
      "Initializing vulnerability scanner...",
      "Target: localhost (127.0.0.1)",
      "Scan type: Full port scan with service detection",
      "",
      "Scanning 1000 most common ports...",
      "Discovered open ports: 22(ssh), 80(http), 443(https), 3306(mysql)",
      "",
      "Running vulnerability detection modules...",
      "[+] SSH: OpenSSH 8.2p1 - No critical vulnerabilities",
      "[!] HTTP: Apache 2.4.41 - 2 Medium vulnerabilities detected",
      "    - CVE-2022-22719: mod_lua use-after-free vulnerability",
      "    - CVE-2021-44224: Possible request smuggling vulnerability",
      "[+] HTTPS: TLS 1.2 with strong ciphers - No critical vulnerabilities",
      "[!] MySQL: MySQL 5.7.33 - 1 High vulnerability detected",
      "    - CVE-2021-2307: Server privilege elevation vulnerability",
      "",
      "Scan completed. Summary:",
      "- 0 Critical vulnerabilities",
      "- 1 High vulnerability",
      "- 2 Medium vulnerabilities",
      "- 0 Low vulnerabilities",
      "",
      "Remediation advice generated. Type 'sentinel --remediate' to view recommendations."
    ],
    "sentinel --threat-intel": [
      "Connecting to threat intelligence feeds...",
      "MISP, AlienVault OTX, IBM X-Force, VirusTotal APIs available",
      "",
      "Latest threat intelligence (last 24h):",
      "",
      "[CRITICAL] New ransomware variant 'DarkNull' detected",
      "- Targets Windows servers via RDP vulnerabilities",
      "- IOCs: 185.192.69.xxx, 94.158.245.xxx",
      "- File hashes: 7a9dcd9c8c56e4fcde53e27ca5a05b6d001c97498f327a66bd7b8abfd2a2ee1d",
      "",
      "[HIGH] Active exploitation of Apache Log4j (CVE-2021-44228)",
      "- Targeting cloud infrastructure services",
      "- IOCs: User-agent strings containing '${jndi:ldap://...}'",
      "",
      "[MEDIUM] Phishing campaign targeting financial sector",
      "- Subject lines containing 'Urgent: Account Verification Required'",
      "- Attachment hashes: 03d6a479e624169d9a6513f7a04d80ffe09bbe9e678a2c6f0fa19fa5fc9470bd",
      "",
      "Recommended actions:",
      "1. Block listed IP addresses at firewall level",
      "2. Update Log4j instances immediately",
      "3. Distribute phishing awareness to finance department"
    ]
  };
  
  // Function to run a command and display response
  const runCommand = (command: string) => {
    // Add command to output
    setOutput(prev => [...prev, `$ ${command}`]);
    
    // Check if we have a predefined response
    if (command in commandResponses) {
      // Simulate processing time
      setTimeout(() => {
        const response = commandResponses[command];
        response.forEach((line, index) => {
          setTimeout(() => {
            typeText(line, () => {
              setOutput(prev => [...prev, line]);
            });
          }, index * 100);
        });
      }, 500);
    } else if (command.startsWith("sentinel --scan ")) {
      // Run generic scan command
      setOutput(prev => [
        ...prev, 
        `Scanning target: ${command.replace("sentinel --scan ", "")}`,
        "Scan in progress...",
        "Found 3 potential vulnerabilities. Full report will be generated."
      ]);
    } else {
      // Default response
      setTimeout(() => {
        setOutput(prev => [
          ...prev, 
          `Command '${command}' not recognized or missing required parameters.`,
          "Type 'sentinel --help' for usage information."
        ]);
      }, 500);
    }
  };
  
  // Auto-start the CLI with the default command
  useEffect(() => {
    if (autoStart) {
      setTimeout(() => {
        runCommand(startCommand);
      }, 1000);
    }
  }, [autoStart, startCommand]);
  
  return (
    <Card className="bg-card/30 border-border/50 backdrop-blur-sm overflow-hidden h-full">
      <CardHeader className="pb-2 border-b border-border/50 flex flex-row items-center">
        <CardTitle className="text-sm font-medium flex items-center">
          <Terminal className="h-4 w-4 mr-2 text-cyberPrimary" />
          SENTINEL CLI
        </CardTitle>
        <div className="ml-auto flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-cyberDanger"></div>
          <div className="h-2 w-2 rounded-full bg-cyberWarning"></div>
          <div className="h-2 w-2 rounded-full bg-cyberSuccess"></div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="font-mono text-xs p-4 h-[300px] overflow-y-auto bg-black/70 text-green-400 overflow-x-hidden">
          <div className="pb-2 border-b border-border/20 mb-2">
            <div className="text-cyberPrimary">╔════════════════════════════════════════════╗</div>
            <div className="px-2 text-center">SENTINEL CYBERSECURITY CLI v1.0.3</div>
            <div className="text-cyberPrimary">╚════════════════════════════════════════════╝</div>
          </div>
          
          {output.map((line, index) => (
            <div key={index} className={`mb-1 ${line.startsWith('$') ? 'text-cyberPrimary' : line.includes('[!]') || line.includes('[HIGH]') || line.includes('[CRITICAL]') ? 'text-cyberDanger' : line.includes('[+]') || line.includes('[MEDIUM]') ? 'text-cyberWarning' : ''}`}>
              {line}
            </div>
          ))}
          
          {isTyping && (
            <div className="mb-1">
              {currentLine}
              {showCursor && <span className="animate-blink">▌</span>}
            </div>
          )}
          
          {!isTyping && (
            <div className="flex">
              <span className="text-cyberPrimary">$ </span>
              <span className="text-white ml-1">
                {showCursor && <span className="animate-blink">▌</span>}
              </span>
            </div>
          )}
          
          <div ref={outputEndRef} />
        </div>
      </CardContent>
    </Card>
  );
}
