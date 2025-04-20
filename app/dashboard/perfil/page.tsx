"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Shield } from "lucide-react"
import { getUser } from "@/lib/auth"
import { Switch } from "@/components/ui/switch"
// Importar los tipos y servicios necesarios para los créditos
import { useState, useEffect } from "react"
import type { BalanceCredito } from "@/types/credito"
import { getBalanceCreditos, recargarCreditos } from "@/services/creditos-service"
import { CreditCard, Wallet, ArrowUpCircle, Clock, CheckCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function PerfilPage() {
  // Obtener el usuario o usar un usuario demo si no existe
  const user = getUser() || {
    id: 0,
    name: "Usuario Demo",
    email: "demo@joinfutbol.com",
    role: "jugador" as const,
  }

  // Agregar el estado para los créditos dentro del componente PerfilPage
  const [balanceCreditos, setBalanceCreditos] = useState<BalanceCredito | null>(null)
  const [isLoadingCreditos, setIsLoadingCreditos] = useState(false)
  const [errorCreditos, setErrorCreditos] = useState<string | null>(null)
  const [montoRecarga, setMontoRecarga] = useState<string>("5000")
  const [metodoRecarga, setMetodoRecarga] = useState<"tarjeta" | "transferencia" | "efectivo">("tarjeta")
  const [isRecargando, setIsRecargando] = useState(false)
  const [showRecargarForm, setShowRecargarForm] = useState(false)
  const { toast } = useToast()

  // Agregar el efecto para cargar los créditos al montar el componente
  useEffect(() => {
    const fetchCreditos = async () => {
      try {
        setIsLoadingCreditos(true)
        setErrorCreditos(null)
        const data = await getBalanceCreditos()
        setBalanceCreditos(data)
      } catch (err) {
        console.error("Error al cargar créditos:", err)
        setErrorCreditos("No se pudieron cargar los créditos. Intenta de nuevo más tarde.")
      } finally {
        setIsLoadingCreditos(false)
      }
    }

    fetchCreditos()
  }, [])

  // Agregar la función para manejar la recarga de créditos
  const handleRecargarCreditos = async () => {
    try {
      setIsRecargando(true)
      const monto = Number.parseInt(montoRecarga, 10)

      if (isNaN(monto) || monto <= 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "El monto debe ser un número positivo",
        })
        return
      }

      const nuevoCredito = await recargarCreditos(monto, metodoRecarga)

      // Actualizar el balance de créditos
      if (balanceCreditos) {
        const nuevoBalance = {
          ...balanceCreditos,
          total: balanceCreditos.total + monto,
          disponible:
            nuevoCredito.estado === "completado" ? balanceCreditos.disponible + monto : balanceCreditos.disponible,
          pendiente:
            nuevoCredito.estado === "pendiente" ? balanceCreditos.pendiente + monto : balanceCreditos.pendiente,
          historial: [nuevoCredito, ...balanceCreditos.historial],
        }
        setBalanceCreditos(nuevoBalance)
      }

      toast({
        title: "Recarga procesada",
        description:
          nuevoCredito.estado === "completado"
            ? "Tu recarga ha sido procesada correctamente"
            : "Tu recarga está pendiente de confirmación",
      })

      setShowRecargarForm(false)
      setMontoRecarga("5000")
    } catch (err: any) {
      console.error("Error al recargar créditos:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "No se pudo procesar la recarga. Intenta de nuevo más tarde.",
      })
    } finally {
      setIsRecargando(false)
    }
  }

  // Función para formatear el precio
  const formatearPrecio = (precio: number) => {
    return precio.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    })
  }

  // Función para formatear la fecha
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Perfil de Usuario</h1>
          <p className="text-muted-foreground">Administra tu información personal y preferencias de cuenta</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">Guardar cambios</Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr] sm:grid-cols-1">
        <Card className="w-full">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name} />
              <AvatarFallback className="text-2xl bg-primary text-white">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold break-words w-full">{user.name}</h2>
            <p className="text-sm text-muted-foreground mb-4 break-words w-full">{user.email}</p>
            <p className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full mb-4 break-words">
              {user.role === "administrador"
                ? "Administrador"
                : user.role === "administrador-de-recinto-deportivo"
                  ? "Admin. Recinto"
                  : "Jugador"}
            </p>
            <Button variant="outline" className="w-full">
              Cambiar foto
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="personal">Información Personal</TabsTrigger>
            <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
            <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
            <TabsTrigger value="creditos">Créditos</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tu información personal y de contacto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="nombre" placeholder="Tu nombre" defaultValue={user.name} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" placeholder="tu@email.com" defaultValue={user.email} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="telefono" placeholder="+1 234 567 890" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="ubicacion" placeholder="Ciudad, País" className="pl-10" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Juego</CardTitle>
                <CardDescription>Configura tus preferencias para partidos y equipos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="posicion">Posición preferida</Label>
                    <select
                      id="posicion"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Selecciona una posición</option>
                      <option value="portero">Portero</option>
                      <option value="defensa">Defensa</option>
                      <option value="mediocampista">Mediocampista</option>
                      <option value="delantero">Delantero</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nivel">Nivel de juego</Label>
                    <select
                      id="nivel"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Selecciona un nivel</option>
                      <option value="principiante">Principiante</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                      <option value="profesional">Profesional</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cuenta" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seguridad de la Cuenta</CardTitle>
                <CardDescription>Actualiza tu contraseña y configura la seguridad de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="current-password" type="password" className="pl-10" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva contraseña</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90">Actualizar contraseña</Button>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sesiones activas</h3>
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Este dispositivo</p>
                        <p className="text-sm text-muted-foreground">Última actividad: Ahora</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Cerrar sesión
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eliminar cuenta</CardTitle>
                <CardDescription>Eliminar permanentemente tu cuenta y todos tus datos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Una vez que elimines tu cuenta, todos tus datos serán eliminados permanentemente. Esta acción no se
                  puede deshacer.
                </p>
                <Button variant="destructive">Eliminar cuenta</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificaciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>Configura cómo y cuándo quieres recibir notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificaciones por correo electrónico</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-partidos">Partidos</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibe notificaciones sobre nuevos partidos y actualizaciones
                        </p>
                      </div>
                      <Switch id="email-partidos" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-amigos">Amigos</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibe notificaciones cuando alguien te agrega como amigo
                        </p>
                      </div>
                      <Switch id="email-amigos" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-marketing">Marketing</Label>
                        <p className="text-sm text-muted-foreground">Recibe noticias y ofertas especiales</p>
                      </div>
                      <Switch id="email-marketing" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificaciones push</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-partidos">Partidos</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibe notificaciones sobre nuevos partidos y actualizaciones
                        </p>
                      </div>
                      <Switch id="push-partidos" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-mensajes">Mensajes</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibe notificaciones cuando recibes un nuevo mensaje
                        </p>
                      </div>
                      <Switch id="push-mensajes" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creditos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mis Créditos</CardTitle>
                <CardDescription>Administra tus créditos y realiza recargas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingCreditos ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : errorCreditos ? (
                  <div className="p-4 border border-destructive rounded-md text-destructive">
                    <p>{errorCreditos}</p>
                    <Button onClick={() => window.location.reload()} variant="outline" className="mt-2">
                      Intentar de nuevo
                    </Button>
                  </div>
                ) : balanceCreditos ? (
                  <>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Wallet className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">Total</h3>
                        </div>
                        <p className="text-2xl font-bold">{formatearPrecio(balanceCreditos.total)}</p>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <h3 className="font-medium">Disponible</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatearPrecio(balanceCreditos.disponible)}
                        </p>
                      </div>
                      <div className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          <h3 className="font-medium">Pendiente</h3>
                        </div>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                          {formatearPrecio(balanceCreditos.pendiente)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Uso de créditos</h3>
                      <Progress value={(balanceCreditos.disponible / balanceCreditos.total) * 100} className="h-2" />
                      <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                        <span>Disponible: {formatearPrecio(balanceCreditos.disponible)}</span>
                        <span>Total: {formatearPrecio(balanceCreditos.total)}</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => setShowRecargarForm(!showRecargarForm)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <ArrowUpCircle className="mr-2 h-4 w-4" />
                        Recargar créditos
                      </Button>
                    </div>

                    {showRecargarForm && (
                      <div className="border rounded-lg p-4 mt-4">
                        <h3 className="text-lg font-medium mb-4">Recargar créditos</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="monto">Monto a recargar</Label>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                              <Input
                                id="monto"
                                type="number"
                                min="1000"
                                step="1000"
                                value={montoRecarga}
                                onChange={(e) => setMontoRecarga(e.target.value)}
                                className="pl-8"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Método de pago</Label>
                            <RadioGroup
                              value={metodoRecarga}
                              onValueChange={(value) =>
                                setMetodoRecarga(value as "tarjeta" | "transferencia" | "efectivo")
                              }
                              className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
                            >
                              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent">
                                <RadioGroupItem value="tarjeta" id="tarjeta" />
                                <Label htmlFor="tarjeta" className="flex items-center cursor-pointer">
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Tarjeta de crédito
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent">
                                <RadioGroupItem value="transferencia" id="transferencia" />
                                <Label htmlFor="transferencia" className="flex items-center cursor-pointer">
                                  <ArrowUpCircle className="mr-2 h-4 w-4" />
                                  Transferencia
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent">
                                <RadioGroupItem value="efectivo" id="efectivo" />
                                <Label htmlFor="efectivo" className="flex items-center cursor-pointer">
                                  <Wallet className="mr-2 h-4 w-4" />
                                  Efectivo
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setShowRecargarForm(false)}>
                              Cancelar
                            </Button>
                            <Button
                              onClick={handleRecargarCreditos}
                              disabled={isRecargando || !montoRecarga || Number.parseInt(montoRecarga, 10) <= 0}
                              className="bg-primary hover:bg-primary/90"
                            >
                              {isRecargando ? (
                                <>
                                  <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                                  Procesando...
                                </>
                              ) : (
                                <>Recargar</>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Vista alternativa para móviles */}
                    <div className="mt-6 sm:hidden">
                      <h3 className="text-lg font-medium mb-4">Historial de recargas</h3>
                      <div className="space-y-4">
                        {balanceCreditos.historial.map((credito) => (
                          <div key={credito.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{formatearPrecio(credito.monto)}</span>
                              <Badge
                                variant={
                                  credito.estado === "completado"
                                    ? "default"
                                    : credito.estado === "pendiente"
                                      ? "outline"
                                      : "destructive"
                                }
                                className={credito.estado === "completado" ? "bg-green-500 hover:bg-green-500/80" : ""}
                              >
                                {credito.estado === "completado"
                                  ? "Completado"
                                  : credito.estado === "pendiente"
                                    ? "Pendiente"
                                    : "Fallido"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <div className="flex justify-between">
                                <span>Fecha:</span>
                                <span>{formatearFecha(credito.fecha)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Método:</span>
                                <span className="capitalize">{credito.metodo}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Referencia:</span>
                                <span>{credito.referencia}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tabla para pantallas más grandes */}
                    <div className="mt-6 hidden sm:block">
                      <h3 className="text-lg font-medium mb-4">Historial de recargas</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto max-w-[calc(100vw-3rem)] md:max-w-full">
                          <table className="w-full min-w-[650px]">
                            <thead>
                              <tr className="bg-muted">
                                <th className="px-4 py-2 text-left">Fecha</th>
                                <th className="px-4 py-2 text-left">Monto</th>
                                <th className="px-4 py-2 text-left">Método</th>
                                <th className="px-4 py-2 text-left">Estado</th>
                                <th className="px-4 py-2 text-left">Referencia</th>
                              </tr>
                            </thead>
                            <tbody>
                              {balanceCreditos.historial.map((credito) => (
                                <tr key={credito.id} className="border-t">
                                  <td className="px-4 py-2 text-sm">{formatearFecha(credito.fecha)}</td>
                                  <td className="px-4 py-2 font-medium">{formatearPrecio(credito.monto)}</td>
                                  <td className="px-4 py-2 capitalize">{credito.metodo}</td>
                                  <td className="px-4 py-2">
                                    <Badge
                                      variant={
                                        credito.estado === "completado"
                                          ? "default"
                                          : credito.estado === "pendiente"
                                            ? "outline"
                                            : "destructive"
                                      }
                                      className={
                                        credito.estado === "completado" ? "bg-green-500 hover:bg-green-500/80" : ""
                                      }
                                    >
                                      {credito.estado === "completado"
                                        ? "Completado"
                                        : credito.estado === "pendiente"
                                          ? "Pendiente"
                                          : "Fallido"}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-2 text-sm text-muted-foreground">{credito.referencia}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
