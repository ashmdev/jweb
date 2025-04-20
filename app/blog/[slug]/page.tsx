import type { Metadata } from "next"
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/sections/footer"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, Tag, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Datos de ejemplo para las entradas de blog
const blogPosts = [
  {
    id: 1,
    title: "Cómo mejorar tu técnica de pase en el fútbol",
    content: `
      <p>El pase es una de las habilidades fundamentales en el fútbol. Un buen pase puede crear oportunidades de gol, mantener la posesión del balón y ayudar a tu equipo a controlar el ritmo del juego.</p>
      
      <h2>Por qué es importante la técnica de pase</h2>
      
      <p>Un buen pasador puede:</p>
      <ul>
        <li>Crear oportunidades de gol para sus compañeros</li>
        <li>Mantener la posesión del balón bajo presión</li>
        <li>Cambiar rápidamente el punto de ataque</li>
        <li>Controlar el ritmo y el flujo del juego</li>
      </ul>
      
      <h2>Ejercicios para mejorar tu técnica de pase</h2>
      
      <h3>1. Pases contra la pared</h3>
      <p>Este ejercicio simple pero efectivo te ayuda a mejorar la precisión y el control. Párate frente a una pared y practica diferentes tipos de pases: con el interior del pie, con el exterior, pases rasos, pases elevados, etc.</p>
      
      <h3>2. Pases en parejas</h3>
      <p>Trabaja con un compañero a diferentes distancias. Comienza con pases cortos y ve aumentando gradualmente la distancia. Practica pases con ambos pies y diferentes partes del pie.</p>
      
      <h3>3. Rondos</h3>
      <p>Los rondos son excelentes para practicar pases bajo presión. Forma un círculo con varios jugadores y uno o dos en el medio tratando de interceptar el balón. El objetivo es mantener la posesión mediante pases rápidos y precisos.</p>
      
      <h2>Consejos para mejorar tus pases</h2>
      
      <ul>
        <li><strong>Mantén la cabeza levantada:</strong> Observa el campo antes de recibir el balón para saber dónde están tus compañeros.</li>
        <li><strong>Usa la superficie adecuada del pie:</strong> El interior del pie para pases precisos, el empeine para pases largos, el exterior para pases curvos.</li>
        <li><strong>Practica con ambos pies:</strong> Ser capaz de pasar con ambos pies te hace menos predecible y más versátil.</li>
        <li><strong>Trabaja en tu primera recepción:</strong> Un buen control te permite hacer un buen pase inmediatamente después.</li>
        <li><strong>Comunícate con tus compañeros:</strong> La comunicación verbal y no verbal mejora la efectividad de los pases.</li>
      </ul>
      
      <p>Recuerda que la práctica constante es la clave para mejorar cualquier habilidad en el fútbol. Dedica tiempo específico a trabajar en tus pases y verás mejoras significativas en tu juego general.</p>
    `,
    excerpt: "Descubre los mejores ejercicios y consejos para perfeccionar tus pases y mejorar tu juego en equipo.",
    date: "15 de marzo de 2025",
    author: "Carlos Rodríguez",
    category: "Técnicas",
    image: "/placeholder.svg?height=400&width=800",
    slug: "como-mejorar-tu-tecnica-de-pase",
  },
]

// Generador de metadatos dinámicos para SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // En una aplicación real, buscaríamos la entrada por slug en la base de datos o API
  const post = blogPosts.find((post) => post.slug === params.slug) || blogPosts[0]

  // Extraer el primer párrafo como descripción si no hay excerpt
  const firstParagraph = post.content.match(/<p>(.*?)<\/p>/)?.[1] || post.excerpt
  const description = firstParagraph.length > 160 ? firstParagraph.substring(0, 157) + "..." : firstParagraph

  return {
    title: `${post.title} | Blog de Join Fútbol`,
    description: description,
    keywords: `${post.category}, fútbol, entrenamiento, técnicas de fútbol, join fútbol, ${post.title.toLowerCase()}`,
    alternates: {
      canonical: `https://joinfutbol.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: description,
      url: `https://joinfutbol.com/blog/${post.slug}`,
      siteName: "Join Fútbol",
      images: [
        {
          url: post.image || "https://joinfutbol.com/images/blog-og-image.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "es_ES",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: [post.category, "fútbol", "deporte", "entrenamiento"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [post.image || "https://joinfutbol.com/images/blog-twitter-image.jpg"],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // En una aplicación real, buscaríamos la entrada por slug en la base de datos o API
  const post = blogPosts.find((post) => post.slug === params.slug) || blogPosts[0]

  // Formatear la fecha para el elemento time
  const formattedDate = post.date

  // Datos estructurados para SEO (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image || "https://joinfutbol.com/images/blog-og-image.jpg",
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Join Fútbol",
      logo: {
        "@type": "ImageObject",
        url: "https://joinfutbol.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://joinfutbol.com/blog/${post.slug}`,
    },
    keywords: [post.category, "fútbol", "deporte", "entrenamiento"],
    articleSection: post.category,
    inLanguage: "es-ES",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* JSON-LD script para datos estructurados */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <article className="container max-w-4xl px-4 py-12" itemScope itemType="https://schema.org/BlogPosting">
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al blog
            </Link>

            <div className="relative h-[300px] w-full mb-6 rounded-lg overflow-hidden">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
                itemProp="image"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <Tag className="mr-1 h-3 w-3" />
                <span itemProp="articleSection">{post.category}</span>
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" itemProp="headline">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center" itemProp="author" itemScope itemType="https://schema.org/Person">
                <User className="h-4 w-4 mr-1" />
                <span itemProp="name">{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <time dateTime={formattedDate} itemProp="datePublished">
                  {post.date}
                </time>
              </div>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-6 border-t">
            <div className="flex justify-between items-center">
              <Button variant="outline" asChild>
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al blog
                </Link>
              </Button>

              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
