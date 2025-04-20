"use client"

import { useState, useEffect } from "react"
import { MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import type { Comentario, ComentarioInput, TipoReaccion } from "@/types/comentario"
import { getComentariosByPartidoId, crearComentario } from "@/services/comentarios-service"
import { ComentarioItem } from "./comentario-item"
import { ComentarioForm } from "./comentario-form"

interface SeccionComentariosProps {
  partidoId: number
}

export function SeccionComentarios({ partidoId }: SeccionComentariosProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [respondiendo, setRespondiendo] = useState<number | null>(null)
  const { toast } = useToast()

  // Cargar comentarios al montar el componente
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        setIsLoading(true)
        const data = await getComentariosByPartidoId(partidoId)
        setComentarios(data)
        setError(null)
      } catch (err: any) {
        console.error("Error al cargar comentarios:", err)
        setError(err.message || "No se pudieron cargar los comentarios. Intenta de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchComentarios()
  }, [partidoId])

  // Manejar envío de nuevo comentario
  const handleSubmitComentario = async (comentarioInput: ComentarioInput) => {
    try {
      const nuevoComentario = await crearComentario(comentarioInput)

      // Si es una respuesta, añadirla al comentario padre
      if (comentarioInput.respuestaAId) {
        setComentarios((prevComentarios) =>
          prevComentarios.map((c) => {
            if (c.id === comentarioInput.respuestaAId) {
              return {
                ...c,
                respuestas: [...(c.respuestas || []), nuevoComentario],
              }
            }
            return c
          }),
        )
      } else {
        // Si es un comentario principal, añadirlo al inicio de la lista
        setComentarios((prevComentarios) => [nuevoComentario, ...prevComentarios])
      }

      toast({
        title: "Comentario enviado",
        description: "Tu comentario ha sido publicado correctamente",
      })
    } catch (error: any) {
      throw error
    }
  }

  // Manejar eliminación de comentario
  const handleDeleteComentario = (comentarioId: number) => {
    // Buscar si es un comentario principal o una respuesta
    const esRespuesta = comentarios.some((c) => c.respuestas?.some((r) => r.id === comentarioId))

    if (esRespuesta) {
      // Si es una respuesta, eliminarla del comentario padre
      setComentarios((prevComentarios) =>
        prevComentarios.map((c) => {
          if (c.respuestas?.some((r) => r.id === comentarioId)) {
            return {
              ...c,
              respuestas: c.respuestas.filter((r) => r.id !== comentarioId),
            }
          }
          return c
        }),
      )
    } else {
      // Si es un comentario principal, eliminarlo de la lista
      setComentarios((prevComentarios) => prevComentarios.filter((c) => c.id !== comentarioId))
    }
  }

  // Manejar actualización de reacciones
  const handleReaccion = (
    comentarioId: number,
    reacciones: Record<TipoReaccion, number>,
    misReacciones: TipoReaccion[],
  ) => {
    // Buscar si es un comentario principal o una respuesta
    const esRespuesta = comentarios.some((c) => c.respuestas?.some((r) => r.id === comentarioId))

    if (esRespuesta) {
      // Si es una respuesta, actualizar sus reacciones
      setComentarios((prevComentarios) =>
        prevComentarios.map((c) => {
          if (c.respuestas?.some((r) => r.id === comentarioId)) {
            return {
              ...c,
              respuestas: c.respuestas.map((r) =>
                r.id === comentarioId
                  ? {
                      ...r,
                      reacciones,
                      misReacciones,
                    }
                  : r,
              ),
            }
          }
          return c
        }),
      )
    } else {
      // Si es un comentario principal, actualizar sus reacciones
      setComentarios((prevComentarios) =>
        prevComentarios.map((c) =>
          c.id === comentarioId
            ? {
                ...c,
                reacciones,
                misReacciones,
              }
            : c,
        ),
      )
    }
  }

  // Renderizar estado de carga
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-60" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16 rounded-md" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comentarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comentarios
        </CardTitle>
        <CardDescription>
          {comentarios.length === 0
            ? "Sé el primero en comentar sobre este partido"
            : `${comentarios.length} comentario${comentarios.length !== 1 ? "s" : ""}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ComentarioForm
          partidoId={partidoId}
          onSubmit={handleSubmitComentario}
          placeholder="¿Qué opinas sobre este partido?"
        />

        {comentarios.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comentarios.map((comentario) => (
              <div key={comentario.id}>
                <ComentarioItem
                  comentario={comentario}
                  onReply={(id) => setRespondiendo(id)}
                  onDelete={handleDeleteComentario}
                  onReaccion={handleReaccion}
                />
                {respondiendo === comentario.id && (
                  <div className="ml-12 mt-3">
                    <ComentarioForm
                      partidoId={partidoId}
                      respuestaAId={comentario.id}
                      onSubmit={handleSubmitComentario}
                      onCancel={() => setRespondiendo(null)}
                      placeholder={`Responder a ${comentario.autor.nombre}...`}
                      autoFocus
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
