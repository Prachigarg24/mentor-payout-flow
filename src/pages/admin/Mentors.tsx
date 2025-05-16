
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData } from "@/lib/mock-data";
import MentorsList from "@/components/mentors/MentorsList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const AdminMentors = () => {
  return (
    <AdminLayout title="Mentors">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Mentors</CardTitle>
            <CardDescription>
              Manage mentor information and rates
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Mentor
          </Button>
        </CardHeader>
        <CardContent>
          <MentorsList mentors={mockData.mentors} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminMentors;
