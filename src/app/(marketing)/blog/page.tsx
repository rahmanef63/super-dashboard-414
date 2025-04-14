import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function BlogPage() {
  // Sample blog posts
  const blogPosts = [
    {
      id: 1,
      title: "10 Digital Marketing Trends to Watch in 2025",
      excerpt: "Stay ahead of the curve with these emerging trends that will shape the future of digital marketing.",
      author: "Sarah Johnson",
      date: "March 15, 2025",
      image: "/placeholder.svg?height=200&width=400",
      categories: ["Digital Marketing", "Trends"],
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "How to Create a Content Strategy That Converts",
      excerpt: "Learn the key elements of a successful content strategy that drives engagement and conversions.",
      author: "Michael Chen",
      date: "March 10, 2025",
      image: "/placeholder.svg?height=200&width=400",
      categories: ["Content Marketing", "Strategy"],
      readTime: "7 min read",
    },
    {
      id: 3,
      title: "The Psychology of Color in Marketing",
      excerpt: "Discover how color choices can influence consumer behavior and brand perception.",
      author: "Jessica Williams",
      date: "March 5, 2025",
      image: "/placeholder.svg?height=200&width=400",
      categories: ["Branding", "Psychology"],
      readTime: "6 min read",
    },
    {
      id: 4,
      title: "Social Media Algorithms: What You Need to Know",
      excerpt: "Understanding how social media algorithms work can help you optimize your content strategy.",
      author: "David Rodriguez",
      date: "February 28, 2025",
      image: "/placeholder.svg?height=200&width=400",
      categories: ["Social Media", "Strategy"],
      readTime: "8 min read",
    },
    {
      id: 5,
      title: "Email Marketing Best Practices for 2025",
      excerpt: "Maximize your email marketing ROI with these proven strategies and tactics.",
      author: "Emily Thompson",
      date: "February 20, 2025",
      image: "/placeholder.svg?height=200&width=400",
      categories: ["Email Marketing", "Best Practices"],
      readTime: "5 min read",
    },
    {
      id: 6,
      title: "The Rise of Voice Search: Optimizing Your Content",
      excerpt: "As voice search continues to grow, learn how to adapt your SEO strategy for this new paradigm.",
      author: "Alex Johnson",
      date: "February 15, 2025",
      image: "/placeholder.svg?height=200&width=400",
      categories: ["SEO", "Voice Search"],
      readTime: "6 min read",
    },
  ]

  // Get unique categories
  const categories = Array.from(new Set(blogPosts.flatMap((post) => post.categories)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog</h2>
          <p className="text-muted-foreground">Insights, tips, and trends from our marketing experts.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search articles..." className="w-full min-w-[200px] pl-8 md:w-[300px]" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
          All
        </Badge>
        {categories.map((category) => (
          <Badge key={category} variant="outline" className="cursor-pointer hover:bg-secondary">
            {category}
          </Badge>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card key={post.id} className="flex flex-col">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2">
                {post.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
                <span className="text-xs text-muted-foreground ml-auto">{post.readTime}</span>
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription>
                {post.date} • {post.author}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Read More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline" className="mx-2">
          Previous
        </Button>
        <Button variant="outline" className="mx-2">
          1
        </Button>
        <Button variant="default" className="mx-2">
          2
        </Button>
        <Button variant="outline" className="mx-2">
          3
        </Button>
        <Button variant="outline" className="mx-2">
          Next
        </Button>
      </div>
    </div>
  )
}
