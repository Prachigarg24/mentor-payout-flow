
import { useState } from "react";
import MentorLayout from "@/components/layouts/MentorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockData } from "@/lib/mock-data";
import SessionTable from "@/components/sessions/SessionTable";
import { getDateRange, isWithinDateRange } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const MentorSessions = () => {
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
  
  return (
    <MentorLayout title="My Sessions">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Session History</CardTitle>
            <CardDescription>
              View all your teaching sessions
            </CardDescription>
          </div>
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
        </CardHeader>
        <CardContent>
          <SessionTable sessions={filteredSessions} showMentor={false} />
        </CardContent>
      </Card>
    </MentorLayout>
  );
};

export default MentorSessions;
