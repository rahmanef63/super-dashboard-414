import React, { useState, useEffect } from 'react';
// Import User, UserRole, and GUEST_USER from the provider
import { useDevTools, User, UserRole, GUEST_USER } from "../dev-tools-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

export function UserSwitcher() {
  // Get availableUsers and loading state from context
  const { currentUser, setCurrentUser, availableUsers, isLoadingUsers } = useDevTools();

  // State for the selected user ID in the dropdown
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(currentUser?.id);

  // Effect to update selectedUserId when currentUser changes externally
  useEffect(() => {
    setSelectedUserId(currentUser?.id);
  }, [currentUser]);

  const handleUserChange = (userId: string) => {
    // Find the selected user from the availableUsers list
    const user = availableUsers.find(u => u.id === userId);
    // Check if the user exists and is different from the current user
    if (user && user.id !== currentUser?.id) {
      setCurrentUser(user);
      console.log(`Switched to user: ${user.email}`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(GUEST_USER);
    console.log("Logged out, set user to guest");
  };

  return (
    <div className="space-y-4">
       <Label>Switch User</Label>
       {isLoadingUsers ? (
         <Skeleton className="h-10 w-full" /> // Show skeleton while loading
       ) : (
         <Select onValueChange={handleUserChange} value={selectedUserId ?? ''}>
           <SelectTrigger>
             <SelectValue placeholder="Select a user">
               {currentUser ? (currentUser.email ?? `User ID: ${currentUser.id}`) : "Select a user"}
             </SelectValue>
           </SelectTrigger>
           <SelectContent>
             {availableUsers.map((user) => (
               <SelectItem key={user.id} value={user.id}>
                 {user.email ?? `User ID: ${user.id}`} ({user.role})
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
       )}

      {currentUser && (
        <div className="mt-4 space-y-2">
           <Label className="text-xs text-muted-foreground">Current User Details</Label>
           <Input readOnly value={`ID: ${currentUser.id}`} className="text-xs" />
           <Input readOnly value={`Email: ${currentUser.email ?? 'N/A'}`} className="text-xs" />
           <Input readOnly value={`Role: ${currentUser.role}`} className="text-xs" />
        </div>
      )}

      {/* Only show logout if not already guest */}
      {currentUser?.role !== 'guest' && (
           <Button onClick={handleLogout} variant="outline" size="sm" className="mt-2">
             Log out (Switch to Guest)
           </Button>
       )}
    </div>
  );
}
