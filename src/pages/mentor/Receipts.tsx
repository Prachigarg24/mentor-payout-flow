
import MentorLayout from "@/components/layouts/MentorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MentorReceipts = () => {
  const { user } = useAuth();
  
  // Filter mentor's receipts
  const mentorReceipts = mockData.receipts.filter(
    (receipt) => receipt.mentorId === user?.id || receipt.mentorId === "mentor-1"
  );
  
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
  
  return (
    <MentorLayout title="My Receipts">
      <Card>
        <CardHeader>
          <CardTitle>Payment Receipts</CardTitle>
          <CardDescription>
            View and download your payment receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mentorReceipts.length === 0 ? (
              <p className="text-center text-muted-foreground">No receipts found</p>
            ) : (
              mentorReceipts.map((receipt) => (
                <Card key={receipt.id} className="overflow-hidden">
                  <div className="border-b p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Receipt #{receipt.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Generated on {formatDate(receipt.dateGenerated)}
                        </p>
                        <p className="text-sm">
                          Period: {formatDate(receipt.dateRange.start)} - {formatDate(receipt.dateRange.end)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="mb-2">{getStatusBadge(receipt.status)}</div>
                        <p className="text-2xl font-bold">{formatCurrency(receipt.breakdown.finalAmount)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-2">Payout Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Base Amount</span>
                          <span>{formatCurrency(receipt.breakdown.baseAmount)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Platform Fee ({receipt.breakdown.platformFeePercentage}%)</span>
                          <span>- {formatCurrency(receipt.breakdown.platformFee)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Tax ({receipt.breakdown.taxPercentage}%)</span>
                          <span>- {formatCurrency(receipt.breakdown.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Final Payout</span>
                          <span>{formatCurrency(receipt.breakdown.finalAmount)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-2">Sessions Included ({receipt.sessions.length})</h4>
                      <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                        {receipt.sessions.map((session) => (
                          <div key={session.id} className="flex justify-between py-1 text-sm">
                            <span>{formatDate(session.date)} ({session.duration} mins)</span>
                            <span>{formatCurrency((session.hourlyRate / 60) * session.duration)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {receipt.notes && (
                      <div className="mb-6 p-3 bg-muted rounded-md text-sm">
                        <h4 className="font-medium mb-1">Notes</h4>
                        <p>{receipt.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Receipt
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Query this Receipt
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
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
