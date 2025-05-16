
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search } from "lucide-react";
import { useState } from "react";

interface ReceiptsListProps {
  receipts: Receipt[];
  showMentor?: boolean;
}

const ReceiptsList: React.FC<ReceiptsListProps> = ({ receipts, showMentor = true }) => {
  const [filter, setFilter] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "disputed":
        return <Badge variant="destructive">Disputed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Filter receipts based on search input
  const filteredReceipts = receipts.filter((receipt) => {
    const searchTerm = filter.toLowerCase();
    return (
      receipt.mentorName.toLowerCase().includes(searchTerm) ||
      receipt.id.toLowerCase().includes(searchTerm) ||
      receipt.status.toLowerCase().includes(searchTerm) ||
      formatDate(receipt.dateGenerated).toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search receipts..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt ID</TableHead>
              {showMentor && <TableHead>Mentor</TableHead>}
              <TableHead>Date Generated</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReceipts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showMentor ? 8 : 7} className="text-center text-muted-foreground h-24">
                  No receipts found
                </TableCell>
              </TableRow>
            ) : (
              filteredReceipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-mono text-xs">{receipt.id}</TableCell>
                  {showMentor && <TableCell>{receipt.mentorName}</TableCell>}
                  <TableCell>{formatDate(receipt.dateGenerated)}</TableCell>
                  <TableCell>
                    {formatDate(receipt.dateRange.start)} - {formatDate(receipt.dateRange.end)}
                  </TableCell>
                  <TableCell>{receipt.sessions.length}</TableCell>
                  <TableCell>{formatCurrency(receipt.breakdown.finalAmount)}</TableCell>
                  <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" /> View
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

export default ReceiptsList;
