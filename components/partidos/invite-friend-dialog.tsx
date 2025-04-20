"use client"
import { User, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useFormStore } from "@/lib/form-store"
import { useDialogStore } from "@/lib/dialog-store"
import { friends } from "@/lib/football-store"

export default function InviteFriendDialog() {
  const { isInviteFriendOpen, closeInviteFriend, selectedPosition, openConfirmation } = useDialogStore()
  const {
    selectedFriend,
    newFriendName,
    newFriendEmail,
    newFriendPhone,
    showNewFriendForm,
    setSelectedFriend,
    setNewFriendName,
    setNewFriendEmail,
    setNewFriendPhone,
    toggleNewFriendForm,
    validateFriendForm,
    setShowNewFriendForm,
    setIsForFriend,
  } = useFormStore()

  const handleInviteFriendSubmit = () => {
    const validation = validateFriendForm()

    if (!validation.isValid) {
      toast.error("Error en el formulario", {
        description: validation.errorMessage,
      })
      return
    }

    setIsForFriend(true)
    closeInviteFriend()

    if (selectedPosition) {
      openConfirmation(selectedPosition)
    }
  }

  return (
    <Dialog open={isInviteFriendOpen} onOpenChange={closeInviteFriend}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invitar a un amigo</DialogTitle>
          <DialogDescription>
            Invita a un amigo a jugar en {selectedPosition?.name}. Esto te costará {selectedPosition?.cost} créditos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant={!showNewFriendForm ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setShowNewFriendForm(false)}
            >
              Seleccionar amigo existente
            </Button>
            <Button
              variant={showNewFriendForm ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={toggleNewFriendForm}
            >
              Invitar nuevo amigo
            </Button>
          </div>

          {!showNewFriendForm ? (
            <div className="space-y-2">
              <Label>Seleccionar un amigo</Label>
              <Select onValueChange={setSelectedFriend} value={selectedFriend || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un amigo" />
                </SelectTrigger>
                <SelectContent>
                  {friends.map((friend) => (
                    <SelectItem key={friend.id} value={friend.id.toString()}>
                      {friend.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedFriend && selectedFriend !== "new" && (
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mt-4">
                  <img
                    src={friends.find((p) => p.id.toString() === selectedFriend)?.image || ""}
                    alt="Amigo"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white"
                  />
                  <div className="flex-1">
                    <p className="font-bold">{friends.find((p) => p.id.toString() === selectedFriend)?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Jugará en {selectedPosition?.name} - {selectedPosition?.team === "A" ? "Equipo A" : "Equipo B"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="friendName">Nombre del Amigo</Label>
                <Input
                  id="friendName"
                  placeholder="Ingresa el nombre de tu amigo"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="friendEmail">Correo del Amigo</Label>
                <Input
                  id="friendEmail"
                  type="email"
                  placeholder="Ingresa el correo de tu amigo"
                  value={newFriendEmail}
                  onChange={(e) => setNewFriendEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="friendPhone">Teléfono del Amigo</Label>
                <Input
                  id="friendPhone"
                  type="tel"
                  placeholder="Ingresa el teléfono de tu amigo"
                  value={newFriendPhone}
                  onChange={(e) => setNewFriendPhone(e.target.value)}
                />
              </div>

              {newFriendName && newFriendEmail && (
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{newFriendName}</p>
                    <p className="text-sm text-muted-foreground">{newFriendEmail}</p>
                    {newFriendPhone && <p className="text-sm text-muted-foreground">{newFriendPhone}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleInviteFriendSubmit}
              className="flex-1"
              disabled={(!selectedFriend || selectedFriend === "new") && (!newFriendName || !newFriendEmail)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Invitar Amigo
            </Button>
            <Button variant="outline" onClick={closeInviteFriend} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
