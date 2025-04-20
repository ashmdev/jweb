"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, MapPin, DollarSign, UserPlus, ArrowLeft, Share2, UserMinus } from "lucide-react"
import type { Partido } from "@/types/partido"
import { getPartidoById } from "@/services/partidos-service"
import { getBalanceCreditos } from "@/services/creditos-service"
import { verificarParticipacion, cancelarParticipacion } from "@/services/partido-join-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import ModalReservarPosicion from "@/components/partidos/modal-reservar-posicion"
import type { BalanceCredito } from "@/types/credito"
import ModalSeleccionarEquipo from "@/components/partidos/modal-seleccionar-equipo"
import { SeccionComentarios } from "@/components/comentarios/seccion-comentarios"

export default function DetallePartidoPage({ params }: { params: { id: string } }) {
  const [partido, setPartido] = useState<Partido | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [balanceCreditos, setBalanceCreditos] = useState<BalanceCredito | null>(null)
  const [isLoadingCreditos, setIsLoadingCreditos] = useState(false)
  const [showReservarModal, setShowReservarModal] = useState(false)
  const [posicionSeleccionada, setPosicionSeleccionada] = useState<{
    equipoId: number
    equipoNombre: string
    posicion: string
    costo: number
  } | null>(null)
  const [participacion, setParticipacion] = useState<{
    participando: boolean
    equipoId?: number
    posicion?: string
  }>({ participando: false })
  const [isCancelando, setIsCancelando] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [showSeleccionarEquipoModal, setShowSeleccionarEquipoModal] = useState(false)

  useEffect(() => {
    const fetchPartido = async () => {
      try {
        setIsLoading(true)
        const data = await getPartidoById(Number.parseInt(params.id))
        setPartido(data)
        setError(null)
      } catch (err) {
        console.error("Error al cargar partido:", err)
        setError("No se pudo cargar la información del partido. Intenta de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPartido()
  }, [params.id])

  // Verificar si el usuario ya está participando en el partido
  useEffect(() => {
    const checkParticipacion = async () => {
      try {
        const data = await verificarParticipacion(Number.parseInt(params.id))
        setParticipacion(data)
      } catch (err) {
        console.error("Error al verificar participación:", err)
      }
    }

    if (params.id) {
      checkParticipacion()
    }
  }, [params.id])

  // Función para cargar los créditos del usuario
  const fetchCreditos = async () => {
    try {
      setIsLoadingCreditos(true)
      const data = await getBalanceCreditos()
      setBalanceCreditos(data)
      return data
    } catch (err) {
      console.error("Error al cargar créditos:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar tus créditos. Intenta de nuevo más tarde.",
      })
      return null
    } finally {
      setIsLoadingCreditos(false)
    }
  }

  // Función para unirse a un equipo
  const handleUnirseEquipo = async (equipoId: number, equipoNombre: string, posicion: string) => {
    // Verificar si el usuario ya está participando
    if (participacion.participando) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ya estás participando en este partido",
      })
      return
    }

    // Usar el valorComision del partido como costo
    const costo = partido?.valorComision || 0

    // Cargar los créditos si aún no se han cargado
    let creditos = balanceCreditos
    if (!creditos) {
      creditos = await fetchCreditos()
    }

    // Guardar la posición seleccionada
    setPosicionSeleccionada({
      equipoId,
      equipoNombre,
      posicion,
      costo,
    })

    // Mostrar el modal
    setShowReservarModal(true)
  }

  // Función para cancelar participación
  const handleCancelarParticipacion = async (jugadorId?: number) => {
    try {
      setIsCancelando(true)

      // Intentar cancelar la participación
      const response = await cancelarParticipacion(Number.parseInt(params.id), jugadorId)

      toast({
        title: "Participación cancelada",
        description: response.message,
      })

      // Actualizar el estado de participación
      if (!jugadorId) {
        setParticipacion({ participando: false })
      }

      // Recargar el partido para mostrar los cambios
      try {
        const data = await getPartidoById(Number.parseInt(params.id))
        setPartido(data)
      } catch (err) {
        console.error("Error al recargar partido después de cancelar:", err)
        // No mostramos este error al usuario ya que la cancelación fue exitosa
      }
    } catch (error: any) {
      console.error("Error al cancelar participación:", error)

      // Mostrar un mensaje de error más descriptivo
      toast({
        variant: "destructive",
        title: "Error al cancelar participación",
        description:
          typeof error.message === "string"
            ? error.message
            : "No se pudo cancelar la participación. Intenta de nuevo más tarde.",
      })
    } finally {
      setIsCancelando(false)
    }
  }

  // Función para actualizar después de unirse
  const handleUnirseExitoso = async () => {
    // Actualizar el estado de participación
    setParticipacion({
      participando: true,
      equipoId: posicionSeleccionada?.equipoId,
      posicion: posicionSeleccionada?.posicion,
    })

    // Recargar el partido para mostrar los cambios
    try {
      const data = await getPartidoById(Number.parseInt(params.id))
      setPartido(data)
    } catch (err) {
      console.error("Error al recargar partido:", err)
    }
  }

  // Función para formatear la fecha
  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return ""
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

  // Renderizar esqueletos durante la carga
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar mensaje de error
  if (error || !partido) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Detalle del Partido</h1>
        </div>

        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "No se encontró el partido solicitado"}</AlertDescription>
        </Alert>

        <div className="mt-4">
          <Button onClick={() => router.push("/dashboard/partidos")}>Volver a la lista de partidos</Button>
        </div>
      </div>
    )
  }

  // Determinar si el usuario está en el equipo local o visitante
  const isInLocalTeam = participacion.participando && participacion.equipoId === partido.equipoLocal.id
  const isInVisitanteTeam = participacion.participando && participacion.equipoId === partido.equipoVisitante.id

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{partido.titulo}</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Partido</CardTitle>
              <CardDescription>Organizado por {partido.creador.nombre}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Fecha</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{formatearFecha(partido.fecha)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Hora</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{partido.hora} hrs</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Ubicación</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{partido.recinto.nombre}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {partido.recinto.direccion}, {partido.recinto.ciudad}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Comisión</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {formatearPrecio(partido.valorComision)} por jugador
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipos</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="local">
                <TabsList className="mb-4">
                  <TabsTrigger value="local">{partido.equipoLocal.nombre}</TabsTrigger>
                  <TabsTrigger value="visitante">{partido.equipoVisitante.nombre}</TabsTrigger>
                </TabsList>

                <TabsContent value="local">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Jugadores ({partido.equipoLocal.jugadores.length})</h3>
                      <Badge variant="outline">{partido.equipoLocal.puestosDisponibles} puestos disponibles</Badge>
                    </div>

                    <div className="space-y-2">
                      {partido.equipoLocal.jugadores.map((jugador) => (
                        <div
                          key={jugador.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                        >
                          <div className="flex items-center">
                            <Avatar className="mr-2 sm:mr-3 h-8 w-8 sm:h-10 sm:w-10">
                              <AvatarImage src={jugador.avatar} alt={jugador.nombre} />
                              <AvatarFallback>{jugador.nombre.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm sm:text-base">{jugador.nombre}</p>
                              <p className="text-xs text-muted-foreground capitalize">{jugador.posicion}</p>
                            </div>
                          </div>

                          {/* Mostrar botón de cancelar si es el usuario actual o un amigo invitado */}
                          {(isInLocalTeam || (participacion.participando && jugador.id !== 999)) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive hover:bg-destructive/10"
                              onClick={() => handleCancelarParticipacion(jugador.id !== 999 ? jugador.id : undefined)}
                              disabled={isCancelando}
                            >
                              <UserMinus className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
                        </div>
                      ))}

                      {partido.equipoLocal.puestosDisponibles > 0 && !participacion.participando && (
                        <div className="flex items-center justify-center p-4 rounded-md border border-dashed border-muted-foreground/50">
                          <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() =>
                              handleUnirseEquipo(
                                partido.equipoLocal.id,
                                partido.equipoLocal.nombre,
                                "mediocampista", // Ejemplo de posición, en una app real podría ser dinámica
                              )
                            }
                          >
                            <UserPlus className="h-4 w-4" />
                            Unirse a este equipo
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="visitante">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Jugadores ({partido.equipoVisitante.jugadores.length})</h3>
                      <Badge variant="outline">{partido.equipoVisitante.puestosDisponibles} puestos disponibles</Badge>
                    </div>

                    <div className="space-y-2">
                      {partido.equipoVisitante.jugadores.map((jugador) => (
                        <div
                          key={jugador.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                        >
                          <div className="flex items-center">
                            <Avatar className="mr-2 sm:mr-3 h-8 w-8 sm:h-10 sm:w-10">
                              <AvatarImage src={jugador.avatar} alt={jugador.nombre} />
                              <AvatarFallback>{jugador.nombre.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm sm:text-base">{jugador.nombre}</p>
                              <p className="text-xs text-muted-foreground capitalize">{jugador.posicion}</p>
                            </div>
                          </div>

                          {/* Mostrar botón de cancelar si es el usuario actual o un amigo invitado */}
                          {(isInVisitanteTeam || (participacion.participando && jugador.id !== 999)) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive hover:bg-destructive/10"
                              onClick={() => handleCancelarParticipacion(jugador.id !== 999 ? jugador.id : undefined)}
                              disabled={isCancelando}
                            >
                              <UserMinus className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
                        </div>
                      ))}

                      {partido.equipoVisitante.puestosDisponibles > 0 && !participacion.participando && (
                        <div className="flex items-center justify-center p-4 rounded-md border border-dashed border-muted-foreground/50">
                          <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() =>
                              handleUnirseEquipo(
                                partido.equipoVisitante.id,
                                partido.equipoVisitante.nombre,
                                "delantero", // Ejemplo de posición, en una app real podría ser dinámica
                              )
                            }
                          >
                            <UserPlus className="h-4 w-4" />
                            Unirse a este equipo
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Sección de comentarios */}
          <SeccionComentarios partidoId={Number(params.id)} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {participacion.participando ? (
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={() => handleCancelarParticipacion()}
                  disabled={isCancelando}
                >
                  <UserMinus className="h-4 w-4" />
                  {isCancelando ? "Cancelando..." : "Cancelar participación"}
                </Button>
              ) : (
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setShowSeleccionarEquipoModal(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Unirse al partido
                </Button>
              )}

              <Button variant="outline" className="w-full gap-2">
                <Share2 className="h-4 w-4" />
                Compartir partido
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recinto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-40 w-full overflow-hidden rounded-md">
                <Image
                  src={partido.recinto.imagen || "/placeholder.svg?height=160&width=320"}
                  alt={partido.recinto.nombre}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="font-medium">{partido.recinto.nombre}</h3>
                <p className="text-sm text-muted-foreground">{partido.recinto.direccion}</p>
                <p className="text-sm text-muted-foreground">{partido.recinto.ciudad}</p>
              </div>

              <Button variant="outline" className="w-full">
                Ver información del recinto
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Visualización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => router.push(`/dashboard/partidos/${params.id}/cancha`)}
              >
                <MapPin className="h-4 w-4" />
                Ver la cancha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para reservar posición */}
      {showReservarModal && posicionSeleccionada && (
        <ModalReservarPosicion
          open={showReservarModal}
          onOpenChange={setShowReservarModal}
          partidoId={Number(params.id)}
          equipoId={posicionSeleccionada.equipoId}
          equipoNombre={posicionSeleccionada.equipoNombre}
          posicion={posicionSeleccionada.posicion}
          costo={posicionSeleccionada.costo}
          balanceCreditos={balanceCreditos}
          onSuccess={handleUnirseExitoso}
        />
      )}

      {/* Modal para seleccionar equipo */}
      {partido && (
        <ModalSeleccionarEquipo
          open={showSeleccionarEquipoModal}
          onOpenChange={setShowSeleccionarEquipoModal}
          partido={partido}
          onSeleccionarEquipo={handleUnirseEquipo}
        />
      )}
    </div>
  )
}
