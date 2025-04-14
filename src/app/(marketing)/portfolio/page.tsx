import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PortfolioPage() {
  // Sample portfolio projects
  const projects = [
    {
      id: 1,
      title: "E-commerce Rebrand",
      client: "FashionForward",
      description: "Complete rebrand and digital marketing strategy for a fashion e-commerce platform.",
      image: "/placeholder.svg?height=200&width=400",
      categories: ["Branding", "Digital Marketing", "Web Design"],
      year: 2023,
    },
    {
      id: 2,
      title: "Social Media Campaign",
      client: "EcoFriendly",
      description: "Award-winning social media campaign highlighting sustainable practices.",
      image: "/placeholder.svg?height=200&width=400",
      categories: ["Social Media", "Content Creation", "Strategy"],
      year: 2023,
    },
    {
      id: 3,
      title: "Product Launch",
      client: "TechInnovate",
      description: "Comprehensive marketing strategy for a new tech product launch.",
      image: "/placeholder.svg?height=200&width=400",
      categories: ["Product Marketing", "PR", "Event Planning"],
      year: 2022,
    },
    {
      id: 4,
      title: "Brand Identity",
      client: "UrbanCafe",
      description: "Complete brand identity design for a chain of urban coffee shops.",
      image: "/placeholder.svg?height=200&width=400",
      categories: ["Branding", "Graphic Design", "Packaging"],
      year: 2022,
    },
    {
      id: 5,
      title: "Content Marketing",
      client: "HealthPlus",
      description: "Content marketing strategy that increased organic traffic by 200%.",
      image: "/placeholder.svg?height=200&width=400",
      categories: ["Content Marketing", "SEO", "Copywriting"],
      year: 2021,
    },
    {
      id: 6,
      title: "Website Redesign",
      client: "FinancePro",
      description: "Complete website redesign with focus on user experience and conversion optimization.",
      image: "/placeholder.svg?height=200&width=400",
      categories: ["Web Design", "UX/UI", "Development"],
      year: 2021,
    },
  ]

  // Get unique categories for filtering
  const categories = Array.from(new Set(projects.flatMap((project) => project.categories)))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Portfolio</h2>
        <p className="text-muted-foreground">
          Explore our work and see how we've helped our clients achieve their marketing goals.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((project) => project.categories.includes(category))
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{project.title}</CardTitle>
          <Badge variant="outline">{project.year}</Badge>
        </div>
        <CardDescription>{project.client}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View Case Study
        </Button>
      </CardFooter>
    </Card>
  )
}
