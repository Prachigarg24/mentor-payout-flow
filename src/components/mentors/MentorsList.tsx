
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MentorDetailsModal from "./MentorDetailsModal";

interface MentorsListProps {
  mentors: User[];
  onMessage?: (mentor: User) => void;
}

const MentorsList: React.FC<MentorsListProps> = ({ mentors, onMessage }) => {
  const [filter, setFilter] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Filter mentors based on search input
  const filteredMentors = mentors.filter((mentor) => {
    const searchTerm = filter.toLowerCase();
    return (
      mentor.name.toLowerCase().includes(searchTerm) ||
      mentor.email.toLowerCase().includes(searchTerm) ||
      (mentor.taxInfo?.pan && mentor.taxInfo.pan.toLowerCase().includes(searchTerm))
    );
  });

  const handleViewDetails = (mentor: User) => {
    setSelectedMentor(mentor);
    setIsDetailsModalOpen(true);
  };

  const handleViewSessions = (mentor: User) => {
    // Navigate to sessions page with mentor filter (this would be implemented on the sessions page)
    navigate("/admin/sessions", { state: { mentorId: mentor.id } });
  };

  const handleMessage = (mentor: User) => {
    if (onMessage) {
      onMessage(mentor);
    } else {
      navigate("/admin/messages");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search mentors..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Hourly Rate</TableHead>
              <TableHead>PAN</TableHead>
              <TableHead>GST</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMentors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                  No mentors found
                </TableCell>
              </TableRow>
            ) : (
              filteredMentors.map((mentor) => (
                <TableRow key={mentor.id}>
                  <TableCell className="font-medium">{mentor.name}</TableCell>
                  <TableCell>{mentor.email}</TableCell>
                  <TableCell>{formatCurrency(mentor.hourlyRate || 0)}/hr</TableCell>
                  <TableCell>{mentor.taxInfo?.pan || "-"}</TableCell>
                  <TableCell>{mentor.taxInfo?.gst || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(mentor)}>
                        <Eye className="h-4 w-4 mr-2" /> Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewSessions(mentor)}>
                        View Sessions
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleMessage(mentor)}>
                        <MessageSquare className="h-4 w-4 mr-2" /> Message
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedMentor && (
        <MentorDetailsModal
          mentor={selectedMentor}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MentorsList;
