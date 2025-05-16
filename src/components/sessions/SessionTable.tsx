
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Session, SessionType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SessionDetailsModal from "./SessionDetailsModal";

interface SessionTableProps {
  sessions: Session[];
  showMentor?: boolean;
}

const SessionTable: React.FC<SessionTableProps> = ({ sessions, showMentor = true }) => {
  const [filter, setFilter] = useState("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const getSessionTypeLabel = (type: SessionType) => {
    switch (type) {
      case "live":
        return "Live Session";
      case "evaluation":
        return "Evaluation";
      case "review":
        return "Recording Review";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const calculateSessionAmount = (session: Session) => {
    return (session.hourlyRate / 60) * session.duration;
  };

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Filter sessions based on search input
  const filteredSessions = sessions.filter((session) => {
    const searchTerm = filter.toLowerCase();
    return (
      session.mentorName.toLowerCase().includes(searchTerm) ||
      session.type.toLowerCase().includes(searchTerm) ||
      session.status.toLowerCase().includes(searchTerm) ||
      formatDate(session.date).toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sessions..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {showMentor && <TableHead>Mentor</TableHead>}
              <TableHead>Type</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showMentor ? 9 : 8} className="text-center text-muted-foreground h-24">
                  No sessions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{formatDate(session.date)}</TableCell>
                  {showMentor && <TableCell>{session.mentorName}</TableCell>}
                  <TableCell>{getSessionTypeLabel(session.type)}</TableCell>
                  <TableCell>
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </TableCell>
                  <TableCell>{session.duration} mins</TableCell>
                  <TableCell>{formatCurrency(session.hourlyRate)}/hr</TableCell>
                  <TableCell>{formatCurrency(calculateSessionAmount(session))}</TableCell>
                  <TableCell>{getStatusBadge(session.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(session)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <SessionDetailsModal 
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default SessionTable;
