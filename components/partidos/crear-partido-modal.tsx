"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CrearPartidoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function CrearPartidoModal({ open, onOpenChange, onSuccess }: CrearPartidoModalProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    titulo: "",
    recinto: "",
    hora: "",
    valorComision: "",
    modalidad: "7vs7",
    equipoLocal: "",
    equipoVisitante: "",
    descripcion: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, selecciona una fecha para el partido",
      })
      return
    }

    if (
      !formData.titulo ||
      !formData.recinto ||
      !formData.hora ||
      !formData.valorComision ||
      !formData.equipoLocal ||
      !formData.equipoVisitante
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios",
      })
      return
    }

    try {
      setIsLoading(true)

      // En una aplicación real, aquí enviaríamos los datos al servidor
      // Simulamos un retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Llamar a la función de éxito
      onSuccess()

      // Cerrar el modal
      onOpenChange(false)

      // Resetear el formulario
      setFormData({
        titulo: "",
        recinto: "",
        hora: "",
        valorComision: "",
        modalidad: "7vs7",
        equipoLocal: "",
        equipoVisitante: "",
        descripcion: "",
      })
      setDate(undefined)
    } catch (error) {
      console.error("Error al crear partido:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el partido. Intenta de nuevo más tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Crear nuevo partido</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear un nuevo partido. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título del partido *</Label>
              <Input
                id="titulo"
                name="titulo"
                placeholder="Ej: Partido amistoso"
                value={formData.titulo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora">Hora *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="hora"
                    name="hora"
                    placeholder="Ej: 18:00"
                    className="pl-10"
                    value={formData.hora}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="recinto">Recinto deportivo *</Label>
              <Select onValueChange={(value) => handleSelectChange("recinto", value)} value={formData.recinto}>
                <SelectTrigger id="recinto">
                  <SelectValue placeholder="Selecciona un recinto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Complejo Deportivo Norte</SelectItem>
                  <SelectItem value="2">Cancha Municipal Sur</SelectItem>
                  <SelectItem value="3">Complejo Deportivo Empresarial</SelectItem>
                  <SelectItem value="4">Campus Deportivo Universidad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorComision">Valor de comisión (CLP) *</Label>
                <Input
                  id="valorComision"
                  name="valorComision"
                  type="number"
                  placeholder="Ej: 5000"
                  value={formData.valorComision}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="modalidad">Modalidad *</Label>
                <Select onValueChange={(value) => handleSelectChange("modalidad", value)} value={formData.modalidad}>
                  <SelectTrigger id="modalidad">
                    <SelectValue placeholder="Selecciona la modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7vs7">7 vs 7</SelectItem>
                    <SelectItem value="11vs11">11 vs 11</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="equipoLocal">Nombre equipo local *</Label>
                <Input
                  id="equipoLocal"
                  name="equipoLocal"
                  placeholder="Ej: Leones FC"
                  value={formData.equipoLocal}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="equipoVisitante">Nombre equipo visitante *</Label>
                <Input
                  id="equipoVisitante"
                  name="equipoVisitante"
                  placeholder="Ej: Águilas Doradas"
                  value={formData.equipoVisitante}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción (opcional)</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Añade detalles adicionales sobre el partido..."
                className="min-h-[100px]"
                value={formData.descripcion}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear partido"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
