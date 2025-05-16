
import { useState } from "react";
import MentorLayout from "@/components/layouts/MentorLayout";
import { mockData } from "@/lib/mock-data";
import { User } from "@/lib/types";
import ChatInterface from "@/components/messages/ChatInterface";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const MentorMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(mockData.messages);
  
  // Create admin user object
  const adminUser: User = {
    id: "admin-1",
    name: "Admin Support",
    email: "admin@example.com",
    role: "admin"
  };
  
  const handleSendMessage = (content: string) => {
    if (user) {
      const newMessage = {
        id: uuidv4(),
        senderId: user.id,
        senderName: user.name,
        receiverId: adminUser.id,
        receiverName: adminUser.name,
        content,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    }
  };
  
  return (
    <MentorLayout title="Messages">
      <div className="h-[calc(100vh-10rem)] overflow-hidden rounded-lg border">
        <ChatInterface
          messages={messages}
          selectedUser={adminUser}
          onSendMessage={handleSendMessage}
        />
      </div>
    </MentorLayout>
  );
};

export default MentorMessages;
