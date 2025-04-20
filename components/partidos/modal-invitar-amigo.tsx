"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { getAmigosDisponibles, invitarAmigoExistente, invitarNuevoAmigo } from "@/services/partido-join-service"
import type { Amigo } from "@/types/amigo"
import type { BalanceCredito } from "@/types/credito"

interface ModalInvitarAmigoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  partidoId: number
  equipoId: number
  equipoNombre: string
  posicion: string
  costo: number
  balanceCreditos: BalanceCredito | null
  onSuccess: () => void
  posicionKey?: string
  posicionX?: number
  posicionY?: number
}

export default function ModalInvitarAmigo({
  open,
  onOpenChange,
  partidoId,
  equipoId,
  equipoNombre,
  posicion,
  costo,
  balanceCreditos,
  onSuccess,
  posicionKey,
  posicionX,
  posicionY,
}: ModalInvitarAmigoProps) {
  const [activeTab, setActiveTab] = useState("existente")
  const [amigos, setAmigos] = useState<Amigo[]>([])
  const [isLoadingAmigos, setIsLoadingAmigos] = useState(false)
  const [selectedAmigo, setSelectedAmigo] = useState<Amigo | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  })
  const { toast } = useToast()

  // Cargar amigos disponibles
  useEffect(() => {
    const fetchAmigos = async () => {
      try {
        setIsLoadingAmigos(true)
        const data = await getAmigosDisponibles()
        setAmigos(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar tus amigos",
        })
      } finally {
        setIsLoadingAmigos(false)
      }
    }

    if (open && activeTab === "existente") {
      fetchAmigos()
    }
  }, [open, activeTab, toast])

  const handleSelectAmigo = (amigo: Amigo) => {
    setSelectedAmigo(amigo)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleInvitarAmigoExistente = async () => {
    if (!selectedAmigo) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes seleccionar un amigo",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await invitarAmigoExistente(
        partidoId,
        equipoId,
        posicion,
        selectedAmigo.id,
        costo,
        posicionKey,
        posicionX,
        posicionY,
      )

      toast({
        title: "Invitación enviada",
        description: `Has invitado a ${selectedAmigo.nombre} a jugar como ${posicion}`,
      })

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al invitar",
        description: error.message || "No se pudo enviar la invitación",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInvitarNuevoAmigo = async () => {
    // Validar formulario
    if (!formData.nombre || !formData.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes completar al menos el nombre y el email",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await invitarNuevoAmigo(
        partidoId,
        equipoId,
        posicion,
        formData.nombre,
        formData.email,
        formData.telefono,
        costo,
        posicionKey,
        posicionX,
        posicionY,
      )

      toast({
        title: "Invitación enviada",
        description: `Has invitado a ${formData.nombre} a jugar como ${posicion}`,
      })

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al invitar",
        description: error.message || "No se pudo enviar la invitación",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Invitar a un amigo</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Equipo {equipoNombre} - {posicion} - Costo: <span className="text-primary font-bold">{costo} créditos</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="existente" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="existente">Amigo existente</TabsTrigger>
            <TabsTrigger value="nuevo">Nuevo amigo</TabsTrigger>
          </TabsList>

          <TabsContent value="existente">
            {isLoadingAmigos ? (
              <div className="py-4 text-center text-muted-foreground">Cargando amigos...</div>
            ) : amigos.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                No tienes amigos disponibles. Puedes invitar a un nuevo amigo.
              </div>
            ) : (
              <div className="grid gap-4 max-h-[300px] overflow-y-auto py-2">
                {amigos.map((amigo) => (
                  <Card
                    key={amigo.id}
                    className={`cursor-pointer transition-all ${
                      selectedAmigo?.id === amigo.id ? "border-primary" : "hover:border-primary/50"
                    }`}
                    onClick={() => handleSelectAmigo(amigo)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={amigo.avatar} alt={amigo.nombre} />
                        <AvatarFallback>{amigo.nombre.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{amigo.nombre}</h3>
                        <p className="text-sm text-muted-foreground">{amigo.email}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleInvitarAmigoExistente}
                disabled={!selectedAmigo || isSubmitting || amigos.length === 0}
              >
                {isSubmitting ? "Enviando..." : "Invitar"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="nuevo">
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre del amigo"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefono">Teléfono (opcional)</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  placeholder="+56 9 1234 5678"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleInvitarNuevoAmigo} disabled={!formData.nombre || !formData.email || isSubmitting}>
                {isSubmitting ? "Enviando..." : "Invitar"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
