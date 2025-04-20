"use client"

import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { CrearPublicacion } from "@/components/comunidad/crear-publicacion"
import { PublicacionItem } from "@/components/comunidad/publicacion-item"
import { HashtagTrending } from "@/components/comunidad/hashtag-trending"
import { getPublicaciones } from "@/services/publicaciones-service"
import { useToast } from "@/hooks/use-toast"
import type { Publicacion, TipoReaccion } from "@/types/publicacion"

export default function ComunidadPage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const cargarPublicaciones = async () => {
    try {
      setIsLoading(true)
      const data = await getPublicaciones()
      setPublicaciones(data)
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

  useEffect(() => {
    cargarPublicaciones()
  }, [])

  const handlePublicacionCreada = () => {
    cargarPublicaciones()
  }

  const handlePublicacionEliminada = (id: number) => {
    setPublicaciones(publicaciones.filter((pub) => pub.id !== id))
  }

  const handleReaccion = (id: number, reacciones: Record<TipoReaccion, number>, misReacciones: TipoReaccion[]) => {
    setPublicaciones(publicaciones.map((pub) => (pub.id === id ? { ...pub, reacciones, misReacciones } : pub)))
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Comunidad</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="amigos">Amigos</TabsTrigger>
              <TabsTrigger value="mis-publicaciones">Mis publicaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="space-y-6">
              <CrearPublicacion onPublicacionCreada={handlePublicacionCreada} />

              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {publicaciones.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No hay publicaciones disponibles. ¡Sé el primero en publicar algo!
                    </div>
                  ) : (
                    <div>
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
            </TabsContent>

            <TabsContent value="amigos">
              <div className="text-center py-12 text-muted-foreground">Aquí verás las publicaciones de tus amigos.</div>
            </TabsContent>

            <TabsContent value="mis-publicaciones">
              <div className="text-center py-12 text-muted-foreground">Aquí verás tus publicaciones.</div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <HashtagTrending />

          {/* Sugerencias de amigos (podría implementarse en el futuro) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sugerencias para ti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-muted-foreground">
                Próximamente: sugerencias de amigos y jugadores para seguir.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
