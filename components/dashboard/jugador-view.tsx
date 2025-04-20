"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, MapPin, DollarSign, UserPlus, CalendarIcon } from "lucide-react"
import type { Partido } from "@/types/partido"
import { getPartidos } from "@/services/partidos-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import FieldPreview from "@/components/dashboard/field-preview"
import type { User } from "@/lib/auth"

interface JugadorViewProps {
  user: User
}

export default function JugadorView({ user }: JugadorViewProps) {
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPartido, setSelectedPartido] = useState<Partido | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        setIsLoading(true)
        const data = await getPartidos()
        setPartidos(data)

        // Seleccionar el primer partido por defecto
        if (data.length > 0) {
          setSelectedPartido(data[0])
        }

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

  // Función para seleccionar un partido y mostrar su vista previa
  const handleSelectPartido = (partido: Partido) => {
    setSelectedPartido(partido)

    // En dispositivos móviles, hacer scroll a la vista previa
    if (window.innerWidth < 1024) {
      const previewElement = document.querySelector(".preview-container")
      if (previewElement) {
        setTimeout(() => {
          previewElement.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    }
  }

  // Renderizar esqueletos durante la carga
  if (isLoading) {
    return (
      <div className="py-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-md" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-md" />
              ))}
            </div>
          </div>
          <Skeleton className="h-[600px] w-full rounded-md" />
        </div>
      </div>
    )
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <div className="py-6">
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
    <div className="py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bienvenido, {user.name}</h1>
        <p className="text-muted-foreground">Encuentra partidos, únete a equipos y disfruta del fútbol.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Columna izquierda: Lista de partidos (scrolleable) */}
        <div className="h-[calc(100vh-220px)] overflow-y-auto pr-3 pb-6 scrollable-container partido-list-container">
          <Tabs defaultValue="proximos" className="w-full">
            <TabsList className="mb-4 w-full grid grid-cols-3 sticky top-0 z-10 bg-background">
              <TabsTrigger value="proximos">Próximos</TabsTrigger>
              <TabsTrigger value="mis-partidos">Mis Partidos</TabsTrigger>
              <TabsTrigger value="todos">Todos</TabsTrigger>
            </TabsList>

            <TabsContent value="proximos" className="space-y-4">
              {partidos
                .filter((partido) => {
                  const fechaPartido = new Date(partido.fecha)
                  const hoy = new Date()
                  return fechaPartido >= hoy
                })
                .slice(0, 5)
                .map((partido) => (
                  <Card
                    key={partido.id}
                    className={`overflow-hidden cursor-pointer transition-all hover:border-primary ${
                      selectedPartido?.id === partido.id ? "border-primary border-2" : ""
                    }`}
                    onClick={() => handleSelectPartido(partido)}
                  >
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
                                  <AvatarImage src={jugador.avatar || "/placeholder.svg"} alt={jugador.nombre} />
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
                                    <AvatarImage src={jugador.avatar || "/placeholder.svg"} alt={jugador.nombre} />
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
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          verDetallePartido(partido.id)
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Ver detalles
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              {partidos.filter((partido) => {
                const fechaPartido = new Date(partido.fecha)
                const hoy = new Date()
                return fechaPartido >= hoy
              }).length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No hay partidos próximos</p>
                    <Button className="mt-4" onClick={() => router.push("/dashboard/partidos")}>
                      Buscar partidos
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="mis-partidos" className="space-y-4">
              {/* Aquí iría la lógica para mostrar solo los partidos del usuario */}
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No estás inscrito en ningún partido</p>
                  <Button className="mt-4" onClick={() => router.push("/dashboard/partidos")}>
                    Buscar partidos
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="todos" className="space-y-4">
              {partidos.slice(0, 5).map((partido) => (
                <Card
                  key={partido.id}
                  className={`overflow-hidden cursor-pointer transition-all hover:border-primary ${
                    selectedPartido?.id === partido.id ? "border-primary border-2" : ""
                  }`}
                  onClick={() => handleSelectPartido(partido)}
                >
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
                                <AvatarImage src={jugador.avatar || "/placeholder.svg"} alt={jugador.nombre} />
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
                                  <AvatarImage src={jugador.avatar || "/placeholder.svg"} alt={jugador.nombre} />
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
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        verDetallePartido(partido.id)
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Ver detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {partidos.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No hay partidos disponibles</p>
                  </CardContent>
                </Card>
              )}
              {partidos.length > 0 && (
                <div className="text-center">
                  <Button variant="outline" onClick={() => router.push("/dashboard/partidos")}>
                    Ver todos los partidos
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Columna derecha: Vista previa del campo (fija) */}
        <div className="space-y-4 lg:sticky lg:top-6 self-start preview-container">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>Vista previa de la cancha</CardTitle>
              <CardDescription>
                {selectedPartido
                  ? `${selectedPartido.titulo} - ${formatearFecha(selectedPartido.fecha)} ${selectedPartido.hora} hrs`
                  : "Selecciona un partido para ver la distribución de jugadores"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {selectedPartido ? (
                <FieldPreview partido={selectedPartido} />
              ) : (
                <div className="flex items-center justify-center h-[500px] bg-muted/20">
                  <div className="text-center p-6">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">
                      Selecciona un partido para ver la distribución de jugadores
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            {selectedPartido && (
              <CardFooter className="p-4 border-t">
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">{selectedPartido.equipoLocal.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{selectedPartido.equipoVisitante.nombre}</span>
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>

          {selectedPartido && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Información del partido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Recinto</h4>
                    <p className="text-sm text-muted-foreground">{selectedPartido.recinto.nombre}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Modalidad</h4>
                    <p className="text-sm text-muted-foreground">{selectedPartido.modalidad || "7vs7"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Puestos disponibles</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedPartido.equipoLocal.puestosDisponibles +
                        selectedPartido.equipoVisitante.puestosDisponibles}{" "}
                      puestos
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Comisión</h4>
                    <p className="text-sm text-muted-foreground">{formatearPrecio(selectedPartido.valorComision)}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    className="w-full"
                    onClick={() => router.push(`/dashboard/partidos/${selectedPartido.id}/cancha`)}
                  >
                    Ver cancha completa
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
