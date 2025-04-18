
import React, { useState } from "react";
import { Header } from "@/components/cyber/Header";
import { CLISimulator } from "@/components/cyber/CLISimulator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, ArrowLeft, Copy, FileDown, RefreshCw, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const CLI = () => {
  const [activeCommand, setActiveCommand] = useState("");
  
  const commandExamples = [
    {
      name: "Vulnerability Scan",
      command: "sentinel --scan",
      description: "Run a comprehensive vulnerability scan on the local system"
    },
    {
      name: "Threat Intelligence",
      command: "sentinel --threat-intel",
      description: "Query the latest threat intelligence feeds for emerging threats"
    },
    {
      name: "Security Log Analysis",
      command: "sentinel --analyze-log /var/log/auth.log",
      description: "Analyze authentication logs for security incidents"
    },
    {
      name: "Compliance Check",
      command: "sentinel --compliance --standard=pci-dss",
      description: "Check system compliance against PCI DSS standards"
    }
  ];
  
  const runCommand = (command: string) => {
    setActiveCommand(command);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground cyber-pattern">
      <Header threatLevel="medium" notifications={3} />
      
      <div className="flex-1 container mx-auto py-6 px-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="gap-1"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </Button>
            
            <h1 className="text-xl font-bold">Command Line Interface</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Copy className="h-4 w-4" />
              <span>Copy Output</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <FileDown className="h-4 w-4" />
              <span>Save Log</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>Clear</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Command examples panel */}
          <div className="space-y-4">
            <Card className="bg-card/30 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyberPrimary" />
                  Command Examples
                </CardTitle>
                <CardDescription className="text-xs">
                  Click on any example to run the command in the terminal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {commandExamples.map((example) => (
                  <div 
                    key={example.command}
                    className="border border-border/50 rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => runCommand(example.command)}
                  >
                    <div className="font-medium text-sm mb-1">{example.name}</div>
                    <div className="font-mono text-xs text-cyberPrimary mb-2">{example.command}</div>
                    <div className="text-xs text-muted-foreground">{example.description}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card className="bg-card/30 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyberPrimary" />
                  CLI Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-xs">
                  The Sentinel CLI provides cybersecurity professionals with command-line access to powerful security tools.
                </p>
                
                <div className="space-y-2">
                  <div className="font-medium text-xs">Available Commands:</div>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono">--scan</span>
                      <span className="text-muted-foreground">Run vulnerability scanner</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono">--analyze-log</span>
                      <span className="text-muted-foreground">Analyze security logs</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono">--threat-intel</span>
                      <span className="text-muted-foreground">Query threat intelligence</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono">--compliance</span>
                      <span className="text-muted-foreground">Check compliance</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono">--incident</span>
                      <span className="text-muted-foreground">Incident response</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Terminal panel - takes 2/3 of the space */}
          <div className="md:col-span-2">
            <CLISimulator 
              startCommand={activeCommand || "sentinel --help"} 
              autoStart={!!activeCommand} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CLI;
