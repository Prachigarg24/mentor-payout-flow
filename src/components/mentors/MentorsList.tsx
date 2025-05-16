
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface MentorsListProps {
  mentors: User[];
}

const MentorsList: React.FC<MentorsListProps> = ({ mentors }) => {
  const [filter, setFilter] = useState("");

  // Filter mentors based on search input
  const filteredMentors = mentors.filter((mentor) => {
    const searchTerm = filter.toLowerCase();
    return (
      mentor.name.toLowerCase().includes(searchTerm) ||
      mentor.email.toLowerCase().includes(searchTerm) ||
      (mentor.taxInfo?.pan && mentor.taxInfo.pan.toLowerCase().includes(searchTerm))
    );
  });

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
                      <Button variant="outline" size="sm">
                        View Sessions
                      </Button>
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MentorsList;
