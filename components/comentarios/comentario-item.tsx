"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import {
  MoreHorizontal,
  Trash2,
  Reply,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Smile,
  AlertCircle,
  Frown,
  Angry,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import type { Comentario, TipoReaccion } from "@/types/comentario"
import { eliminarComentario, reaccionarComentario, quitarReaccion } from "@/services/comentarios-service"
import { useUserStore } from "@/lib/stores/user-store"

interface ComentarioItemProps {
  comentario: Comentario
  onReply?: (comentarioId: number) => void
  onDelete?: (comentarioId: number) => void
  onReaccion?: (comentarioId: number, reacciones: Record<TipoReaccion, number>, misReacciones: TipoReaccion[]) => void
  isReply?: boolean
}

// Mapeo de tipos de reacción a iconos y colores
const reaccionesConfig: Record<
  TipoReaccion,
  { icon: React.ReactNode; label: string; activeColor: string; hoverColor: string }
> = {
  me_gusta: {
    icon: <ThumbsUp className="h-4 w-4" />,
    label: "Me gusta",
    activeColor: "text-blue-500",
    hoverColor: "hover:text-blue-500",
  },
  no_me_gusta: {
    icon: <ThumbsDown className="h-4 w-4" />,
    label: "No me gusta",
    activeColor: "text-red-500",
    hoverColor: "hover:text-red-500",
  },
  me_encanta: {
    icon: <Heart className="h-4 w-4" />,
    label: "Me encanta",
    activeColor: "text-pink-500",
    hoverColor: "hover:text-pink-500",
  },
  divertido: {
    icon: <Smile className="h-4 w-4" />,
    label: "Divertido",
    activeColor: "text-yellow-500",
    hoverColor: "hover:text-yellow-500",
  },
  sorprendido: {
    icon: <AlertCircle className="h-4 w-4" />,
    label: "Sorprendido",
    activeColor: "text-purple-500",
    hoverColor: "hover:text-purple-500",
  },
  triste: {
    icon: <Frown className="h-4 w-4" />,
    label: "Triste",
    activeColor: "text-blue-700",
    hoverColor: "hover:text-blue-700",
  },
  enojado: {
    icon: <Angry className="h-4 w-4" />,
    label: "Enojado",
    activeColor: "text-orange-600",
    hoverColor: "hover:text-orange-600",
  },
}

export function ComentarioItem({ comentario, onReply, onDelete, onReaccion, isReply = false }: ComentarioItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [loadingReaccion, setLoadingReaccion] = useState<TipoReaccion | null>(null)
  const { toast } = useToast()
  const user = useUserStore((state) => state.user)

  // Formatear la fecha relativa
  const fechaRelativa = formatDistanceToNow(new Date(comentario.fecha), {
    addSuffix: true,
    locale: es,
  })

  // Manejar eliminación de comentario
  const handleDelete = async () => {
    if (isDeleting) return

    try {
      setIsDeleting(true)
      await eliminarComentario(comentario.id)
      toast({
        title: "Comentario eliminado",
        description: "El comentario ha sido eliminado correctamente",
      })
      if (onDelete) {
        onDelete(comentario.id)
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo eliminar el comentario",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Manejar reacción a comentario
  const handleReaccion = async (tipo: TipoReaccion) => {
    if (loadingReaccion) return

    try {
      setLoadingReaccion(tipo)

      // Verificar si ya tiene esta reacción para quitarla
      if (comentario.misReacciones.includes(tipo)) {
        const { reacciones, misReacciones } = await quitarReaccion(comentario.id, tipo)
        if (onReaccion) {
          onReaccion(comentario.id, reacciones, misReacciones)
        }
      } else {
        const { reacciones, misReacciones } = await reaccionarComentario({
          comentarioId: comentario.id,
          tipo,
        })
        if (onReaccion) {
          onReaccion(comentario.id, reacciones, misReacciones)
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo procesar la reacción",
      })
    } finally {
      setLoadingReaccion(null)
    }
  }

  // Verificar si el usuario es el autor del comentario
  const isAuthor = user?.id === comentario.autor.id

  return (
    <div className={`flex gap-3 ${isReply ? "ml-12 mt-3" : "mb-6"}`}>
      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
        <AvatarImage src={comentario.autor.avatar} alt={comentario.autor.nombre} />
        <AvatarFallback>{comentario.autor.nombre.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="bg-muted rounded-lg p-3">
          <div className="flex justify-between items-start mb-1">
            <div>
              <span className="font-medium">{comentario.autor.nombre}</span>
              <span className="text-xs text-muted-foreground ml-2">{fechaRelativa}</span>
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Más opciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Eliminando..." : "Eliminar comentario"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="text-sm sm:text-base whitespace-pre-wrap">{comentario.texto}</p>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <TooltipProvider>
            {Object.entries(reaccionesConfig).map(([tipo, config]) => {
              const tipoReaccion = tipo as TipoReaccion
              const count = comentario.reacciones[tipoReaccion] || 0
              const isActive = comentario.misReacciones.includes(tipoReaccion)

              return (
                <Tooltip key={tipo}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 text-xs ${isActive ? config.activeColor : config.hoverColor}`}
                      onClick={() => handleReaccion(tipoReaccion)}
                      disabled={loadingReaccion !== null}
                    >
                      {config.icon}
                      {count > 0 && <span className="ml-1">{count}</span>}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{config.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>

          {!isReply && onReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs hover:text-primary"
              onClick={() => onReply(comentario.id)}
            >
              <Reply className="h-4 w-4 mr-1" />
              Responder
            </Button>
          )}
        </div>

        {comentario.respuestas && comentario.respuestas.length > 0 && (
          <div className="space-y-3 mt-3">
            {comentario.respuestas.map((respuesta) => (
              <ComentarioItem
                key={respuesta.id}
                comentario={respuesta}
                onDelete={onDelete}
                onReaccion={onReaccion}
                isReply={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
