"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PublicacionItem } from "@/components/comunidad/publicacion-item"
import { ComentarioForm } from "@/components/comentarios/comentario-form"
import { ComentarioItem } from "@/components/comentarios/comentario-item"
import { getPublicacionById, comentarPublicacion } from "@/services/publicaciones-service"
import { useToast } from "@/hooks/use-toast"
import type { PublicacionDetallada, TipoReaccion, ComentarioPublicacionInput } from "@/types/publicacion"

export default function PublicacionDetallePage({ params }: { params: { id: string } }) {
  const [publicacion, setPublicacion] = useState<PublicacionDetallada | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [respuestaAId, setRespuestaAId] = useState<number | undefined>(undefined)
  const router = useRouter()
  const { toast } = useToast()

  const publicacionId = Number.parseInt(params.id)

  const cargarPublicacion = async () => {
    try {
      setIsLoading(true)
      const data = await getPublicacionById(publicacionId)
      setPublicacion(data)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo cargar la publicación",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    cargarPublicacion()
  }, [publicacionId])

  const handleComentarioSubmit = async (comentario: ComentarioPublicacionInput) => {
    try {
      const nuevoComentario = await comentarPublicacion(comentario)

      if (publicacion) {
        // Si es una respuesta, agregar a las respuestas del comentario padre
        if (comentario.respuestaAId) {
          const comentariosActualizados = publicacion.comentariosData.map((c) => {
            if (c.id === comentario.respuestaAId) {
              return {
                ...c,
                respuestas: [...(c.respuestas || []), nuevoComentario],
              }
            }
            return c
          })

          setPublicacion({
            ...publicacion,
            comentariosData: comentariosActualizados,
            comentarios: publicacion.comentarios + 1,
          })
        } else {
          // Si es un comentario principal, agregarlo a la lista
          setPublicacion({
            ...publicacion,
            comentariosData: [...publicacion.comentariosData, nuevoComentario],
            comentarios: publicacion.comentarios + 1,
          })
        }
      }

      // Limpiar el estado de respuesta
      setRespuestaAId(undefined)

      toast({
        title: "Comentario enviado",
        description: "Tu comentario ha sido publicado correctamente",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo enviar el comentario",
      })
    }
  }

  const handleComentarioDelete = (comentarioId: number) => {
    if (!publicacion) return

    // Filtrar comentarios principales
    const comentariosPrincipales = publicacion.comentariosData.filter((c) => c.id !== comentarioId)

    // Filtrar respuestas en comentarios
    const comentariosConRespuestasFiltradas = comentariosPrincipales.map((c) => {
      if (c.respuestas && c.respuestas.length > 0) {
        return {
          ...c,
          respuestas: c.respuestas.filter((r) => r.id !== comentarioId),
        }
      }
      return c
    })

    setPublicacion({
      ...publicacion,
      comentariosData: comentariosConRespuestasFiltradas,
      comentarios: publicacion.comentarios - 1,
    })
  }

  const handleComentarioReaccion = (
    comentarioId: number,
    reacciones: Record<TipoReaccion, number>,
    misReacciones: TipoReaccion[],
  ) => {
    if (!publicacion) return

    // Actualizar reacciones en comentarios principales
    const comentariosActualizados = publicacion.comentariosData.map((c) => {
      if (c.id === comentarioId) {
        return { ...c, reacciones, misReacciones }
      }

      // Buscar en respuestas
      if (c.respuestas && c.respuestas.length > 0) {
        return {
          ...c,
          respuestas: c.respuestas.map((r) => (r.id === comentarioId ? { ...r, reacciones, misReacciones } : r)),
        }
      }

      return c
    })

    setPublicacion({
      ...publicacion,
      comentariosData: comentariosActualizados,
    })
  }

  const handlePublicacionReaccion = (
    id: number,
    reacciones: Record<TipoReaccion, number>,
    misReacciones: TipoReaccion[],
  ) => {
    if (!publicacion) return

    setPublicacion({
      ...publicacion,
      reacciones,
      misReacciones,
    })
  }

  const handleResponder = (comentarioId: number) => {
    setRespuestaAId(comentarioId)
  }

  const handleCancelarRespuesta = () => {
    setRespuestaAId(undefined)
  }

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" className="mb-4 flex items-center gap-1" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : publicacion ? (
        <div className="space-y-6">
          <PublicacionItem publicacion={publicacion} onReaccion={handlePublicacionReaccion} />

          <div className="bg-card rounded-lg p-4 border">
            <h2 className="text-xl font-semibold mb-4">Comentarios</h2>

            <div className="mb-6">
              <ComentarioForm
                partidoId={publicacionId}
                respuestaAId={respuestaAId}
                onSubmit={handleComentarioSubmit}
                onCancel={respuestaAId ? handleCancelarRespuesta : undefined}
                placeholder={respuestaAId ? "Escribe tu respuesta..." : "Escribe un comentario..."}
                autoFocus={respuestaAId !== undefined}
              />
            </div>

            {publicacion.comentariosData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay comentarios aún. ¡Sé el primero en comentar!
              </div>
            ) : (
              <div className="space-y-6">
                {publicacion.comentariosData
                  .filter((c) => !c.respuestaAId) // Solo comentarios principales
                  .map((comentario) => (
                    <ComentarioItem
                      key={comentario.id}
                      comentario={comentario}
                      onReply={handleResponder}
                      onDelete={handleComentarioDelete}
                      onReaccion={handleComentarioReaccion}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Publicación no encontrada</h2>
          <p className="text-muted-foreground">La publicación que estás buscando no existe o ha sido eliminada.</p>
        </div>
      )}
    </div>
  )
}
