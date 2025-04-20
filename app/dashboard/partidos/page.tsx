"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, MapPin, DollarSign, UserPlus } from "lucide-react"
import type { Partido } from "@/types/partido"
import { getPartidos } from "@/services/partidos-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PartidosPage() {
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        setIsLoading(true)
        const data = await getPartidos()
        setPartidos(data)
        setError(null)
      } catch (err) {
        console.error("Error al cargar partidos:", err)
        setError("No se pudieron cargar los partidos. Intenta de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPartidos()
  }, [])

  // Función para formatear la fecha
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Función para formatear el precio
  const formatearPrecio = (precio: number) => {
    return precio.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    })
  }

  // Función para navegar al detalle del partido
  const verDetallePartido = (id: number) => {
    router.push(`/dashboard/partidos/${id}`)
  }

  // Renderizar esqueletos durante la carga
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="mb-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md ml-2" />
            <Skeleton className="h-10 w-24 rounded-md ml-2" />
          </TabsList>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>
    )
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Partidos Disponibles</h1>
          <p className="text-muted-foreground">Explora los partidos disponibles y únete a los que más te interesen</p>
        </div>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="hoy">Hoy</TabsTrigger>
          <TabsTrigger value="semana">Esta semana</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-6">
          <div className="card-grid-responsive">
            {partidos.map((partido) => (
              <Card key={partido.id} className="overflow-hidden">
                <CardHeader className="pb-2 px-4 pt-4 sm:px-6 sm:pt-6 card-header-md">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base sm:text-lg truncate max-w-[70%]">{partido.titulo}</CardTitle>
                    <Badge variant="outline" className="bg-primary/10 text-primary text-xs whitespace-nowrap">
                      {partido.estado === "programado"
                        ? "Programado"
                        : partido.estado === "en_curso"
                          ? "En curso"
                          : partido.estado === "finalizado"
                            ? "Finalizado"
                            : "Cancelado"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">{formatearFecha(partido.fecha)}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 px-4 sm:px-6 card-content-md">
                  <div className="space-y-3">
                    <div className="flex items-center text-xs sm:text-sm">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">
                        {partido.recinto.nombre}, {partido.recinto.ciudad}
                      </span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span>{partido.hora} hrs</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span>Comisión: {formatearPrecio(partido.valorComision)}</span>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium truncate max-w-[45%]">{partido.equipoLocal.nombre}</span>
                      <span className="text-sm font-medium truncate max-w-[45%]">{partido.equipoVisitante.nombre}</span>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex flex-wrap items-center">
                        <div className="flex -space-x-2 mr-1">
                          {partido.equipoLocal.jugadores.slice(0, 3).map((jugador) => (
                            <Avatar key={jugador.id} className="border-2 border-background w-7 h-7 sm:w-8 sm:h-8">
                              <AvatarImage src={jugador.avatar} alt={jugador.nombre} />
                              <AvatarFallback>{jugador.nombre.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {partido.equipoLocal.jugadores.length > 3 && (
                            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-xs">
                              +{partido.equipoLocal.jugadores.length - 3}
                            </div>
                          )}
                        </div>
                        {partido.equipoLocal.puestosDisponibles > 0 && (
                          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary ml-1">
                            <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center">
                        {partido.equipoVisitante.puestosDisponibles > 0 && (
                          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary mr-1">
                            <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </div>
                        )}
                        <div className="flex -space-x-2">
                          {partido.equipoVisitante.jugadores.length > 3 && (
                            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-xs">
                              +{partido.equipoVisitante.jugadores.length - 3}
                            </div>
                          )}
                          {partido.equipoVisitante.jugadores
                            .slice(0, 3)
                            .reverse()
                            .map((jugador) => (
                              <Avatar key={jugador.id} className="border-2 border-background w-7 h-7 sm:w-8 sm:h-8">
                                <AvatarImage src={jugador.avatar} alt={jugador.nombre} />
                                <AvatarFallback>{jugador.nombre.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>{partido.equipoLocal.puestosDisponibles} disponibles</span>
                      <span>{partido.equipoVisitante.puestosDisponibles} disponibles</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 px-4 pb-4 sm:px-6 sm:pb-6 card-footer-md">
                  <Button onClick={() => verDetallePartido(partido.id)} variant="outline" className="w-full">
                    Ver detalles
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hoy" className="space-y-6">
          <div className="card-grid-responsive">
            {partidos
              .filter((partido) => {
                const hoy = new Date().toISOString().split("T")[0]
                return partido.fecha === hoy
              })
              .map((partido) => (
                // Mismo componente de tarjeta que en "todos"
                <Card key={partido.id} className="overflow-hidden">
                  {/* Contenido igual que en la pestaña "todos" */}
                  <CardHeader className="pb-2 px-4 pt-4 sm:px-6 sm:pt-6 card-header-md">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base sm:text-lg truncate max-w-[70%]">{partido.titulo}</CardTitle>
                      <Badge variant="outline" className="bg-primary/10 text-primary text-xs whitespace-nowrap">
                        {partido.estado === "programado"
                          ? "Programado"
                          : partido.estado === "en_curso"
                            ? "En curso"
                            : partido.estado === "finalizado"
                              ? "Finalizado"
                              : "Cancelado"}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">{formatearFecha(partido.fecha)}</CardDescription>
                  </CardHeader>
                  {/* Resto del contenido igual que en la pestaña "todos" */}
                  <CardContent className="pb-2 px-4 sm:px-6 card-content-md">
                    <div className="space-y-3">
                      <div className="flex items-center text-xs sm:text-sm">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">
                          {partido.recinto.nombre}, {partido.recinto.ciudad}
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span>{partido.hora} hrs</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span>Comisión: {formatearPrecio(partido.valorComision)}</span>
                      </div>
                    </div>

                    <div className="mt-4 border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium truncate max-w-[45%]">{partido.equipoLocal.nombre}</span>
                        <span className="text-sm font-medium truncate max-w-[45%]">
                          {partido.equipoVisitante.nombre}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex flex-wrap items-center">
                          <div className="flex -space-x-2 mr-1">
                            {partido.equipoLocal.jugadores.slice(0, 3).map((jugador) => (
                              <Avatar key={jugador.id} className="border-2 border-background w-7 h-7 sm:w-8 sm:h-8">
                                <AvatarImage src={jugador.avatar} alt={jugador.nombre} />
                                <AvatarFallback>{jugador.nombre.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                            {partido.equipoLocal.jugadores.length > 3 && (
                              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-xs">
                                +{partido.equipoLocal.jugadores.length - 3}
                              </div>
                            )}
                          </div>
                          {partido.equipoLocal.puestosDisponibles > 0 && (
                            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary ml-1">
                              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center">
                          {partido.equipoVisitante.puestosDisponibles > 0 && (
                            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary mr-1">
                              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          )}
                          <div className="flex -space-x-2">
                            {partido.equipoVisitante.jugadores.length > 3 && (
                              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-xs">
                                +{partido.equipoVisitante.jugadores.length - 3}
                              </div>
                            )}
                            {partido.equipoVisitante.jugadores
                              .slice(0, 3)
                              .reverse()
                              .map((jugador) => (
                                <Avatar key={jugador.id} className="border-2 border-background w-7 h-7 sm:w-8 sm:h-8">
                                  <AvatarImage src={jugador.avatar} alt={jugador.nombre} />
                                  <AvatarFallback>{jugador.nombre.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>{partido.equipoLocal.puestosDisponibles} disponibles</span>
                        <span>{partido.equipoVisitante.puestosDisponibles} disponibles</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 px-4 pb-4 sm:px-6 sm:pb-6 card-footer-md">
                    <Button onClick={() => verDetallePartido(partido.id)} variant="outline" className="w-full">
                      Ver detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            {partidos.filter((partido) => {
              const hoy = new Date().toISOString().split("T")[0]
              return partido.fecha === hoy
            }).length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No hay partidos programados para hoy</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="semana" className="space-y-6">
          <div className="card-grid-responsive">
            {partidos
              .filter((partido) => {
                const hoy = new Date()
                const fechaPartido = new Date(partido.fecha)
                const finSemana = new Date(hoy)
                finSemana.setDate(hoy.getDate() + 7)
                return fechaPartido >= hoy && fechaPartido <= finSemana
              })
              .map((partido) => (
                <Card key={partido.id} className="overflow-hidden">
                  <CardHeader className="pb-2 px-4 pt-4 sm:px-6 sm:pt-6 card-header-md">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base sm:text-lg truncate max-w-[70%]">{partido.titulo}</CardTitle>
                      <Badge variant="outline" className="bg-primary/10 text-primary text-xs whitespace-nowrap">
                        {partido.estado === "programado"
                          ? "Programado"
                          : partido.estado === "en_curso"
                            ? "En curso"
                            : partido.estado === "finalizado"
                              ? "Finalizado"
                              : "Cancelado"}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">{formatearFecha(partido.fecha)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 px-4 sm:px-6 card-content-md">
                    <div className="space-y-3">
                      <div className="flex items-center text-xs sm:text-sm">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">
                          {partido.recinto.nombre}, {partido.recinto.ciudad}
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span>{partido.hora} hrs</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span>Comisión: {formatearPrecio(partido.valorComision)}</span>
                      </div>
                    </div>

                    <div className="mt-4 border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium truncate max-w-[45%]">{partido.equipoLocal.nombre}</span>
                        <span className="text-sm font-medium truncate max-w-[45%]">
                          {partido.equipoVisitante.nombre}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex flex-wrap items-center">
                          <div className="flex -space-x-2 mr-1">
                            {partido.equipoLocal.jugadores.slice(0, 3).map((jugador) => (
                              <Avatar key={jugador.id} className="border-2 border-background w-7 h-7 sm:w-8 sm:h-8">
                                <AvatarImage src={jugador.avatar} alt={jugador.nombre} />
                                <AvatarFallback>{jugador.nombre.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                            {partido.equipoLocal.jugadores.length > 3 && (
                              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-xs">
                                +{partido.equipoLocal.jugadores.length - 3}
                              </div>
                            )}
                          </div>
                          {partido.equipoLocal.puestosDisponibles > 0 && (
                            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary ml-1">
                              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center">
                          {partido.equipoVisitante.puestosDisponibles > 0 && (
                            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary mr-1">
                              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          )}
                          <div className="flex -space-x-2">
                            {partido.equipoVisitante.jugadores.length > 3 && (
                              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-xs">
                                +{partido.equipoVisitante.jugadores.length - 3}
                              </div>
                            )}
                            {partido.equipoVisitante.jugadores
                              .slice(0, 3)
                              .reverse()
                              .map((jugador) => (
                                <Avatar key={jugador.id} className="border-2 border-background w-7 h-7 sm:w-8 sm:h-8">
                                  <AvatarImage src={jugador.avatar} alt={jugador.nombre} />
                                  <AvatarFallback>{jugador.nombre.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                        </div>
                      </div>

                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>{partido.equipoLocal.puestosDisponibles} disponibles</span>
                        <span>{partido.equipoVisitante.puestosDisponibles} disponibles</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 px-4 pb-4 sm:px-6 sm:pb-6 card-footer-md">
                    <Button onClick={() => verDetallePartido(partido.id)} variant="outline" className="w-full">
                      Ver detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            {partidos.filter((partido) => {
              const hoy = new Date()
              const fechaPartido = new Date(partido.fecha)
              const finSemana = new Date(hoy)
              finSemana.setDate(hoy.getDate() + 7)
              return fechaPartido >= hoy && fechaPartido <= finSemana
            }).length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No hay partidos programados para esta semana</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
