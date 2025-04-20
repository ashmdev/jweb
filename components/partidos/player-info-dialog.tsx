"use client"

import { Info, UserCheck, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useDialogStore } from "@/lib/dialog-store"
import { useFootballStore } from "@/lib/football-store"
import { toast } from "sonner"

export default function PlayerInfoDialog() {
  const { isPlayerInfoOpen, closePlayerInfo, selectedPosition } = useDialogStore()
  const { userId, cancelReservation } = useFootballStore()

  const isUserPosition =
    selectedPosition && (selectedPosition.reservedBy === userId || selectedPosition.reservedByUser === userId)
  const isPersonalPosition =
    selectedPosition && selectedPosition.reservedBy === userId && !selectedPosition.reservedByUser
  const isInvitedFriend = selectedPosition && selectedPosition.reservedByUser === userId

  const handleRemovePosition = () => {
    if (!selectedPosition) return

    try {
      cancelReservation(selectedPosition.id)
      toast.success(isPersonalPosition ? "Has liberado tu posición" : "Has cancelado la invitación")
      closePlayerInfo()
    } catch (error) {
      toast.error("Error al cancelar la reserva")
    }
  }

  return (
    <Dialog open={isPlayerInfoOpen} onOpenChange={closePlayerInfo}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Información del Jugador</DialogTitle>
          <DialogDescription>Detalles sobre el jugador en esta posición</DialogDescription>
        </DialogHeader>

        {selectedPosition && selectedPosition.player && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                <img
                  src={selectedPosition.player.image || "/placeholder.svg?height=200&width=200"}
                  alt={selectedPosition.player.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">{selectedPosition.player.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedPosition.name} - {selectedPosition.team === "A" ? "Equipo A" : "Equipo B"}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10">
                    Costo de Posición: {selectedPosition.cost} créditos
                  </Badge>
                </div>
              </div>
            </div>

            {isUserPosition ? (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium flex items-center gap-2 text-blue-800">
                  {isPersonalPosition ? (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Tu Posición Personal
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Tu Invitación a un Amigo
                    </>
                  )}
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  {isPersonalPosition
                    ? "Esta es tu posición personal en el campo."
                    : `Invitaste a ${selectedPosition.player.name} a jugar en esta posición.`}
                </p>

                <Button variant="destructive" onClick={handleRemovePosition} className="w-full mt-3">
                  <X className="mr-2 h-4 w-4" />
                  {isPersonalPosition ? "Liberar mi posición" : "Cancelar invitación"} (Reembolso de{" "}
                  {selectedPosition.cost} créditos)
                </Button>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium flex items-center gap-2 text-yellow-800">
                  <Info className="h-4 w-4" />
                  Estado de la Posición
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Esta posición ya está ocupada por {selectedPosition.player.name}.
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button onClick={closePlayerInfo}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
