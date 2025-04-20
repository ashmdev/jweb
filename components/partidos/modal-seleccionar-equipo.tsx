"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserPlus } from "lucide-react"
import { getBalanceCreditos } from "@/services/creditos-service"
import { useToast } from "@/hooks/use-toast"
import ModalReservarPosicion from "./modal-reservar-posicion"

interface PosicionInfo {
  nombre: string
  costo: number
  posicionKey?: string
  x?: number
  y?: number
}

interface EquipoInfo {
  id: number
  nombre: string
  posiciones: PosicionInfo[]
}

interface ModalSeleccionarEquipoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  partidoId: number
  equipos?: EquipoInfo[]
  partido?: any // Para mantener compatibilidad con el código existente
  onSeleccionarEquipo?: (equipoId: number, equipoNombre: string, posicion: string) => void // Para compatibilidad
  onSuccess?: () => void
}

export default function ModalSeleccionarEquipo({
  open,
  onOpenChange,
  partidoId,
  equipos = [],
  partido,
  onSeleccionarEquipo,
  onSuccess,
}: ModalSeleccionarEquipoProps) {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string | null>(null)
  const [posicionSeleccionada, setPosicionSeleccionada] = useState<string>("")
  const [showReservarModal, setShowReservarModal] = useState(false)
  const [balanceCreditos, setBalanceCreditos] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Para compatibilidad con el código existente
  if (partido) {
    const handleSubmit = () => {
      if (!equipoSeleccionado || !posicionSeleccionada) return

      const equipoId = Number.parseInt(equipoSeleccionado)
      const equipoNombre =
        equipoId === partido.equipoLocal.id ? partido.equipoLocal.nombre : partido.equipoVisitante.nombre

      onSeleccionarEquipo?.(equipoId, equipoNombre, posicionSeleccionada)
      onOpenChange(false)
    }

    // Verificar si hay puestos disponibles en cada equipo
    const localDisponible = partido.equipoLocal.puestosDisponibles > 0
    const visitanteDisponible = partido.equipoVisitante.puestosDisponibles > 0

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Unirse al partido</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Selecciona el equipo y la posición en la que quieres jugar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <Label>Selecciona un equipo</Label>
              <RadioGroup
                value={equipoSeleccionado || ""}
                onValueChange={setEquipoSeleccionado}
                className="grid grid-cols-1 gap-4"
              >
                <div
                  className={`flex items-center space-x-2 border rounded-md p-4 ${!localDisponible ? "opacity-50" : ""}`}
                >
                  <RadioGroupItem
                    value={partido.equipoLocal.id.toString()}
                    id="equipo-local"
                    disabled={!localDisponible}
                  />
                  <Label
                    htmlFor="equipo-local"
                    className={`flex flex-1 items-center justify-between cursor-pointer ${!localDisponible ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{partido.equipoLocal.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {partido.equipoLocal.jugadores.length} jugadores
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-primary">{partido.equipoLocal.puestosDisponibles} disponibles</div>
                  </Label>
                </div>

                <div
                  className={`flex items-center space-x-2 border rounded-md p-4 ${!visitanteDisponible ? "opacity-50" : ""}`}
                >
                  <RadioGroupItem
                    value={partido.equipoVisitante.id.toString()}
                    id="equipo-visitante"
                    disabled={!visitanteDisponible}
                  />
                  <Label
                    htmlFor="equipo-visitante"
                    className={`flex flex-1 items-center justify-between cursor-pointer ${!visitanteDisponible ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{partido.equipoVisitante.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {partido.equipoVisitante.jugadores.length} jugadores
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-primary">{partido.equipoVisitante.puestosDisponibles} disponibles</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="posicion">Selecciona una posición</Label>
              <Select
                value={posicionSeleccionada}
                onValueChange={setPosicionSeleccionada}
                disabled={!equipoSeleccionado}
              >
                <SelectTrigger id="posicion">
                  <SelectValue placeholder="Selecciona una posición" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portero">Portero</SelectItem>
                  <SelectItem value="defensa">Defensa</SelectItem>
                  <SelectItem value="mediocampista">Mediocampista</SelectItem>
                  <SelectItem value="delantero">Delantero</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleSubmit}
                disabled={!equipoSeleccionado || !posicionSeleccionada}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Unirse
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Nuevo código para la vista de cancha
  // Verificar si hay equipos disponibles
  if (!equipos || equipos.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">No hay equipos disponibles</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              No hay equipos o posiciones disponibles para este partido.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogContent>
      </Dialog>
    )
  }

  // Si solo hay un equipo y una posición, mostrar directamente el modal de reserva
  if (equipos.length === 1 && equipos[0].posiciones.length === 1) {
    const equipo = equipos[0]
    const posicion = equipo.posiciones[0]

    const handleContinuar = async () => {
      try {
        setIsLoading(true)
        const data = await getBalanceCreditos()
        setBalanceCreditos(data)

        if (data.disponible < posicion.costo) {
          toast({
            variant: "destructive",
            title: "Créditos insuficientes",
            description: `Necesitas ${posicion.costo} créditos para reservar esta posición. Actualmente tienes ${data.disponible} créditos disponibles.`,
          })
          return
        }

        setShowReservarModal(true)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo obtener tu balance de créditos",
        })
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Confirmar posición</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                ¿Quieres reservar la posición de {posicion.nombre} en el equipo {equipo.nombre}?
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="p-4 border rounded-md mb-4">
                <p className="font-medium">{equipo.nombre}</p>
                <p className="text-sm text-muted-foreground">Posición: {posicion.nombre}</p>
                <p className="text-sm font-medium text-primary">Costo: {posicion.costo} créditos</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleContinuar} disabled={isLoading}>
                {isLoading ? "Verificando..." : "Continuar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {showReservarModal && (
          <ModalReservarPosicion
            open={showReservarModal}
            onOpenChange={setShowReservarModal}
            partidoId={partidoId}
            equipoId={equipo.id}
            equipoNombre={equipo.nombre}
            posicion={posicion.nombre}
            costo={posicion.costo}
            balanceCreditos={balanceCreditos}
            onSuccess={onSuccess}
            posicionKey={posicion.posicionKey}
            posicionX={posicion.x}
            posicionY={posicion.y}
          />
        )}
      </>
    )
  }

  // Si hay múltiples equipos o posiciones, mostrar el selector
  const [selectedEquipo, setSelectedEquipo] = useState(equipos[0])
  const [selectedPosicion, setSelectedPosicion] = useState(
    equipos[0].posiciones.length > 0 ? equipos[0].posiciones[0] : null,
  )

  const handleSelectEquipo = (equipoId: string) => {
    const equipo = equipos.find((e) => e.id.toString() === equipoId)
    if (equipo) {
      setSelectedEquipo(equipo)
      if (equipo.posiciones.length > 0) {
        setSelectedPosicion(equipo.posiciones[0])
      } else {
        setSelectedPosicion(null)
      }
    }
  }

  const handleContinuar = async () => {
    if (!selectedEquipo || !selectedPosicion) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes seleccionar un equipo y una posición",
      })
      return
    }

    try {
      setIsLoading(true)
      const data = await getBalanceCreditos()
      setBalanceCreditos(data)

      if (data.disponible < selectedPosicion.costo) {
        toast({
          variant: "destructive",
          title: "Créditos insuficientes",
          description: `Necesitas ${selectedPosicion.costo} créditos para reservar esta posición. Actualmente tienes ${data.disponible} créditos disponibles.`,
        })
        return
      }

      setShowReservarModal(true)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo obtener tu balance de créditos",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Seleccionar equipo y posición</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Elige el equipo y la posición en la que quieres jugar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {equipos.length > 1 && (
              <div className="space-y-4">
                <Label>Selecciona un equipo</Label>
                <RadioGroup
                  value={selectedEquipo?.id.toString() || ""}
                  onValueChange={handleSelectEquipo}
                  className="grid grid-cols-1 gap-4"
                >
                  {equipos.map((equipo) => (
                    <div key={equipo.id} className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value={equipo.id.toString()} id={`equipo-${equipo.id}`} />
                      <Label
                        htmlFor={`equipo-${equipo.id}`}
                        className="flex flex-1 items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{equipo.nombre}</p>
                            <p className="text-xs text-muted-foreground">{equipo.posiciones.length} posiciones</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {selectedEquipo && selectedEquipo.posiciones.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="posicion">Selecciona una posición</Label>
                <Select
                  value={selectedPosicion?.nombre || ""}
                  onValueChange={(value) => {
                    const posicion = selectedEquipo.posiciones.find((p) => p.nombre === value)
                    if (posicion) setSelectedPosicion(posicion)
                  }}
                >
                  <SelectTrigger id="posicion">
                    <SelectValue placeholder="Selecciona una posición" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedEquipo.posiciones.map((posicion, index) => (
                      <SelectItem key={index} value={posicion.nombre}>
                        {posicion.nombre} - {posicion.costo} créditos
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedEquipo && selectedEquipo.posiciones.length === 1 && (
              <div className="p-4 border rounded-md">
                <p className="font-medium">Posición seleccionada</p>
                <p className="text-sm text-muted-foreground">{selectedEquipo.posiciones[0].nombre}</p>
                <p className="text-sm font-medium text-primary">Costo: {selectedEquipo.posiciones[0].costo} créditos</p>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleContinuar}
                disabled={!selectedEquipo || !selectedPosicion || isLoading}
              >
                {isLoading ? "Verificando..." : "Continuar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showReservarModal && selectedEquipo && selectedPosicion && (
        <ModalReservarPosicion
          open={showReservarModal}
          onOpenChange={setShowReservarModal}
          partidoId={partidoId}
          equipoId={selectedEquipo.id}
          equipoNombre={selectedEquipo.nombre}
          posicion={selectedPosicion.nombre}
          costo={selectedPosicion.costo}
          balanceCreditos={balanceCreditos}
          onSuccess={onSuccess}
          posicionKey={selectedPosicion.posicionKey}
          posicionX={selectedPosicion.x}
          posicionY={selectedPosicion.y}
        />
      )}
    </>
  )
}
