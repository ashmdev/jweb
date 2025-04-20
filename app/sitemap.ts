import type { MetadataRoute } from "next"

// Datos de ejemplo para las entradas de blog
const blogPosts = [
  {
    id: 1,
    title: "Cómo mejorar tu técnica de pase en el fútbol",
    slug: "como-mejorar-tu-tecnica-de-pase",
    date: "2025-03-15",
  },
  {
    id: 2,
    title: "Los 5 mejores ejercicios de calentamiento antes de un partido",
    slug: "mejores-ejercicios-calentamiento",
    date: "2025-03-10",
  },
  {
    id: 3,
    title: "Nutrición para futbolistas: qué comer antes y después de jugar",
    slug: "nutricion-para-futbolistas",
    date: "2025-03-05",
  },
  {
    id: 4,
    title: "Cómo organizar un torneo de fútbol exitoso",
    slug: "como-organizar-torneo-futbol",
    date: "2025-02-28",
  },
  {
    id: 5,
    title: "Las mejores canchas de fútbol en Santiago",
    slug: "mejores-canchas-santiago",
    date: "2025-02-20",
  },
  {
    id: 6,
    title: "Estrategias tácticas para equipos de 7 jugadores",
    slug: "estrategias-tacticas-futbol-7",
    date: "2025-02-15",
  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // URLs principales del sitio
  const mainRoutes = [
    {
      url: "https://joinfutbol.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://joinfutbol.com/blog",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://joinfutbol.com/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://joinfutbol.com/registro",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ] as MetadataRoute.Sitemap

  // URLs de las entradas del blog
  const blogRoutes = blogPosts.map((post) => ({
    url: `https://joinfutbol.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  })) as MetadataRoute.Sitemap

  return [...mainRoutes, ...blogRoutes]
}
