"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import {
  MoreHorizontal,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Smile,
  AlertCircle,
  Frown,
  Angry,
  Trash2,
  Share2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useUserStore } from "@/lib/stores/user-store"
import type { Publicacion, TipoReaccion } from "@/types/publicacion"
import { eliminarPublicacion, reaccionarPublicacion, quitarReaccionPublicacion } from "@/services/publicaciones-service"

interface PublicacionItemProps {
  publicacion: Publicacion
  onDelete?: (id: number) => void
  onReaccion?: (id: number, reacciones: Record<TipoReaccion, number>, misReacciones: TipoReaccion[]) => void
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

export function PublicacionItem({ publicacion, onDelete, onReaccion }: PublicacionItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [loadingReaccion, setLoadingReaccion] = useState<TipoReaccion | null>(null)
  const { toast } = useToast()
  const user = useUserStore((state) => state.user)

  // Formatear la fecha relativa
  const fechaRelativa = formatDistanceToNow(new Date(publicacion.fechaCreacion), {
    addSuffix: true,
    locale: es,
  })

  // Manejar eliminación de publicación
  const handleDelete = async () => {
    if (isDeleting) return

    try {
      setIsDeleting(true)
      await eliminarPublicacion(publicacion.id)
      toast({
        title: "Publicación eliminada",
        description: "La publicación ha sido eliminada correctamente",
      })
      if (onDelete) {
        onDelete(publicacion.id)
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo eliminar la publicación",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Manejar reacción a publicación
  const handleReaccion = async (tipo: TipoReaccion) => {
    if (loadingReaccion) return

    try {
      setLoadingReaccion(tipo)

      // Verificar si ya tiene esta reacción para quitarla
      if (publicacion.misReacciones.includes(tipo)) {
        const { reacciones, misReacciones } = await quitarReaccionPublicacion(publicacion.id, tipo)
        if (onReaccion) {
          onReaccion(publicacion.id, reacciones, misReacciones)
        }
      } else {
        const { reacciones, misReacciones } = await reaccionarPublicacion({
          publicacionId: publicacion.id,
          tipo,
        })
        if (onReaccion) {
          onReaccion(publicacion.id, reacciones, misReacciones)
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

  // Verificar si el usuario es el autor de la publicación
  const isAuthor = user?.id === publicacion.usuario.id

  // Formatear texto con hashtags resaltados
  const formatearTexto = (texto: string) => {
    return texto.split(/(#\w+)/g).map((part, index) => {
      if (part.startsWith("#")) {
        const hashtag = part.substring(1)
        return (
          <Link key={index} href={`/dashboard/comunidad/hashtag/${hashtag}`} className="text-primary hover:underline">
            {part}
          </Link>
        )
      }
      return part
    })
  }

  // Compartir publicación
  const handleShare = () => {
    // En una aplicación real, esto podría abrir un modal para compartir
    toast({
      title: "Compartir publicación",
      description: "Funcionalidad de compartir simulada",
    })
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={publicacion.usuario.avatar} alt={publicacion.usuario.nombre} />
              <AvatarFallback>{publicacion.usuario.nombre.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{publicacion.usuario.nombre}</h3>
              <p className="text-xs text-muted-foreground">{fechaRelativa}</p>
            </div>
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
                  {isDeleting ? "Eliminando..." : "Eliminar publicación"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mb-3">
          <p className="whitespace-pre-wrap mb-2">{formatearTexto(publicacion.texto)}</p>

          {/* Hashtags */}
          {publicacion.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {publicacion.hashtags.map((hashtag) => (
                <Link key={hashtag.id} href={`/dashboard/comunidad/hashtag/${hashtag.texto}`}>
                  <Badge variant="secondary">#{hashtag.texto}</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Imágenes */}
        {publicacion.imagenes.length > 0 && (
          <div className="mt-3">
            {publicacion.imagenes.map((img, index) => (
              <img
                key={index}
                src={img || "/placeholder.svg"}
                alt="Imagen de la publicación"
                className="rounded-md w-full h-auto mb-2"
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col">
        {/* Contador de reacciones y comentarios */}
        <div className="flex justify-between w-full text-sm text-muted-foreground mb-2">
          <div>
            {Object.entries(publicacion.reacciones).reduce((total, [_, count]) => total + count, 0) > 0 && (
              <span>
                {Object.entries(publicacion.reacciones).reduce((total, [_, count]) => total + count, 0)} reacciones
              </span>
            )}
          </div>
          <div>
            {publicacion.comentarios > 0 && (
              <Link href={`/dashboard/comunidad/publicacion/${publicacion.id}`} className="hover:underline">
                {publicacion.comentarios} comentarios
              </Link>
            )}
          </div>
        </div>

        <div className="flex justify-between w-full border-t pt-2">
          <div className="flex">
            <TooltipProvider>
              {Object.entries(reaccionesConfig)
                .slice(0, 3)
                .map(([tipo, config]) => {
                  const tipoReaccion = tipo as TipoReaccion
                  const isActive = publicacion.misReacciones.includes(tipoReaccion)

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
                          <span className="ml-1">{config.label}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{config.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
            </TooltipProvider>
          </div>

          <div className="flex gap-2">
            <Link href={`/dashboard/comunidad/publicacion/${publicacion.id}`}>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs hover:text-primary">
                <MessageCircle className="h-4 w-4 mr-1" />
                Comentar
              </Button>
            </Link>

            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs hover:text-primary" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Compartir
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
