import type { Metadata } from "next"
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/sections/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Datos de ejemplo para las entradas de blog
const blogPosts = [
  {
    id: 1,
    title: "Cómo mejorar tu técnica de pase en el fútbol",
    excerpt: "Descubre los mejores ejercicios y consejos para perfeccionar tus pases y mejorar tu juego en equipo.",
    date: "15 de marzo de 2025",
    author: "Carlos Rodríguez",
    category: "Técnicas",
    image: "/placeholder.svg?height=200&width=400",
    slug: "como-mejorar-tu-tecnica-de-pase",
  },
  {
    id: 2,
    title: "Los 5 mejores ejercicios de calentamiento antes de un partido",
    excerpt: "Prepara tu cuerpo adecuadamente para evitar lesiones y maximizar tu rendimiento en la cancha.",
    date: "10 de marzo de 2025",
    author: "Laura Martínez",
    category: "Entrenamiento",
    image: "/placeholder.svg?height=200&width=400",
    slug: "mejores-ejercicios-calentamiento",
  },
  {
    id: 3,
    title: "Nutrición para futbolistas: qué comer antes y después de jugar",
    excerpt: "Una guía completa sobre la alimentación ideal para optimizar tu rendimiento y recuperación.",
    date: "5 de marzo de 2025",
    author: "Miguel Sánchez",
    category: "Nutrición",
    image: "/placeholder.svg?height=200&width=400",
    slug: "nutricion-para-futbolistas",
  },
  {
    id: 4,
    title: "Cómo organizar un torneo de fútbol exitoso",
    excerpt: "Consejos prácticos para planificar y ejecutar un torneo que todos los participantes disfrutarán.",
    date: "28 de febrero de 2025",
    author: "Ana López",
    category: "Organización",
    image: "/placeholder.svg?height=200&width=400",
    slug: "como-organizar-torneo-futbol",
  },
  {
    id: 5,
    title: "Las mejores canchas de fútbol en Santiago",
    excerpt: "Descubre los recintos deportivos mejor valorados por la comunidad de Join Fútbol en la capital.",
    date: "20 de febrero de 2025",
    author: "Pedro Gómez",
    category: "Recintos",
    image: "/placeholder.svg?height=200&width=400",
    slug: "mejores-canchas-santiago",
  },
  {
    id: 6,
    title: "Estrategias tácticas para equipos de 7 jugadores",
    excerpt: "Formaciones y tácticas efectivas para sacar el máximo provecho a tu equipo en partidos de fútbol 7.",
    date: "15 de febrero de 2025",
    author: "Carlos Rodríguez",
    category: "Tácticas",
    image: "/placeholder.svg?height=200&width=400",
    slug: "estrategias-tacticas-futbol-7",
  },
]

// Metadatos para SEO
export const metadata: Metadata = {
  title: "Blog de Fútbol | Consejos, Estrategias y Noticias | Join Fútbol",
  description:
    "Descubre consejos de entrenamiento, estrategias tácticas, nutrición para futbolistas y más en el blog de Join Fútbol. Mejora tu juego con nuestros artículos especializados.",
  keywords:
    "blog de fútbol, consejos de fútbol, entrenamiento fútbol, tácticas fútbol, nutrición deportiva, canchas de fútbol",
  alternates: {
    canonical: "https://joinfutbol.com/blog",
  },
  openGraph: {
    title: "Blog de Fútbol | Consejos, Estrategias y Noticias | Join Fútbol",
    description:
      "Descubre consejos de entrenamiento, estrategias tácticas, nutrición para futbolistas y más en el blog de Join Fútbol. Mejora tu juego con nuestros artículos especializados.",
    url: "https://joinfutbol.com/blog",
    siteName: "Join Fútbol",
    images: [
      {
        url: "https://joinfutbol.com/images/blog-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Blog de Join Fútbol",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog de Fútbol | Join Fútbol",
    description: "Consejos, estrategias y noticias para mejorar tu experiencia futbolística",
    images: ["https://joinfutbol.com/images/blog-twitter-image.jpg"],
  },
}

export default function BlogPage() {
  // Datos estructurados para SEO (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog de Join Fútbol",
    description: "Consejos, estrategias y noticias para mejorar tu experiencia futbolística",
    url: "https://joinfutbol.com/blog",
    publisher: {
      "@type": "Organization",
      name: "Join Fútbol",
      logo: {
        "@type": "ImageObject",
        url: "https://joinfutbol.com/logo.png",
      },
    },
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: {
        "@type": "Person",
        name: post.author,
      },
      url: `https://joinfutbol.com/blog/${post.slug}`,
    })),
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* JSON-LD script para datos estructurados */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section className="bg-secondary text-white py-16">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-6">Blog de Join Fútbol</h1>
            <p className="text-xl text-gray-200 max-w-[700px]">
              Consejos, estrategias y noticias para mejorar tu experiencia futbolística
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={post.id <= 3} // Priorizar la carga de las primeras imágenes
                    />
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {post.category}
                      </span>
                    </div>
                    <CardTitle className="text-xl">
                      <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow">
                    <CardDescription className="mb-4">{post.excerpt}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center border-t">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <time dateTime={post.date}>{post.date}</time>
                    </div>
                  </CardFooter>
                  <CardFooter className="p-4 pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/blog/${post.slug}`}>Leer más</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
