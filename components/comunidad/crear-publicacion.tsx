"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Send, Image, Hash, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { crearPublicacion } from "@/services/publicaciones-service"
import type { PublicacionInput } from "@/types/publicacion"

interface CrearPublicacionProps {
  onPublicacionCreada: () => void
}

export function CrearPublicacion({ onPublicacionCreada }: CrearPublicacionProps) {
  const [texto, setTexto] = useState("")
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagInput, setHashtagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagenes, setImagenes] = useState<string[]>([])
  const hashtagInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Extraer hashtags del texto
  const extractHashtags = (text: string) => {
    const hashtagRegex = /#(\w+)/g
    const matches = text.match(hashtagRegex)

    if (matches) {
      const extractedTags = matches.map((tag) => tag.substring(1))
      // Agregar solo hashtags que no existan ya
      const newTags = extractedTags.filter((tag) => !hashtags.includes(tag))
      if (newTags.length > 0) {
        setHashtags([...hashtags, ...newTags])
      }
    }
  }

  const handleTextoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTexto(e.target.value)
  }

  const handleTextoBlur = () => {
    extractHashtags(texto)
  }

  const handleAddHashtag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && hashtagInput.trim()) {
      e.preventDefault()
      const newTag = hashtagInput.trim().replace(/^#/, "")
      if (!hashtags.includes(newTag)) {
        setHashtags([...hashtags, newTag])
      }
      setHashtagInput("")
    }
  }

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag))
  }

  const handleFocusHashtagInput = () => {
    hashtagInputRef.current?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!texto.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El texto de la publicación no puede estar vacío",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Extraer hashtags una última vez antes de enviar
      extractHashtags(texto)

      const publicacionData: PublicacionInput = {
        texto: texto.trim(),
        hashtags,
        imagenes,
      }

      await crearPublicacion(publicacionData)

      // Limpiar el formulario
      setTexto("")
      setHashtags([])
      setHashtagInput("")
      setImagenes([])

      toast({
        title: "Publicación creada",
        description: "Tu publicación ha sido creada correctamente",
      })

      // Notificar al componente padre
      onPublicacionCreada()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo crear la publicación",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Simulación de carga de imagen (en una app real, esto subiría la imagen a un servidor)
  const handleAddImage = () => {
    // Simulamos agregar una imagen de placeholder
    setImagenes([...imagenes, "/placeholder.svg?height=300&width=500"])

    toast({
      title: "Imagen agregada",
      description: "En una aplicación real, aquí se abriría un selector de archivos",
    })
  }

  const handleRemoveImage = (index: number) => {
    const newImagenes = [...imagenes]
    newImagenes.splice(index, 1)
    setImagenes(newImagenes)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={texto}
            onChange={handleTextoChange}
            onBlur={handleTextoBlur}
            placeholder="¿Qué está pasando en tu mundo futbolístico?"
            className="min-h-[100px] resize-none"
          />

          {/* Hashtags */}
          <div className="flex flex-wrap gap-2 items-center">
            {hashtags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                #{tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded-full"
                  onClick={() => handleRemoveHashtag(tag)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Eliminar hashtag</span>
                </Button>
              </Badge>
            ))}
            <div
              className="flex items-center border rounded-md px-2 py-1 cursor-text"
              onClick={handleFocusHashtagInput}
            >
              <Hash className="h-4 w-4 mr-1 text-muted-foreground" />
              <input
                ref={hashtagInputRef}
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleAddHashtag}
                placeholder="Agregar hashtag"
                className="bg-transparent border-none outline-none text-sm w-24"
              />
            </div>
          </div>

          {/* Imágenes */}
          {imagenes.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {imagenes.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img || "/placeholder.svg"} alt="Imagen adjunta" className="rounded-md w-full h-auto" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Eliminar imagen</span>
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddImage}
              className="flex items-center gap-1"
            >
              <Image className="h-4 w-4" />
              Imagen
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !texto.trim()}
              className="flex items-center gap-1"
            >
              {isSubmitting ? (
                "Publicando..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Publicar
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
