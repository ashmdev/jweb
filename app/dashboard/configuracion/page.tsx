"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Check } from "lucide-react"
import { useUserStore } from "@/lib/stores/user-store"
import { useGeneralConfigStore, useAparienciaConfigStore, usePrivacidadConfigStore } from "@/lib/stores/config-store"

export default function ConfiguracionPage() {
  const { toast } = useToast()

  // Obtener el usuario del store
  const user = useUserStore((state) => state.user)

  // Obtener estados y acciones de los stores de configuración
  const { idioma, setIdioma, zonaHoraria, setZonaHoraria, unidadesMetricas, setUnidadesMetricas } =
    useGeneralConfigStore()

  const {
    tema,
    setTema,
    interfazCompacta,
    setInterfazCompacta,
    mostrarAnimaciones,
    setMostrarAnimaciones,
    aplicarTema,
  } = useAparienciaConfigStore()

  const {
    perfilPublico,
    setPerfilPublico,
    mostrarEstadisticas,
    setMostrarEstadisticas,
    mostrarUbicacion,
    setMostrarUbicacion,
    compartirDatos,
    setCompartirDatos,
    aceptarCookies,
    setAceptarCookies,
  } = usePrivacidadConfigStore()

  // Estado para indicar si se están guardando los cambios
  const [guardando, setGuardando] = useState(false)
  // Estado para indicar si hay cambios sin guardar
  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(false)

  // Detectar cambios en las configuraciones
  useEffect(() => {
    setCambiosSinGuardar(true)
  }, [
    idioma,
    zonaHoraria,
    unidadesMetricas,
    tema,
    interfazCompacta,
    mostrarAnimaciones,
    perfilPublico,
    mostrarEstadisticas,
    mostrarUbicacion,
    compartirDatos,
    aceptarCookies,
  ])

  // Función para guardar las configuraciones
  const guardarConfiguraciones = async () => {
    setGuardando(true)

    try {
      // Simular una petición al servidor
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Aplicar tema
      aplicarTema()

      // Mostrar notificación de éxito
      toast({
        title: "Configuración guardada",
        description: "Tus preferencias han sido actualizadas correctamente.",
        duration: 3000,
      })

      setCambiosSinGuardar(false)
    } catch (error) {
      console.error("Error al guardar configuraciones:", error)

      // Mostrar notificación de error
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "No se pudieron guardar tus preferencias. Inténtalo de nuevo.",
        duration: 3000,
      })
    } finally {
      setGuardando(false)
    }
  }

  // Función para seleccionar tema
  const seleccionarTema = (nuevoTema: "light" | "dark" | "system") => {
    setTema(nuevoTema)
    // Aplicar tema inmediatamente para mejor experiencia de usuario
    setTimeout(() => aplicarTema(), 0)
  }

  // Función para descargar datos
  const descargarDatos = async () => {
    try {
      // Simular una petición al servidor
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Crear un objeto con los datos del usuario
      const datos = {
        usuario: {
          id: user?.id,
          nombre: user?.name,
          email: user?.email,
          rol: user?.role,
        },
        configuracion: {
          general: {
            idioma,
            zonaHoraria,
            unidadesMetricas,
          },
          apariencia: {
            tema,
            interfazCompacta,
            mostrarAnimaciones,
          },
          privacidad: {
            perfilPublico,
            mostrarEstadisticas,
            mostrarUbicacion,
            compartirDatos,
            aceptarCookies,
          },
        },
      }

      // Convertir a JSON y crear un blob
      const jsonDatos = JSON.stringify(datos, null, 2)
      const blob = new Blob([jsonDatos], { type: "application/json" })

      // Crear URL y enlace para descargar
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `datos_usuario_${user?.id}.json`
      document.body.appendChild(a)
      a.click()

      // Limpiar
      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      // Mostrar notificación de éxito
      toast({
        title: "Datos descargados",
        description: "Tus datos han sido descargados correctamente.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error al descargar datos:", error)

      // Mostrar notificación de error
      toast({
        variant: "destructive",
        title: "Error al descargar",
        description: "No se pudieron descargar tus datos. Inténtalo de nuevo.",
        duration: 3000,
      })
    }
  }

  // Función para solicitar eliminación de datos
  const solicitarEliminacionDatos = async () => {
    try {
      // Simular una petición al servidor
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mostrar notificación de éxito
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de eliminación de datos ha sido enviada. Te contactaremos pronto.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error al solicitar eliminación:", error)

      // Mostrar notificación de error
      toast({
        variant: "destructive",
        title: "Error al enviar solicitud",
        description: "No se pudo enviar tu solicitud. Inténtalo de nuevo.",
        duration: 3000,
      })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">Administra la configuración de tu cuenta y preferencias</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 w-full md:w-auto"
          onClick={guardarConfiguraciones}
          disabled={guardando || !cambiosSinGuardar}
        >
          {guardando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : cambiosSinGuardar ? (
            "Guardar cambios"
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Guardado
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
          <TabsTrigger value="privacidad">Privacidad</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Configura las opciones generales de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Idioma</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="idioma">Idioma de la aplicación</Label>
                    <Select value={idioma} onValueChange={setIdioma}>
                      <SelectTrigger id="idioma">
                        <SelectValue placeholder="Selecciona un idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Zona horaria</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zona-horaria">Zona horaria</Label>
                    <Select value={zonaHoraria} onValueChange={setZonaHoraria}>
                      <SelectTrigger id="zona-horaria">
                        <SelectValue placeholder="Selecciona una zona horaria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-santiago">América/Santiago (GMT-4)</SelectItem>
                        <SelectItem value="america-buenos_aires">América/Buenos Aires (GMT-3)</SelectItem>
                        <SelectItem value="america-bogota">América/Bogotá (GMT-5)</SelectItem>
                        <SelectItem value="america-mexico_city">América/Ciudad de México (GMT-6)</SelectItem>
                        <SelectItem value="europe-madrid">Europa/Madrid (GMT+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Unidades</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="unidades-metricas">Usar unidades métricas</Label>
                      <p className="text-sm text-muted-foreground">Mostrar distancias en kilómetros</p>
                    </div>
                    <Switch id="unidades-metricas" checked={unidadesMetricas} onCheckedChange={setUnidadesMetricas} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apariencia" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apariencia</CardTitle>
              <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tema</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div
                    className={`space-y-2 cursor-pointer ${tema === "light" ? "ring-2 ring-primary rounded-md" : ""}`}
                    onClick={() => seleccionarTema("light")}
                  >
                    <div className="border rounded-md p-4 bg-white">
                      <div className="h-10 bg-gray-100 rounded-md mb-2"></div>
                      <div className="h-4 w-3/4 bg-gray-100 rounded-md mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-100 rounded-md"></div>
                      <p className="text-sm font-medium mt-2 text-center">Claro</p>
                    </div>
                  </div>
                  <div
                    className={`space-y-2 cursor-pointer ${tema === "dark" ? "ring-2 ring-primary rounded-md" : ""}`}
                    onClick={() => seleccionarTema("dark")}
                  >
                    <div className="border rounded-md p-4 bg-gray-900">
                      <div className="h-10 bg-gray-800 rounded-md mb-2"></div>
                      <div className="h-4 w-3/4 bg-gray-800 rounded-md mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-800 rounded-md"></div>
                      <p className="text-sm font-medium mt-2 text-center text-white">Oscuro</p>
                    </div>
                  </div>
                  <div
                    className={`space-y-2 cursor-pointer ${tema === "system" ? "ring-2 ring-primary rounded-md" : ""}`}
                    onClick={() => seleccionarTema("system")}
                  >
                    <div className="border rounded-md p-4 bg-gradient-to-b from-white to-gray-900">
                      <div className="h-10 bg-gray-300 rounded-md mb-2"></div>
                      <div className="h-4 w-3/4 bg-gray-300 rounded-md mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-300 rounded-md"></div>
                      <p className="text-sm font-medium mt-2 text-center">Sistema</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Densidad</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="densidad-compacta">Interfaz compacta</Label>
                      <p className="text-sm text-muted-foreground">Reduce el espacio entre elementos</p>
                    </div>
                    <Switch id="densidad-compacta" checked={interfazCompacta} onCheckedChange={setInterfazCompacta} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Animaciones</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="animaciones">Mostrar animaciones</Label>
                      <p className="text-sm text-muted-foreground">Habilitar animaciones en la interfaz</p>
                    </div>
                    <Switch id="animaciones" checked={mostrarAnimaciones} onCheckedChange={setMostrarAnimaciones} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacidad" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacidad</CardTitle>
              <CardDescription>Administra tu privacidad y seguridad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Visibilidad del perfil</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="perfil-publico">Perfil público</Label>
                      <p className="text-sm text-muted-foreground">Permite que otros usuarios vean tu perfil</p>
                    </div>
                    <Switch id="perfil-publico" checked={perfilPublico} onCheckedChange={setPerfilPublico} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mostrar-estadisticas">Mostrar estadísticas</Label>
                      <p className="text-sm text-muted-foreground">Permite que otros usuarios vean tus estadísticas</p>
                    </div>
                    <Switch
                      id="mostrar-estadisticas"
                      checked={mostrarEstadisticas}
                      onCheckedChange={setMostrarEstadisticas}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mostrar-ubicacion">Mostrar ubicación</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite que otros usuarios vean tu ubicación aproximada
                      </p>
                    </div>
                    <Switch id="mostrar-ubicacion" checked={mostrarUbicacion} onCheckedChange={setMostrarUbicacion} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Datos y privacidad</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compartir-datos">Compartir datos de uso</Label>
                      <p className="text-sm text-muted-foreground">
                        Ayúdanos a mejorar la aplicación compartiendo datos de uso anónimos
                      </p>
                    </div>
                    <Switch id="compartir-datos" checked={compartirDatos} onCheckedChange={setCompartirDatos} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cookies">Aceptar cookies</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir el uso de cookies para mejorar tu experiencia
                      </p>
                    </div>
                    <Switch id="cookies" checked={aceptarCookies} onCheckedChange={setAceptarCookies} />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={descargarDatos}>
                  Descargar mis datos
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={solicitarEliminacionDatos}
                >
                  Solicitar eliminación de datos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
