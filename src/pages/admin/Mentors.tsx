
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData } from "@/lib/mock-data";
import { User } from "@/lib/types";
import MentorsList from "@/components/mentors/MentorsList";
import AddMentorModal from "@/components/mentors/AddMentorModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminMentors = () => {
  const [mentors, setMentors] = useState(mockData.mentors);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddMentor = (newMentor: User) => {
    setMentors((prevMentors) => [newMentor, ...prevMentors]);
    toast({
      title: "Mentor Added",
      description: `${newMentor.name} has been added successfully.`,
    });
  };

  const handleMessageMentor = (mentor: User) => {
    // This would navigate to the messages page with the mentor pre-selected
    toast({
      title: "Message Initiated",
      description: `Starting conversation with ${mentor.name}.`,
    });
  };

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
          <Button onClick={handleOpenAddModal}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Mentor
          </Button>
        </CardHeader>
        <CardContent>
          <MentorsList 
            mentors={mentors} 
            onMessage={handleMessageMentor} 
          />
        </CardContent>
      </Card>

      <AddMentorModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAddMentor={handleAddMentor}
      />
    </AdminLayout>
  );
};

export default AdminMentors;
