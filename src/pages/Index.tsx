
import React, { useState } from "react";
import { Header } from "@/components/cyber/Header";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { SecurityStats } from "@/components/cyber/SecurityStats";
import { CLISimulator } from "@/components/cyber/CLISimulator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Terminal, MessageSquare, AlertTriangle, Shield, Lock } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground cyber-pattern">
      <Header threatLevel="medium" notifications={3} />
      
      <div className="flex-1 container mx-auto py-6 px-4 flex flex-col gap-6">
        {/* Security Stats Dashboard */}
        <div className="grid grid-cols-1 gap-4">
          <SecurityStats />
        </div>
        
        {/* Main Content Area with Tabs */}
        <div className="flex-1 flex flex-col">
          <Tabs 
            defaultValue="chat" 
            className="flex-1 flex flex-col"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Assistant</span>
                </TabsTrigger>
                <TabsTrigger value="terminal" className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>CLI Interface</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Threats</span>
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
                  <Shield className="h-3 w-3" />
                  <span>Scan</span>
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
                  <Lock className="h-3 w-3" />
                  <span>Settings</span>
                </Button>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              <TabsContent value="chat" className="flex-1 flex flex-col m-0">
                <div className="bg-card/30 border border-border/50 rounded-lg overflow-hidden h-full flex flex-col">
                  <ChatContainer />
                </div>
              </TabsContent>
              
              <TabsContent value="terminal" className="flex-1 flex flex-col m-0">
                <div className="flex flex-col gap-4 h-full">
                  <Card className="bg-card/30 border-border/50 p-4">
                    <CardTitle className="text-sm flex items-center gap-2 mb-2">
                      <ShieldAlert className="h-4 w-4 text-cyberPrimary" />
                      CLI Interface Documentation
                    </CardTitle>
                    <CardDescription className="text-xs">
                      The Sentinel CLI provides security professionals with direct command-line access to cybersecurity tools.
                      Type <code className="bg-muted px-1 rounded">sentinel --help</code> to see available commands.
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">sentinel --scan [target]</code>
                      <code className="text-xs bg-muted px-2 py-1 rounded">sentinel --threat-intel</code>
                      <code className="text-xs bg-muted px-2 py-1 rounded">sentinel --analyze-log [file]</code>
                    </div>
                  </Card>
                  
                  <div className="flex-1">
                    <CLISimulator startCommand="sentinel --help" />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {/* Status footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-cyberSuccess animate-pulse"></div>
              <span>System Online</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/30"></div>
            <div>Last scan: 32 minutes ago</div>
          </div>
          <div>
            Sentinel AI Cybersecurity Assistant | Demo Version
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
