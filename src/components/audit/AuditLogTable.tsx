
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AuditLog } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface AuditLogTableProps {
  logs: AuditLog[];
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  const [filter, setFilter] = useState("");

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter logs based on search input
  const filteredLogs = logs.filter((log) => {
    const searchTerm = filter.toLowerCase();
    return (
      log.userName.toLowerCase().includes(searchTerm) ||
      log.action.toLowerCase().includes(searchTerm) ||
      log.entityType.toLowerCase().includes(searchTerm) ||
      log.details.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search audit logs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">{formatTimestamp(log.timestamp)}</TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell className="capitalize">{log.action}</TableCell>
                  <TableCell className="capitalize">{log.entityType}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuditLogTable;
