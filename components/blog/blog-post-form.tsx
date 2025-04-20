"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, X, ImageIcon, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface BlogPostFormProps {
  post?: any
  onSubmit: (formData: any) => void
  onCancel: () => void
}

export default function BlogPostForm({ post, onSubmit, onCancel }: BlogPostFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    status: "draft",
    featuredImage: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    author: "",
    publishDate: "",
  })
  const [previewMode, setPreviewMode] = useState(false)

  // Si estamos editando un post existente, cargar sus datos
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        category: post.category || "",
        status: post.status || "draft",
        featuredImage: post.image || "",
        metaTitle: post.metaTitle || post.title || "",
        metaDescription: post.metaDescription || post.excerpt || "",
        keywords: post.keywords || post.category || "",
        author: post.author || "",
        publishDate: post.date || new Date().toISOString().split("T")[0],
      })
    } else {
      // Si es un nuevo post, establecer la fecha actual
      setFormData((prev) => ({
        ...prev,
        publishDate: new Date().toISOString().split("T")[0],
      }))
    }
  }, [post])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Generar slug automáticamente a partir del título
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")

      setFormData((prev) => ({
        ...prev,
        slug,
        metaTitle: prev.metaTitle || value, // Usar el título como metaTitle si está vacío
      }))
    }

    // Usar el excerpt como metaDescription si está vacío
    if (name === "excerpt") {
      setFormData((prev) => ({
        ...prev,
        metaDescription: prev.metaDescription || value.substring(0, 160),
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Usar la categoría como parte de las keywords si está vacío
    if (name === "category" && !formData.keywords) {
      setFormData((prev) => ({ ...prev, keywords: value }))
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name === "status") {
      setFormData((prev) => ({ ...prev, status: checked ? "published" : "draft" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.category) {
      // Mostrar error
      return
    }

    try {
      setIsLoading(true)

      // En una aplicación real, aquí enviaríamos los datos al servidor
      // Simulamos un retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Llamar a la función de éxito
      onSubmit(formData)
    } catch (error) {
      console.error("Error al guardar entrada:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{post ? "Editar entrada" : "Crear nueva entrada"}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="publish-switch"
                checked={formData.status === "published"}
                onCheckedChange={(checked) => handleSwitchChange("status", checked)}
              />
              <Label htmlFor="publish-switch">{formData.status === "published" ? "Publicado" : "Borrador"}</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="editor" onClick={() => setPreviewMode(false)}>
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>
                Vista previa
              </TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Título de la entrada"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="url-amigable-del-post"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    URL amigable para SEO. Usa guiones para separar palabras.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Técnicas">Técnicas</SelectItem>
                      <SelectItem value="Entrenamiento">Entrenamiento</SelectItem>
                      <SelectItem value="Nutrición">Nutrición</SelectItem>
                      <SelectItem value="Organización">Organización</SelectItem>
                      <SelectItem value="Recintos">Recintos</SelectItem>
                      <SelectItem value="Tácticas">Tácticas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Autor *</Label>
                  <Input
                    id="author"
                    name="author"
                    placeholder="Nombre del autor"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishDate">Fecha de publicación *</Label>
                  <Input
                    id="publishDate"
                    name="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Extracto *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  placeholder="Breve descripción de la entrada (máximo 160 caracteres para SEO)"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="h-20"
                  maxLength={160}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.excerpt.length}/160 caracteres. Este texto aparecerá en los resultados de búsqueda.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">Imagen destacada</Label>
                <div className="flex gap-2">
                  <Input
                    id="featuredImage"
                    name="featuredImage"
                    placeholder="URL de la imagen destacada"
                    value={formData.featuredImage}
                    onChange={handleInputChange}
                  />
                  <Button type="button" variant="outline" className="flex-shrink-0">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Subir
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recomendado: 1200x630px para una visualización óptima en redes sociales.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenido *</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Contenido de la entrada (admite HTML)"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="min-h-[300px] font-mono"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Usa etiquetas HTML para formatear el contenido. Recuerda usar encabezados (h2, h3) para mejorar el
                  SEO.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="border rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{formData.title || "Título de la entrada"}</h1>

                {formData.featuredImage && (
                  <div className="relative h-[300px] w-full mb-6 rounded-lg overflow-hidden">
                    <img
                      src={formData.featuredImage || "/placeholder.svg"}
                      alt={formData.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div className="text-lg text-muted-foreground mb-6">{formData.excerpt || "Extracto de la entrada"}</div>

                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: formData.content || "<p>El contenido de la entrada aparecerá aquí...</p>",
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg border border-muted mb-6">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Optimización para motores de búsqueda</h3>
                    <p className="text-sm text-muted-foreground">
                      Completa estos campos para mejorar el posicionamiento de tu entrada en los motores de búsqueda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaTitle">Título para SEO</Label>
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  placeholder="Título optimizado para SEO (50-60 caracteres)"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.metaTitle.length}/60 caracteres. Este título se mostrará en los resultados de búsqueda.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Descripción para SEO</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  placeholder="Descripción optimizada para SEO (150-160 caracteres)"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  className="h-20"
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.metaDescription.length}/160 caracteres. Esta descripción se mostrará en los resultados de
                  búsqueda.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Palabras clave</Label>
                <Input
                  id="keywords"
                  name="keywords"
                  placeholder="Palabras clave separadas por comas"
                  value={formData.keywords}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Ejemplo: fútbol, técnicas de pase, entrenamiento, mejora de habilidades
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="preview">
                  <AccordionTrigger>Vista previa en Google</AccordionTrigger>
                  <AccordionContent>
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="text-blue-600 text-xl hover:underline truncate">
                        {formData.metaTitle || formData.title || "Título de la entrada"}
                      </div>
                      <div className="text-green-700 text-sm">
                        joinfutbol.com/blog/{formData.slug || "url-de-la-entrada"}
                      </div>
                      <div className="text-gray-600 text-sm line-clamp-2">
                        {formData.metaDescription || formData.excerpt || "Descripción de la entrada..."}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
