"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Link as LinkIcon, Mail, MapPin, Phone, User as UserIcon } from "lucide-react" // Renamed User to UserIcon
import { useState, useEffect } from "react"
// import { user } from '../../../config' // Removed mock user import
import { useAuth } from "@/hooks/use-auth" // Import useAuth
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileContent() {
  const { user, loading } = useAuth() // Get user and loading state

  // Initialize formData state - needs to wait for user data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
  })

  // Effect to update formData when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        // --- TODO: Add these fields to your User model/session if needed --- 
        bio: "", // user.bio || "", 
        location: "", // user.location || "",
        phone: "", // user.phone || "",
        website: "", // user.website || "",
        // --- End TODO --- 
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // --- TODO: Implement profile update logic --- 
  const handleSaveChanges = async () => {
      console.log("Saving profile data:", formData)
      // Example API call:
      // try {
      //   await api.patch(`/users/${user?.id}`, formData); 
      //   // Show success toast
      // } catch (error) {
      //   // Show error toast
      // }
  }
  // --- End TODO ---

  if (loading) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-3 w-40" />
                    </div>
                </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="grid gap-2">
                                <Skeleton className="h-4 w-20 mb-1" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </div>
                     <div className="flex justify-end space-x-2 mt-4">
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }
  
  if (!user) {
      return <p>Please log in to view your profile.</p>; // Or redirect
  }

  const userName = user.name || "User";
  const userAvatar = user.image;
  const userInitials = userName
    ? userName
        .split(" ")
        .map((n: string) => n[0]) // Added type annotation for n
        .join("")
        .toUpperCase()
    : "U";


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Update your profile picture and personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userAvatar ?? undefined} alt={userName} />
              <AvatarFallback>
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Camera className="mr-2 h-4 w-4" />
                Change Picture
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, GIF or PNG. Max size of 800K
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                <UserIcon className="mr-2 h-4 w-4 inline" /> {/* Use UserIcon */}
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">
                <Mail className="mr-2 h-4 w-4 inline" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                type="email"
                disabled // Email might not be editable
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a short bio about yourself"
              />
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="location">
                <MapPin className="mr-2 h-4 w-4 inline" />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">
                <Phone className="mr-2 h-4 w-4 inline" />
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                type="tel"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="website">
                <LinkIcon className="mr-2 h-4 w-4 inline" />
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter your website URL"
                type="url"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button> {/* Add onClick handler */} 
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
