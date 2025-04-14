import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Linkedin, Twitter } from "lucide-react"

export default function TeamPage() {
  // Sample team members data
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "With over 15 years of experience in marketing and business strategy, Sarah leads our company with vision and passion.",
      avatar: "/placeholder.svg?height=300&width=300",
      email: "sarah@marketingdashboard.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      department: "Leadership",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Chief Marketing Officer",
      bio: "Former head of marketing at Fortune 500 companies with expertise in digital transformation and brand strategy.",
      avatar: "/placeholder.svg?height=300&width=300",
      email: "michael@marketingdashboard.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      department: "Leadership",
    },
    {
      id: 3,
      name: "Jessica Williams",
      role: "Creative Director",
      bio: "Award-winning designer with a passion for creating memorable brand experiences and visual storytelling.",
      avatar: "/placeholder.svg?height=300&width=300",
      email: "jessica@marketingdashboard.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      department: "Creative",
    },
    {
      id: 4,
      name: "David Rodriguez",
      role: "Head of Content",
      bio: "Experienced content strategist who specializes in creating engaging narratives that drive audience engagement.",
      avatar: "/placeholder.svg?height=300&width=300",
      email: "david@marketingdashboard.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      department: "Content",
    },
    {
      id: 5,
      name: "Emily Thompson",
      role: "Digital Marketing Manager",
      bio: "Digital marketing expert with a focus on performance marketing, SEO, and data-driven strategies.",
      avatar: "/placeholder.svg?height=300&width=300",
      email: "emily@marketingdashboard.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      department: "Marketing",
    },
    {
      id: 6,
      name: "Alex Johnson",
      role: "SEO Specialist",
      bio: "Search engine optimization expert who helps clients improve their online visibility and organic traffic.",
      avatar: "/placeholder.svg?height=300&width=300",
      email: "alex@marketingdashboard.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      department: "Marketing",
    },
    {
      id: 7,
      name: "Olivia Martinez",
      role: "Social Media Manager",
      bio: "Social media strategist who excels at building brand presence and community engagement across platforms.",
      avatar: "/placeholder.svg?height=300&width=300",
      email: "olivia@marketingdashboard.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      department: "Marketing",
    },
    {
      id: 8,
      name: "James Wilson",
      role: "UX/UI Designer",
      bio: "User experience designer focused on creating intuitive, accessible, and visually appealing digital interfaces.",
      avatar: "/placeholder.svg?height=300&width=300",
      email: "james@marketingdashboard.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      department: "Creative",
    },
  ]

  // Get unique departments
  const departments = Array.from(new Set(teamMembers.map((member) => member.department)))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Our Team</h2>
        <p className="text-muted-foreground">Meet the talented individuals who make our company great.</p>
      </div>

      {departments.map((department) => (
        <div key={department} className="space-y-4">
          <h3 className="text-xl font-semibold">{department} Team</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamMembers
              .filter((member) => member.department === department)
              .map((member) => (
                <Card key={member.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{member.bio}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Join Our Team</CardTitle>
          <CardDescription>We're always looking for talented individuals to join our growing team.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            If you're passionate about marketing, creativity, and innovation, we'd love to hear from you. Check out our
            current openings or send us your resume for future opportunities.
          </p>
        </CardContent>
        <CardFooter>
          <Button>View Open Positions</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
