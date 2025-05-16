
import AdminLayout from "@/components/layouts/AdminLayout";
import StatsCard from "@/components/stats/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { CalendarDays, DollarSign, Users } from "lucide-react";
import SessionTable from "@/components/sessions/SessionTable";
import ReceiptsList from "@/components/receipts/ReceiptsList";

const AdminDashboard = () => {
  // Filter completed sessions
  const completedSessions = mockData.sessions.filter(
    (session) => session.status === "completed"
  );
  
  // Calculate total payout amount
  const totalPayout = mockData.receipts.reduce(
    (total, receipt) => total + receipt.breakdown.finalAmount,
    0
  );
  
  // Recent items
  const recentSessions = mockData.sessions.slice(0, 5);
  const recentReceipts = mockData.receipts.slice(0, 5);
  
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Sessions"
            value={completedSessions.length}
            description="Completed sessions"
            icon={<CalendarDays className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Mentors"
            value={mockData.mentors.length}
            description="Active mentors"
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Payouts"
            value={formatCurrency(totalPayout)}
            description="All time"
            icon={<DollarSign className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
          />
        </div>
        
        <Tabs defaultValue="recent-sessions">
          <TabsList>
            <TabsTrigger value="recent-sessions">Recent Sessions</TabsTrigger>
            <TabsTrigger value="recent-payouts">Recent Payouts</TabsTrigger>
          </TabsList>
          <TabsContent value="recent-sessions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>
                  The most recent sessions across all mentors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SessionTable sessions={recentSessions} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recent-payouts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payouts</CardTitle>
                <CardDescription>
                  The most recently generated receipts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReceiptsList receipts={recentReceipts} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
