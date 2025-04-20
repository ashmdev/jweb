"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, UserPlus, UserMinus, Clock, Check, X, AlertCircle } from "lucide-react"
import type { Amigo, SolicitudAmistad } from "@/types/amigo"
import {
  getAmigos,
  getSolicitudesAmistad,
  enviarSolicitudAmistad,
  aceptarSolicitudAmistad,
  rechazarSolicitudAmistad,
  eliminarAmigo,
  buscarJugadores,
} from "@/services/amigos-service"

export default function MisAmigosPage() {
  const [amigos, setAmigos] = useState<Amigo[]>([])
  const [solicitudes, setSolicitudes] = useState<SolicitudAmistad[]>([])
  const [isLoadingAmigos, setIsLoadingAmigos] = useState(true)
  const [isLoadingSolicitudes, setIsLoadingSolicitudes] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Amigo[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [emailToInvite, setEmailToInvite] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const { toast } = useToast()

  // Cargar amigos y solicitudes al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingAmigos(true)
        setIsLoadingSolicitudes(true)
        setError(null)

        const [amigosData, solicitudesData] = await Promise.all([getAmigos(), getSolicitudesAmistad()])

        setAmigos(amigosData)
        setSolicitudes(solicitudesData)
      } catch (err) {
        console.error("Error al cargar datos:", err)
        setError("No se pudieron cargar los datos. Intenta de nuevo más tarde.")
      } finally {
        setIsLoadingAmigos(false)
        setIsLoadingSolicitudes(false)
      }
    }

    fetchData()
  }, [])

  // Función para buscar jugadores
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      const results = await buscarJugadores(searchQuery)

      // Filtrar amigos existentes de los resultados
      const amigoIds = amigos.map((amigo) => amigo.id)
      const filteredResults = results.filter((result) => !amigoIds.includes(result.id))

      setSearchResults(filteredResults)
    } catch (err) {
      console.error("Error al buscar jugadores:", err)
      toast({
        variant: "destructive",
        title: "Error al buscar",
        description: "No se pudieron buscar jugadores. Intenta de nuevo más tarde.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Función para enviar solicitud de amistad
  const handleSendInvite = async () => {
    if (!emailToInvite.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, ingresa un email válido.",
      })
      return
    }

    try {
      setIsInviting(true)
      const response = await enviarSolicitudAmistad(emailToInvite)

      toast({
        title: "Solicitud enviada",
        description: response.message,
      })

      setEmailToInvite("")
      setOpenDialog(false)
    } catch (err: any) {
      console.error("Error al enviar solicitud:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "No se pudo enviar la solicitud. Intenta de nuevo más tarde.",
      })
    } finally {
      setIsInviting(false)
    }
  }

  // Función para aceptar solicitud de amistad
  const handleAcceptRequest = async (id: number) => {
    try {
      const response = await aceptarSolicitudAmistad(id)

      // Actualizar la lista de solicitudes
      setSolicitudes((prevSolicitudes) => prevSolicitudes.filter((solicitud) => solicitud.id !== id))

      // Actualizar la lista de amigos (en una app real, obtendríamos el nuevo amigo de la respuesta)
      const newFriend = solicitudes.find((s) => s.id === id)
      if (newFriend) {
        const friendToAdd: Amigo = {
          id: newFriend.id,
          nombre: newFriend.nombre,
          email: newFriend.email,
          avatar: newFriend.avatar,
          estado: "offline",
          ultimaConexion: new Date().toISOString(),
          partidosJugados: 0,
        }
        setAmigos((prevAmigos) => [...prevAmigos, friendToAdd])
      }

      toast({
        title: "Solicitud aceptada",
        description: response.message,
      })
    } catch (err) {
      console.error("Error al aceptar solicitud:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo aceptar la solicitud. Intenta de nuevo más tarde.",
      })
    }
  }

  // Función para rechazar solicitud de amistad
  const handleRejectRequest = async (id: number) => {
    try {
      const response = await rechazarSolicitudAmistad(id)

      // Actualizar la lista de solicitudes
      setSolicitudes((prevSolicitudes) => prevSolicitudes.filter((solicitud) => solicitud.id !== id))

      toast({
        title: "Solicitud rechazada",
        description: response.message,
      })
    } catch (err) {
      console.error("Error al rechazar solicitud:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo rechazar la solicitud. Intenta de nuevo más tarde.",
      })
    }
  }

  // Función para eliminar amigo
  const handleRemoveFriend = async (id: number) => {
    try {
      const response = await eliminarAmigo(id)

      // Actualizar la lista de amigos
      setAmigos((prevAmigos) => prevAmigos.filter((amigo) => amigo.id !== id))

      toast({
        title: "Amigo eliminado",
        description: response.message,
      })
    } catch (err) {
      console.error("Error al eliminar amigo:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el amigo. Intenta de nuevo más tarde.",
      })
    }
  }

  // Función para enviar solicitud desde los resultados de búsqueda
  const handleSendRequestFromSearch = async (email: string) => {
    try {
      const response = await enviarSolicitudAmistad(email)

      toast({
        title: "Solicitud enviada",
        description: response.message,
      })

      // Actualizar los resultados de búsqueda para quitar el usuario al que se le envió la solicitud
      setSearchResults((prevResults) => prevResults.filter((result) => result.email !== email))
    } catch (err: any) {
      console.error("Error al enviar solicitud:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "No se pudo enviar la solicitud. Intenta de nuevo más tarde.",
      })
    }
  }

  // Función para formatear la fecha
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr)
    const ahora = new Date()
    const diferencia = ahora.getTime() - fecha.getTime()

    // Menos de 1 minuto
    if (diferencia < 60000) {
      return "hace un momento"
    }

    // Menos de 1 hora
    if (diferencia < 3600000) {
      const minutos = Math.floor(diferencia / 60000)
      return `hace ${minutos} ${minutos === 1 ? "minuto" : "minutos"}`
    }

    // Menos de 1 día
    if (diferencia < 86400000) {
      const horas = Math.floor(diferencia / 3600000)
      return `hace ${horas} ${horas === 1 ? "hora" : "horas"}`
    }

    // Menos de 7 días
    if (diferencia < 604800000) {
      const dias = Math.floor(diferencia / 86400000)
      return `hace ${dias} ${dias === 1 ? "día" : "días"}`
    }

    // Más de 7 días
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Renderizar esqueletos durante la carga
  const renderSkeletons = () => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mis Amigos</h1>
          <p className="text-muted-foreground">Administra tus amigos, envía solicitudes y acepta invitaciones</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
              <UserPlus className="mr-2 h-4 w-4" /> Agregar amigo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar amigo</DialogTitle>
              <DialogDescription>
                Ingresa el correo electrónico de la persona a la que quieres enviar una solicitud de amistad.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="correo@ejemplo.com"
                  value={emailToInvite}
                  onChange={(e) => setEmailToInvite(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSendInvite}
                disabled={isInviting || !emailToInvite.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                {isInviting ? (
                  <>
                    <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>Enviar solicitud</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="amigos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="amigos">Mis Amigos ({amigos.length})</TabsTrigger>
          <TabsTrigger value="solicitudes">Solicitudes ({solicitudes.length})</TabsTrigger>
          <TabsTrigger value="buscar">Buscar Jugadores</TabsTrigger>
        </TabsList>

        <TabsContent value="amigos" className="space-y-6">
          {error ? (
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
          ) : isLoadingAmigos ? (
            renderSkeletons()
          ) : amigos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tienes amigos aún</h3>
                <p className="text-sm text-muted-foreground mb-4">Agrega amigos para jugar partidos juntos</p>
                <Button onClick={() => setOpenDialog(true)} className="bg-primary hover:bg-primary/90">
                  <UserPlus className="mr-2 h-4 w-4" /> Agregar amigo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {amigos.map((amigo) => (
                <Card key={amigo.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={amigo.avatar} alt={amigo.nombre} />
                        <AvatarFallback>{amigo.nombre.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{amigo.nombre}</CardTitle>
                        <CardDescription className="text-xs">{amigo.email}</CardDescription>
                      </div>
                      <div className="ml-auto">
                        <Badge
                          variant={
                            amigo.estado === "online" ? "default" : amigo.estado === "jugando" ? "secondary" : "outline"
                          }
                          className={
                            amigo.estado === "online"
                              ? "bg-green-500 hover:bg-green-500/80"
                              : amigo.estado === "jugando"
                                ? "bg-primary hover:bg-primary/80"
                                : ""
                          }
                        >
                          {amigo.estado === "online"
                            ? "En línea"
                            : amigo.estado === "jugando"
                              ? "Jugando"
                              : "Desconectado"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Última conexión: {formatearFecha(amigo.ultimaConexion)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Partidos jugados: {amigo.partidosJugados}</span>
                        {amigo.posicionPreferida && <Badge variant="outline">{amigo.posicionPreferida}</Badge>}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <UserMinus className="mr-2 h-4 w-4" /> Eliminar amigo
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará a {amigo.nombre} de tu lista de amigos. Esta acción no se puede
                            deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveFriend(amigo.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="solicitudes" className="space-y-6">
          {error ? (
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
          ) : isLoadingSolicitudes ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : solicitudes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tienes solicitudes pendientes</h3>
                <p className="text-sm text-muted-foreground">Las solicitudes de amistad aparecerán aquí</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {solicitudes.map((solicitud) => (
                <Card key={solicitud.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={solicitud.avatar} alt={solicitud.nombre} />
                        <AvatarFallback>{solicitud.nombre.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{solicitud.nombre}</h3>
                        <p className="text-sm text-muted-foreground">{solicitud.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Solicitud recibida {formatearFecha(solicitud.fechaSolicitud)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          className="bg-green-500 hover:bg-green-500/90"
                          onClick={() => handleAcceptRequest(solicitud.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Aceptar</span>
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => handleRejectRequest(solicitud.id)}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Rechazar</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="buscar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buscar jugadores</CardTitle>
              <CardDescription>
                Busca jugadores por nombre o correo electrónico para enviarles solicitudes de amistad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por nombre o email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                  {isSearching ? (
                    <Skeleton className="h-4 w-4 rounded-full animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">Buscar</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {searchQuery && (
            <div className="space-y-4">
              {isSearching ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-9 w-24 rounded-md" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : searchResults.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
                    <p className="text-sm text-muted-foreground">Intenta con otro nombre o correo electrónico</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <Card key={result.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={result.avatar} alt={result.nombre} />
                            <AvatarFallback>{result.nombre.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">{result.nombre}</h3>
                            <p className="text-sm text-muted-foreground">{result.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant={
                                  result.estado === "online"
                                    ? "default"
                                    : result.estado === "jugando"
                                      ? "secondary"
                                      : "outline"
                                }
                                className={
                                  result.estado === "online"
                                    ? "bg-green-500 hover:bg-green-500/80"
                                    : result.estado === "jugando"
                                      ? "bg-primary hover:bg-primary/80"
                                      : ""
                                }
                              >
                                {result.estado === "online"
                                  ? "En línea"
                                  : result.estado === "jugando"
                                    ? "Jugando"
                                    : "Desconectado"}
                              </Badge>
                              {result.posicionPreferida && <Badge variant="outline">{result.posicionPreferida}</Badge>}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleSendRequestFromSearch(result.email)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Enviar solicitud</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
