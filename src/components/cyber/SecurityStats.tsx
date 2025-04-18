
import React from "react";
import { Shield, AlertTriangle, CheckCircle2, Activity, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  progressValue?: number;
  progressColor?: string;
}

function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendValue, 
  progressValue,
  progressColor = "bg-cyberPrimary" 
}: StatCardProps) {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-8 w-8 rounded-md bg-muted/50 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        
        {trend && (
          <div className="flex items-center gap-1 text-xs">
            <span className={
              trend === "up" 
                ? "text-red-500" 
                : trend === "down" 
                ? "text-green-500" 
                : "text-muted-foreground"
            }>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </span>
            <span className="text-muted-foreground">vs. last 24h</span>
          </div>
        )}
        
        {progressValue !== undefined && (
          <div className="mt-3">
            <Progress value={progressValue} className={`h-1.5 ${progressColor}`} />
          </div>
        )}
        
        {/* Add scanner effect for cybersecurity aesthetic */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <div className="w-full h-1 bg-cyberPrimary/40 animate-scanning"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SecurityStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Security Score"
        value="78/100"
        description="Overall security posture"
        icon={<Shield className="h-4 w-4 text-cyberPrimary" />}
        progressValue={78}
        progressColor="bg-cyberPrimary"
      />
      
      <StatCard
        title="Active Threats"
        value="12"
        description="3 critical, 9 moderate"
        icon={<AlertTriangle className="h-4 w-4 text-cyberDanger" />}
        trend="up"
        trendValue="4 new"
        progressValue={32}
        progressColor="bg-cyberDanger"
      />
      
      <StatCard
        title="Compliance"
        value="86%"
        description="PCI DSS, GDPR, ISO 27001"
        icon={<CheckCircle2 className="h-4 w-4 text-cyberSuccess" />}
        trend="up"
        trendValue="2%"
        progressValue={86}
        progressColor="bg-cyberSuccess"
      />
      
      <StatCard
        title="System Activity"
        value="1.2k"
        description="Events in last 24 hours"
        icon={<Activity className="h-4 w-4 text-cyberSecondary" />}
        trend="down"
        trendValue="8%"
        progressValue={45}
        progressColor="bg-cyberSecondary"
      />
    </div>
  );
}
