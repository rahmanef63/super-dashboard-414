import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GalleryPage() {
  // Sample gallery categories and images
  const categories = ["All", "Events", "Office", "Team", "Projects", "Behind the Scenes"]

  const images = [
    { id: 1, src: "/placeholder.svg?height=300&width=400", alt: "Team brainstorming session", category: "Team" },
    { id: 2, src: "/placeholder.svg?height=300&width=400", alt: "Office space", category: "Office" },
    { id: 3, src: "/placeholder.svg?height=300&width=400", alt: "Marketing conference", category: "Events" },
    { id: 4, src: "/placeholder.svg?height=300&width=400", alt: "Product photoshoot", category: "Projects" },
    { id: 5, src: "/placeholder.svg?height=300&width=400", alt: "Team building activity", category: "Team" },
    { id: 6, src: "/placeholder.svg?height=300&width=400", alt: "Client meeting", category: "Projects" },
    { id: 7, src: "/placeholder.svg?height=300&width=400", alt: "Office kitchen", category: "Office" },
    { id: 8, src: "/placeholder.svg?height=300&width=400", alt: "Annual party", category: "Events" },
    { id: 9, src: "/placeholder.svg?height=300&width=400", alt: "Design team at work", category: "Behind the Scenes" },
    { id: 10, src: "/placeholder.svg?height=300&width=400", alt: "Company retreat", category: "Team" },
    { id: 11, src: "/placeholder.svg?height=300&width=400", alt: "Product launch event", category: "Events" },
    { id: 12, src: "/placeholder.svg?height=300&width=400", alt: "Office lounge", category: "Office" },
    { id: 13, src: "/placeholder.svg?height=300&width=400", alt: "Content creation", category: "Behind the Scenes" },
    { id: 14, src: "/placeholder.svg?height=300&width=400", alt: "Client presentation", category: "Projects" },
    { id: 15, src: "/placeholder.svg?height=300&width=400", alt: "Team lunch", category: "Team" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gallery</h2>
        <p className="text-muted-foreground">A visual showcase of our work, team, and events.</p>
      </div>

      <Tabs defaultValue="All" className="space-y-4">
        <TabsList className="flex flex-wrap">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {images
                .filter((image) => category === "All" || image.category === category)
                .map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square relative group cursor-pointer">
                        <img
                          src={image.src || "/placeholder.svg"}
                          alt={image.alt}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <p className="text-white text-center p-4">{image.alt}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
