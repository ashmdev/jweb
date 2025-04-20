"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PublicacionItem } from "@/components/comunidad/publicacion-item"
import { getPublicaciones } from "@/services/publicaciones-service"
import { useToast } from "@/hooks/use-toast"
import type { Publicacion, TipoReaccion } from "@/types/publicacion"

export default function HashtagPage({ params }: { params: { tag: string } }) {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const hashtag = params.tag

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        setIsLoading(true)
        // En una aplicación real, filtrarías por hashtag en el backend
        const data = await getPublicaciones()
        // Filtrar publicaciones que contienen el hashtag
        const publicacionesFiltradas = data.filter((pub) =>
          pub.hashtags.some((tag) => tag.texto.toLowerCase() === hashtag.toLowerCase()),
        )
        setPublicaciones(publicacionesFiltradas)
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "No se pudieron cargar las publicaciones",
        })
      } finally {
        setIsLoading(false)
      }
    }

    cargarPublicaciones()
  }, [hashtag, toast])

  const handlePublicacionEliminada = (id: number) => {
    setPublicaciones(publicaciones.filter((pub) => pub.id !== id))
  }

  const handleReaccion = (id: number, reacciones: Record<TipoReaccion, number>, misReacciones: TipoReaccion[]) => {
    setPublicaciones(publicaciones.map((pub) => (pub.id === id ? { ...pub, reacciones, misReacciones } : pub)))
  }

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" className="mb-4 flex items-center gap-1" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <div className="flex items-center gap-2 mb-6">
        <Hash className="h-6 w-6" />
        <h1 className="text-3xl font-bold">{hashtag}</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          {publicaciones.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border">
              <h2 className="text-xl font-semibold mb-2">No hay publicaciones</h2>
              <p className="text-muted-foreground">No se encontraron publicaciones con el hashtag #{hashtag}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {publicaciones.map((publicacion) => (
                <PublicacionItem
                  key={publicacion.id}
                  publicacion={publicacion}
                  onDelete={handlePublicacionEliminada}
                  onReaccion={handleReaccion}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
