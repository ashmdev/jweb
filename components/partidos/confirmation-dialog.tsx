"use client"

import { Check, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useDialogStore } from "@/lib/dialog-store"
import { useFormStore } from "@/lib/form-store"
import { useFootballStore, friends } from "@/lib/football-store"
import { toast } from "sonner"

export default function ConfirmationDialog() {
  const { isConfirmationOpen, closeConfirmation, selectedPosition } = useDialogStore()
  const { isForFriend, selectedFriend, newFriendName, newFriendEmail, newFriendPhone, showNewFriendForm } =
    useFormStore()
  const { userCredits, reservePosition, userId } = useFootballStore()

  const handleConfirm = () => {
    if (!selectedPosition) return

    try {
      if (isForFriend) {
        if (showNewFriendForm) {
          // Lógica para invitar a un nuevo amigo
          // En un caso real, aquí se enviaría la invitación al backend
          reservePosition(selectedPosition.id, userId, true)
          toast.success(`Invitación enviada a ${newFriendName}`)
        } else if (selectedFriend) {
          // Lógica para invitar a un amigo existente
          reservePosition(selectedPosition.id, userId, true, selectedFriend)
          toast.success(`Posición reservada para ${friends.find((f) => f.id.toString() === selectedFriend)?.name}`)
        }
      } else {
        // Lógica para reservar para uno mismo
        reservePosition(selectedPosition.id, userId)
        toast.success("Posición reservada exitosamente")
      }

      closeConfirmation()
    } catch (error) {
      toast.error("Error al procesar la reserva")
    }
  }

  return (
    <Dialog open={isConfirmationOpen} onOpenChange={closeConfirmation}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Reserva de Posición</DialogTitle>
          <DialogDescription>
            {isForFriend
              ? showNewFriendForm
                ? `Estás a punto de pagar ${selectedPosition?.cost} créditos para reservar esta posición para ${newFriendName}.`
                : `Estás a punto de pagar ${selectedPosition?.cost} créditos para reservar esta posición para ${friends.find((p) => p.id.toString() === selectedFriend)?.name || "tu amigo"}.`
              : `Estás a punto de pagar ${selectedPosition?.cost} créditos para reservar esta posición.`}
          </DialogDescription>
        </DialogHeader>

        {selectedPosition && (
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            {isForFriend ? (
              showNewFriendForm ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{newFriendName}</p>
                    <p className="text-sm text-muted-foreground">{newFriendEmail}</p>
                    {newFriendPhone && <p className="text-sm text-muted-foreground">{newFriendPhone}</p>}
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedPosition.name} - {selectedPosition.team === "A" ? "Equipo A" : "Equipo B"}
                    </p>
                  </div>
                </>
              ) : selectedFriend && selectedFriend !== "new" ? (
                <>
                  <img
                    src={friends.find((p) => p.id.toString() === selectedFriend)?.image || ""}
                    alt="Amigo"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white"
                  />
                  <div className="flex-1">
                    <p className="font-bold">{friends.find((p) => p.id.toString() === selectedFriend)?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPosition.name} - {selectedPosition.team === "A" ? "Equipo A" : "Equipo B"}
                    </p>
                  </div>
                </>
              ) : null
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <User className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <p className="font-bold">Tu posición</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPosition.name} - {selectedPosition.team === "A" ? "Equipo A" : "Equipo B"}
                  </p>
                </div>
              </>
            )}
            <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg font-bold">
              {selectedPosition.cost} créditos
            </div>
          </div>
        )}

        <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
          <span>Tus créditos:</span>
          <span className="font-bold">{userCredits}</span>
        </div>
        <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
          <span>Después de la compra:</span>
          <span className="font-bold">{userCredits - (selectedPosition?.cost || 0)}</span>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeConfirmation}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            <Check className="mr-2 h-4 w-4" />
            Confirmar Pago
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
