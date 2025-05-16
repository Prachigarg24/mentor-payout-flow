
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface UsersListProps {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (user: User) => void;
  unreadCounts: Record<string, number>;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  selectedUserId,
  onSelectUser,
  unreadCounts,
}) => {
  const [filter, setFilter] = useState("");

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-3 border-b">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-8"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No users found
          </div>
        ) : (
          <ul>
            {filteredUsers.map((user) => (
              <li key={user.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-4 py-3 h-auto ${
                    selectedUserId === user.id ? "bg-muted" : ""
                  }`}
                  onClick={() => onSelectUser(user)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{user.name}</span>
                    {unreadCounts[user.id] > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCounts[user.id]}
                      </span>
                    )}
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UsersList;
