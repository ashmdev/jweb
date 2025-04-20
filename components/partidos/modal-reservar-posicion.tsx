"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { unirseAPartido } from "@/services/partido-join-service"
import ModalInvitarAmigo from "./modal-invitar-amigo"
import ModalConfirmarReserva from "./modal-confirmar-reserva"
import type { BalanceCredito } from "@/types/credito"

interface ModalReservarPosicionProps {
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

export default function ModalReservarPosicion({
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
}: ModalReservarPosicionProps) {
  const [showInvitarAmigo, setShowInvitarAmigo] = useState(false)
  const [showConfirmarReserva, setShowConfirmarReserva] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleReservarParaMi = () => {
    if (!balanceCreditos) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo obtener tu balance de créditos",
      })
      return
    }

    if (balanceCreditos.disponible < costo) {
      toast({
        variant: "destructive",
        title: "Créditos insuficientes",
        description: `Necesitas ${costo} créditos para reservar esta posición. Actualmente tienes ${balanceCreditos.disponible} créditos disponibles.`,
      })
      return
    }

    setShowConfirmarReserva(true)
  }

  const handleInvitarAmigo = () => {
    if (!balanceCreditos) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo obtener tu balance de créditos",
      })
      return
    }

    if (balanceCreditos.disponible < costo) {
      toast({
        variant: "destructive",
        title: "Créditos insuficientes",
        description: `Necesitas ${costo} créditos para invitar a un amigo. Actualmente tienes ${balanceCreditos.disponible} créditos disponibles.`,
      })
      return
    }

    setShowInvitarAmigo(true)
  }

  const handleConfirmarReserva = async () => {
    try {
      setIsLoading(true)
      // Incluir información de posición en la solicitud
      const response = await unirseAPartido(partidoId, equipoId, posicion, costo, posicionKey, posicionX, posicionY)

      toast({
        title: "Reserva exitosa",
        description: "Te has unido al partido correctamente",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al unirse al partido",
        description: error.message || "No se pudo completar la reserva",
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
            <DialogTitle className="text-xl font-bold">Reservar {posicion}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Equipo {equipoNombre} - {posicion} - Costo:{" "}
              <span className="text-primary font-bold">{costo} créditos</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Button
              onClick={handleReservarParaMi}
              variant="outline"
              className="flex items-center justify-start gap-3 h-14 text-base"
              disabled={isLoading}
            >
              <CreditCard className="h-5 w-5" />
              Reservar para mí ({costo} créditos)
            </Button>

            <Button
              onClick={handleInvitarAmigo}
              variant="outline"
              className="flex items-center justify-start gap-3 h-14 text-base"
              disabled={isLoading}
            >
              <Users className="h-5 w-5" />
              Invitar a un amigo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showInvitarAmigo && (
        <ModalInvitarAmigo
          open={showInvitarAmigo}
          onOpenChange={setShowInvitarAmigo}
          partidoId={partidoId}
          equipoId={equipoId}
          equipoNombre={equipoNombre}
          posicion={posicion}
          costo={costo}
          balanceCreditos={balanceCreditos}
          onSuccess={onSuccess}
          posicionKey={posicionKey}
          posicionX={posicionX}
          posicionY={posicionY}
        />
      )}

      {showConfirmarReserva && (
        <ModalConfirmarReserva
          open={showConfirmarReserva}
          onOpenChange={setShowConfirmarReserva}
          equipoNombre={equipoNombre}
          posicion={posicion}
          costo={costo}
          balanceCreditos={balanceCreditos}
          onConfirm={handleConfirmarReserva}
        />
      )}
    </>
  )
}
