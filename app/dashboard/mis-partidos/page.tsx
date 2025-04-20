"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarCheck, CalendarX, Clock, MapPin, Users, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getUser } from "@/lib/auth"
import { useState } from "react"
import CrearPartidoModal from "@/components/partidos/crear-partido-modal"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function MisPartidosPage() {
  const [showCrearPartidoModal, setShowCrearPartidoModal] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  // Obtener el usuario o usar un usuario demo si no existe
  const user = getUser() || {
    id: 0,
    name: "Usuario Demo",
    email: "demo@joinfutbol.com",
    role: "jugador" as const,
  }

  // Datos de ejemplo para partidos
  const partidosProximos = [
    {
      id: 1,
      titulo: "Partido amistoso",
      fecha: new Date(Date.now() + 86400000), // Mañana
      hora: "18:00 - 20:00",
      lugar: "Cancha Municipal Norte",
      jugadores: "10/14",
      estado: "confirmado",
    },
    {
      id: 2,
      titulo: "Liga Barrial - Jornada 3",
      fecha: new Date(Date.now() + 3 * 86400000), // En 3 días
      hora: "19:00 - 21:00",
      lugar: "Complejo Deportivo El Parque",
      jugadores: "12/14",
      estado: "pendiente",
    },
    {
      id: 3,
      titulo: "Partido entre amigos",
      fecha: new Date(Date.now() + 5 * 86400000), // En 5 días
      hora: "16:00 - 18:00",
      lugar: "Cancha Sintética Los Pinos",
      jugadores: "8/14",
      estado: "pendiente",
    },
  ]

  const partidosPasados = [
    {
      id: 4,
      titulo: "Liga Barrial - Jornada 2",
      fecha: new Date(Date.now() - 7 * 86400000), // Hace 7 días
      hora: "19:00 - 21:00",
      lugar: "Complejo Deportivo El Parque",
      resultado: "3 - 2",
      estado: "victoria",
    },
    {
      id: 5,
      titulo: "Partido amistoso",
      fecha: new Date(Date.now() - 14 * 86400000), // Hace 14 días
      hora: "18:00 - 20:00",
      lugar: "Cancha Municipal Norte",
      resultado: "2 - 2",
      estado: "empate",
    },
    {
      id: 6,
      titulo: "Liga Barrial - Jornada 1",
      fecha: new Date(Date.now() - 21 * 86400000), // Hace 21 días
      hora: "19:00 - 21:00",
      lugar: "Complejo Deportivo El Parque",
      resultado: "1 - 3",
      estado: "derrota",
    },
  ]

  const partidosCancelados = [
    {
      id: 7,
      titulo: "Partido entre amigos",
      fecha: new Date(Date.now() - 10 * 86400000), // Hace 10 días
      hora: "16:00 - 18:00",
      lugar: "Cancha Sintética Los Pinos",
      motivo: "Lluvia intensa",
    },
    {
      id: 8,
      titulo: "Partido de práctica",
      fecha: new Date(Date.now() - 5 * 86400000), // Hace 5 días
      hora: "17:00 - 19:00",
      lugar: "Estadio Municipal",
      motivo: "Falta de jugadores",
    },
  ]

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Mis Partidos</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Administra tus partidos, revisa tu historial y crea nuevos encuentros
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 w-full md:w-auto"
          onClick={() => setShowCrearPartidoModal(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Crear nuevo partido
        </Button>
      </div>

      <Tabs defaultValue="proximos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="proximos">Próximos</TabsTrigger>
          <TabsTrigger value="pasados">Historial</TabsTrigger>
          <TabsTrigger value="cancelados">Cancelados</TabsTrigger>
        </TabsList>

        <TabsContent value="proximos" className="space-y-6">
          {partidosProximos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tienes partidos próximos</h3>
                <p className="text-sm text-muted-foreground mb-4">Crea un nuevo partido o únete a uno existente</p>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" /> Crear partido
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {partidosProximos.map((partido) => (
                <Card key={partido.id} className="overflow-hidden">
                  <CardHeader className="pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <CardTitle className="text-base sm:text-lg">{partido.titulo}</CardTitle>
                      <Badge variant={partido.estado === "confirmado" ? "default" : "outline"}>
                        {partido.estado === "confirmado" ? "Confirmado" : "Pendiente"}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">
                      {partido.fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 px-4 sm:px-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-xs sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span>{partido.hora}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span className="line-clamp-1">{partido.lugar}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span>{partido.jugadores} jugadores</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">
                        Ver detalles
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm px-2 sm:px-4"
                      >
                        {partido.estado === "confirmado" ? "Confirmar asistencia" : "Unirse"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pasados" className="space-y-6">
          {partidosPasados.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tienes historial de partidos</h3>
                <p className="text-sm text-muted-foreground">Tu historial de partidos aparecerá aquí</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {partidosPasados.map((partido) => (
                <Card key={partido.id} className="overflow-hidden">
                  <CardHeader className="pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <CardTitle className="text-base sm:text-lg">{partido.titulo}</CardTitle>
                      <Badge
                        variant={
                          partido.estado === "victoria"
                            ? "default"
                            : partido.estado === "empate"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {partido.estado === "victoria"
                          ? "Victoria"
                          : partido.estado === "empate"
                            ? "Empate"
                            : "Derrota"}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">
                      {partido.fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 px-4 sm:px-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-xs sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span>{partido.hora}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span className="line-clamp-1">{partido.lugar}</span>
                      </div>
                      <div className="flex items-center justify-center mt-2">
                        <div className="text-2xl font-bold">{partido.resultado}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">
                        Ver detalles
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">
                        Ver estadísticas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelados" className="space-y-6">
          {partidosCancelados.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CalendarX className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tienes partidos cancelados</h3>
                <p className="text-sm text-muted-foreground">Los partidos cancelados aparecerán aquí</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {partidosCancelados.map((partido) => (
                <Card key={partido.id} className="overflow-hidden">
                  <CardHeader className="pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <CardTitle className="text-base sm:text-lg">{partido.titulo}</CardTitle>
                      <Badge variant="destructive">Cancelado</Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">
                      {partido.fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 px-4 sm:px-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-xs sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span>{partido.hora}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span className="line-clamp-1">{partido.lugar}</span>
                      </div>
                      <div className="flex items-center text-sm text-destructive">
                        <span>Motivo: {partido.motivo}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">
                        Ver detalles
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">
                        Reprogramar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {showCrearPartidoModal && (
        <CrearPartidoModal
          open={showCrearPartidoModal}
          onOpenChange={setShowCrearPartidoModal}
          onSuccess={() => {
            // Aquí iría la lógica para recargar los partidos
            toast({
              title: "Partido creado",
              description: "El partido ha sido creado exitosamente",
            })
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
