
import MentorLayout from "@/components/layouts/MentorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Eye, 
  MessageSquare,
  BadgeCheck,
  Clock,
  AlertCircle,
  FileText
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MentorReceipts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expandedReceiptId, setExpandedReceiptId] = useState<string | null>(null);
  
  // Filter mentor's receipts
  const mentorReceipts = mockData.receipts.filter(
    (receipt) => receipt.mentorId === user?.id || receipt.mentorId === "mentor-1"
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
            <BadgeCheck className="h-3 w-3" /> Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "disputed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Disputed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleToggleReceipt = (receiptId: string) => {
    if (expandedReceiptId === receiptId) {
      setExpandedReceiptId(null);
    } else {
      setExpandedReceiptId(receiptId);
    }
  };

  const handleDownload = (receiptId: string) => {
    toast({
      title: "Download Started",
      description: "Your receipt PDF is being generated and will download shortly.",
    });
  };

  const handleQueryReceipt = (receiptId: string) => {
    toast({
      title: "Message Initiated",
      description: "Starting a conversation about this receipt with the admin.",
    });
  };
  
  return (
    <MentorLayout title="My Receipts">
      <Card className="shadow-md border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-primary">Payment Receipts</CardTitle>
          <CardDescription>
            View and download your payment receipts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {mentorReceipts.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 bg-muted/20 rounded-lg">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium">No receipts found</p>
                <p className="text-sm">When you receive payments, your receipts will appear here.</p>
              </div>
            ) : (
              mentorReceipts.map((receipt) => (
                <Card key={receipt.id} className="overflow-hidden transition-all duration-200 hover:shadow-md border-primary/10">
                  <div className={`border-b p-6 bg-gradient-to-r from-primary/5 to-transparent cursor-pointer`}
                    onClick={() => handleToggleReceipt(receipt.id)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-1 text-primary">Receipt #{receipt.id.substring(0, 8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          Generated on {formatDate(receipt.dateGenerated)}
                        </p>
                        <p className="text-sm">
                          Period: {formatDate(receipt.dateRange.start)} - {formatDate(receipt.dateRange.end)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="mb-2">{getStatusBadge(receipt.status)}</div>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(receipt.breakdown.finalAmount)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {expandedReceiptId === receipt.id && (
                    <div className="p-6 bg-gradient-to-b from-primary/5 to-transparent animate-fade-in">
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2 text-primary">Payout Breakdown</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between p-2 bg-background rounded-md">
                            <span>Base Amount</span>
                            <span className="font-medium">{formatCurrency(receipt.breakdown.baseAmount)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground p-2 bg-muted/20 rounded-md">
                            <span>Platform Fee ({receipt.breakdown.platformFeePercentage}%)</span>
                            <span>- {formatCurrency(receipt.breakdown.platformFee)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground p-2 bg-muted/20 rounded-md">
                            <span>Tax ({receipt.breakdown.taxPercentage}%)</span>
                            <span>- {formatCurrency(receipt.breakdown.taxAmount)}</span>
                          </div>
                          <div className="flex justify-between font-medium pt-2 border-t mt-2 text-primary p-2">
                            <span>Final Payout</span>
                            <span>{formatCurrency(receipt.breakdown.finalAmount)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2 text-primary">Sessions Included ({receipt.sessions.length})</h4>
                        <div className="max-h-40 overflow-y-auto border rounded-md p-2 bg-background shadow-inner">
                          {receipt.sessions.map((session) => (
                            <div key={session.id} className="flex justify-between py-2 text-sm border-b last:border-0">
                              <span className="font-medium">{formatDate(session.date)} ({session.duration} mins)</span>
                              <span className="text-primary">{formatCurrency((session.hourlyRate / 60) * session.duration)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {receipt.notes && (
                        <div className="mb-6 p-3 bg-muted/20 rounded-md text-sm">
                          <h4 className="font-medium mb-1 text-primary">Notes</h4>
                          <p>{receipt.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-primary/10">
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Receipt
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleQueryReceipt(receipt.id)} className="hover:bg-primary/10">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Query this Receipt
                        </Button>
                        <Button size="sm" onClick={() => handleDownload(receipt.id)} className="bg-primary hover:bg-primary/90">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </MentorLayout>
  );
};

export default MentorReceipts;
