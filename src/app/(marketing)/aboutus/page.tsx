import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AboutUsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">About Us</h2>
        <p className="text-muted-foreground">Learn more about our company, mission, and team.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Story</CardTitle>
          <CardDescription>How we started and where we're going</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Founded in 2020, our company has been at the forefront of innovative marketing solutions. We started with a
            simple mission: to help businesses connect with their customers in meaningful ways.
          </p>
          <p>
            Over the years, we've grown from a small team of passionate marketers to a full-service agency with
            expertise in digital marketing, content creation, and brand strategy.
          </p>
          <p>
            Today, we continue to push the boundaries of what's possible in marketing, leveraging the latest
            technologies and trends to deliver exceptional results for our clients.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
          <CardDescription>What drives us every day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-6">
            <p className="text-lg font-medium italic">
              "To empower businesses with innovative marketing solutions that drive growth, foster connections, and
              create lasting impact in an ever-evolving digital landscape."
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leadership Team</CardTitle>
          <CardDescription>Meet the people behind our success</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Founder",
                bio: "With over 15 years of experience in marketing and business strategy.",
                avatar: "/placeholder.svg?height=100&width=100",
              },
              {
                name: "Michael Chen",
                role: "Chief Marketing Officer",
                bio: "Former head of marketing at Fortune 500 companies with expertise in digital transformation.",
                avatar: "/placeholder.svg?height=100&width=100",
              },
              {
                name: "Jessica Williams",
                role: "Creative Director",
                bio: "Award-winning designer with a passion for creating memorable brand experiences.",
                avatar: "/placeholder.svg?height=100&width=100",
              },
            ].map((person, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={person.avatar} alt={person.name} />
                  <AvatarFallback>{person.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{person.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{person.role}</p>
                <p className="text-sm">{person.bio}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our Values</CardTitle>
          <CardDescription>The principles that guide our work</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Innovation", description: "We constantly seek new and better ways to solve problems." },
              {
                title: "Integrity",
                description: "We believe in honesty, transparency, and ethical business practices.",
              },
              { title: "Excellence", description: "We strive for the highest quality in everything we do." },
              { title: "Collaboration", description: "We work together with our clients as true partners." },
              { title: "Adaptability", description: "We embrace change and evolve with the industry." },
              { title: "Impact", description: "We measure our success by the results we deliver for our clients." },
            ].map((value, index) => (
              <div key={index} className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
