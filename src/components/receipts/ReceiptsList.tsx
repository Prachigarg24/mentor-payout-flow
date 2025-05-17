
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  AlertCircle,
  BadgeCheck, 
  Clock 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReceiptsListProps {
  receipts: Receipt[];
  showMentor?: boolean;
}

const ReceiptsList: React.FC<ReceiptsListProps> = ({ receipts, showMentor = true }) => {
  const [filter, setFilter] = useState("");
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-pistachio-500 hover:bg-pistachio-600 flex items-center gap-1 px-2">
            <BadgeCheck className="h-3 w-3" /> Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1 px-2">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "disputed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1 px-2">
            <AlertCircle className="h-3 w-3" /> Disputed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewReceipt = (receipt: Receipt) => {
    toast({
      title: "Viewing Receipt",
      description: `Viewing receipt for ${receipt.mentorName}`,
    });
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
        <Search className="h-4 w-4 text-lavender-600" />
        <Input
          placeholder="Search receipts..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm border-lavender-200 focus-visible:ring-lavender-500"
        />
      </div>
      
      <div className="rounded-md border border-pistachio-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-lavender-50">
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
                <TableRow key={receipt.id} className="hover:bg-lavender-50/50 transition-colors">
                  <TableCell className="font-mono text-xs">{receipt.id.substring(0, 8)}...</TableCell>
                  {showMentor && <TableCell className="font-medium text-lavender-700">{receipt.mentorName}</TableCell>}
                  <TableCell>{formatDate(receipt.dateGenerated)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatDate(receipt.dateRange.start)}</span>
                      <span className="text-muted-foreground text-xs">to</span>
                      <span>{formatDate(receipt.dateRange.end)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    <span className="bg-pistachio-100 text-pistachio-800 px-2 py-1 rounded-full text-xs">
                      {receipt.sessions.length}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-lavender-700">
                    {formatCurrency(receipt.breakdown.finalAmount)}
                  </TableCell>
                  <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewReceipt(receipt)}
                        className="hover:bg-lavender-100 border-lavender-200 text-lavender-700"
                      >
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
