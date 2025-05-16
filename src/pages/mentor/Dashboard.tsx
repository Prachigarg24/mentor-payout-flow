
import { useState } from "react";
import MentorLayout from "@/components/layouts/MentorLayout";
import StatsCard from "@/components/stats/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockData } from "@/lib/mock-data";
import { formatCurrency, getDateRange, isWithinDateRange } from "@/lib/utils";
import { CalendarDays, Clock, DollarSign } from "lucide-react";
import SessionTable from "@/components/sessions/SessionTable";
import { useAuth } from "@/context/AuthContext";

const MentorDashboard = () => {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState("30");
  
  // Filter mentor's sessions
  const mentorSessions = mockData.sessions.filter(
    (session) => session.mentorId === user?.id || session.mentorId === "mentor-1"
  );
  
  // Filter by date
  const filteredSessions = mentorSessions.filter((session) => {
    const { start, end } = getDateRange(parseInt(dateFilter));
    return isWithinDateRange(session.date, start, end);
  });
  
  // Calculate completed sessions
  const completedSessions = filteredSessions.filter(
    (session) => session.status === "completed"
  );
  
  // Calculate total hours
  const totalMinutes = completedSessions.reduce(
    (total, session) => total + session.duration,
    0
  );
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  
  // Calculate earnings for the period
  const earnings = completedSessions.reduce(
    (total, session) => total + ((session.hourlyRate / 60) * session.duration),
    0
  );
  
  // Get mentor's receipts
  const mentorReceipts = mockData.receipts.filter(
    (receipt) => receipt.mentorId === user?.id || receipt.mentorId === "mentor-1"
  );
  
  return (
    <MentorLayout title="Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Overview</h2>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="15">Last 15 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Sessions"
            value={completedSessions.length}
            description={`in the last ${dateFilter} days`}
            icon={<CalendarDays className="h-4 w-4" />}
          />
          <StatsCard
            title="Hours Logged"
            value={totalHours}
            description={`in the last ${dateFilter} days`}
            icon={<Clock className="h-4 w-4" />}
          />
          <StatsCard
            title="Earnings"
            value={formatCurrency(earnings)}
            description={`in the last ${dateFilter} days`}
            icon={<DollarSign className="h-4 w-4" />}
          />
        </div>
        
        <Tabs defaultValue="recent-sessions">
          <TabsList>
            <TabsTrigger value="recent-sessions">Recent Sessions</TabsTrigger>
            <TabsTrigger value="recent-receipts">Recent Receipts</TabsTrigger>
          </TabsList>
          <TabsContent value="recent-sessions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Recent Sessions</CardTitle>
                <CardDescription>
                  Your most recent teaching sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SessionTable sessions={filteredSessions.slice(0, 5)} showMentor={false} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recent-receipts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Receipts</CardTitle>
                <CardDescription>
                  Your most recently generated payout receipts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentorReceipts.length === 0 ? (
                    <p className="text-muted-foreground">No receipts found</p>
                  ) : (
                    mentorReceipts.slice(0, 3).map((receipt) => (
                      <Card key={receipt.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{receipt.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                Generated on {new Date(receipt.dateGenerated).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(receipt.breakdown.finalAmount)}</p>
                              <p className="text-sm text-muted-foreground">
                                {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MentorLayout>
  );
};

export default MentorDashboard;
