"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Search, Edit, Trash2, Eye, Calendar, User, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import BlogPostForm from "@/components/blog/blog-post-form"

// Datos de ejemplo para las entradas de blog
const blogPosts = [
  {
    id: 1,
    title: "Cómo mejorar tu técnica de pase en el fútbol",
    excerpt: "Descubre los mejores ejercicios y consejos para perfeccionar tus pases y mejorar tu juego en equipo.",
    date: "15 de marzo de 2025",
    author: "Carlos Rodríguez",
    category: "Técnicas",
    status: "published",
    slug: "como-mejorar-tu-tecnica-de-pase",
  },
  {
    id: 2,
    title: "Los 5 mejores ejercicios de calentamiento antes de un partido",
    excerpt: "Prepara tu cuerpo adecuadamente para evitar lesiones y maximizar tu rendimiento en la cancha.",
    date: "10 de marzo de 2025",
    author: "Laura Martínez",
    category: "Entrenamiento",
    status: "published",
    slug: "mejores-ejercicios-calentamiento",
  },
  {
    id: 3,
    title: "Nutrición para futbolistas: qué comer antes y después de jugar",
    excerpt: "Una guía completa sobre la alimentación ideal para optimizar tu rendimiento y recuperación.",
    date: "5 de marzo de 2025",
    author: "Miguel Sánchez",
    category: "Nutrición",
    status: "published",
    slug: "nutricion-para-futbolistas",
  },
  {
    id: 4,
    title: "Cómo organizar un torneo de fútbol exitoso",
    excerpt: "Consejos prácticos para planificar y ejecutar un torneo que todos los participantes disfrutarán.",
    date: "28 de febrero de 2025",
    author: "Ana López",
    category: "Organización",
    status: "draft",
    slug: "como-organizar-torneo-futbol",
  },
  {
    id: 5,
    title: "Las mejores canchas de fútbol en Santiago",
    excerpt: "Descubre los recintos deportivos mejor valorados por la comunidad de Join Fútbol en la capital.",
    date: "20 de febrero de 2025",
    author: "Pedro Gómez",
    category: "Recintos",
    status: "published",
    slug: "mejores-canchas-santiago",
  },
  {
    id: 6,
    title: "Estrategias tácticas para equipos de 7 jugadores",
    excerpt: "Formaciones y tácticas efectivas para sacar el máximo provecho a tu equipo en partidos de fútbol 7.",
    date: "15 de febrero de 2025",
    author: "Carlos Rodríguez",
    category: "Tácticas",
    status: "draft",
    slug: "estrategias-tacticas-futbol-7",
  },
]

export default function BlogAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Filtrar posts según los criterios de búsqueda y filtros
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter
    const matchesStatus = statusFilter === "all" || post.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Obtener categorías únicas para el filtro
  const categories = Array.from(new Set(blogPosts.map((post) => post.category)))

  const handleCreatePost = () => {
    setEditingPost(null)
    setShowForm(true)
  }

  const handleEditPost = (post: any) => {
    setEditingPost(post)
    setShowForm(true)
  }

  const handleDeletePost = (postId: number) => {
    // En una aplicación real, aquí enviaríamos una solicitud para eliminar el post
    toast({
      title: "Post eliminado",
      description: "La entrada de blog ha sido eliminada correctamente",
    })
  }

  const handleFormSubmit = (formData: any) => {
    // En una aplicación real, aquí enviaríamos los datos al servidor
    toast({
      title: editingPost ? "Post actualizado" : "Post creado",
      description: editingPost
        ? "La entrada de blog ha sido actualizada correctamente"
        : "La entrada de blog ha sido creada correctamente",
    })
    setShowForm(false)
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administración del Blog</h1>
          <p className="text-muted-foreground">Gestiona las entradas del blog de Join Fútbol</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto" onClick={handleCreatePost}>
          <Plus className="mr-2 h-4 w-4" /> Crear nueva entrada
        </Button>
      </div>

      {showForm ? (
        <BlogPostForm post={editingPost} onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Entradas del Blog</CardTitle>
              <CardDescription>Administra todas las entradas del blog desde aquí</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar entradas..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <span>Categoría</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <span>Estado</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="draft">Borrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Título</TableHead>
                      <TableHead className="hidden md:table-cell">Categoría</TableHead>
                      <TableHead className="hidden md:table-cell">Autor</TableHead>
                      <TableHead className="hidden md:table-cell">Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No se encontraron entradas que coincidan con los criterios de búsqueda
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate max-w-[300px]">{post.title}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">{post.category}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{post.author}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{post.date}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={post.status === "published" ? "default" : "secondary"}>
                              {post.status === "published" ? "Publicado" : "Borrador"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push(`/blog/${post.slug}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditPost(post)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
