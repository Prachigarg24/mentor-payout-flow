
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockData } from "@/lib/mock-data";
import SessionTable from "@/components/sessions/SessionTable";
import { getDateRange, isWithinDateRange } from "@/lib/utils";

const AdminSessions = () => {
  const [dateFilter, setDateFilter] = useState("30");
  
  // Filter sessions based on selected date range
  const filteredSessions = mockData.sessions.filter((session) => {
    const { start, end } = getDateRange(parseInt(dateFilter));
    return isWithinDateRange(session.date, start, end);
  });
  
  return (
    <AdminLayout title="Sessions">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Sessions</CardTitle>
            <CardDescription>
              Manage and review all mentor sessions
            </CardDescription>
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="15">Last 15 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <SessionTable sessions={filteredSessions} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminSessions;
