"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useDialogStore } from "@/lib/dialog-store"
import { useFootballStore } from "@/lib/football-store"
import { useFormStore } from "@/lib/form-store"
import ConfirmationDialog from "./confirmation-dialog"
import InviteFriendDialog from "./invite-friend-dialog"
import PlayerInfoDialog from "./player-info-dialog"
import { toast } from "sonner"

export default function FieldView({ matchId }: { matchId: string }) {
  const { openConfirmation, openInviteFriend, openPlayerInfo, setSelectedPosition } = useDialogStore()

  const { positions, setPositions, userCredits, userId, isLoading, setIsLoading } = useFootballStore()

  const { resetForm, setIsForFriend } = useFormStore()

  // Cargar posiciones (simulado)
  useEffect(() => {
    const loadPositions = async () => {
      setIsLoading(true)
      try {
        // Simulación de carga de datos
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Datos de ejemplo
        const samplePositions = [
          {
            id: "1",
            name: "Delantero Centro",
            team: "A" as const,
            x: 50,
            y: 20,
            cost: 10,
            available: true,
          },
          {
            id: "2",
            name: "Defensa Central",
            team: "A" as const,
            x: 50,
            y: 70,
            cost: 8,
            available: false,
            reservedBy: "456",
            player: {
              id: "456",
              name: "Juan Pérez",
              image: "/placeholder.svg?height=200&width=200",
            },
          },
          {
            id: "3",
            name: "Portero",
            team: "A" as const,
            x: 50,
            y: 90,
            cost: 12,
            available: true,
          },
          {
            id: "4",
            name: "Delantero Centro",
            team: "B" as const,
            x: 50,
            y: 20,
            cost: 10,
            available: false,
            reservedBy: userId,
            player: {
              id: userId,
              name: "Usuario Actual",
            },
          },
          {
            id: "5",
            name: "Defensa Central",
            team: "B" as const,
            x: 50,
            y: 70,
            cost: 8,
            available: true,
          },
          {
            id: "6",
            name: "Portero",
            team: "B" as const,
            x: 50,
            y: 90,
            cost: 12,
            available: false,
            reservedBy: userId,
            reservedByUser: userId,
            player: {
              id: "3",
              name: "María López",
              image: "/placeholder.svg?height=200&width=200",
            },
          },
        ]

        setPositions(samplePositions)
      } catch (error) {
        toast.error("Error al cargar las posiciones")
      } finally {
        setIsLoading(false)
      }
    }

    loadPositions()
  }, [setPositions, setIsLoading, userId])

  const handlePositionClick = (position: any) => {
    setSelectedPosition(position)

    if (position.available) {
      // Si está disponible, mostrar opciones para reservar
      setIsForFriend(false)
      resetForm()

      // Verificar si hay suficientes créditos
      if (userCredits < position.cost) {
        toast.error("No tienes suficientes créditos para esta posición")
        return
      }

      openConfirmation(position)
    } else {
      // Si ya está ocupada, mostrar información
      openPlayerInfo(position)
    }
  }

  const handleInviteFriend = (position: any) => {
    if (userCredits < position.cost) {
      toast.error("No tienes suficientes créditos para invitar a un amigo")
      return
    }

    setSelectedPosition(position)
    resetForm()
    openInviteFriend(position)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Campo de fútbol */}
          <div className="relative bg-green-600 rounded-lg overflow-hidden aspect-[4/3] w-full">
            {/* Líneas del campo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[80%] h-[90%] border-2 border-white rounded-lg"></div>
              <div className="absolute w-24 h-24 border-2 border-white rounded-full flex items-center justify-center"></div>
              <div className="absolute top-0 w-[30%] h-[20%] border-2 border-white rounded-b-lg"></div>
              <div className="absolute bottom-0 w-[30%] h-[20%] border-2 border-white rounded-t-lg"></div>
            </div>

            {/* Posiciones */}
            {positions.map((position) => (
              <button
                key={position.id}
                onClick={() => handlePositionClick(position)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  position.available ? "bg-green-400 hover:bg-green-300 hover:scale-110 active:scale-95" : "bg-red-400"
                } border-2 border-white shadow-lg`}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  animation: position.available ? "pulse 2s infinite" : "none",
                }}
              >
                {position.player ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={position.player.image || "/placeholder.svg?height=100&width=100"}
                      alt={position.player.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <span className="text-xs font-bold text-white">{position.team === "A" ? "A" : "B"}</span>
                )}
              </button>
            ))}
          </div>

          {/* Leyenda */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Equipo A</h3>
              <div className="space-y-2">
                {positions
                  .filter((p) => p.team === "A")
                  .map((position) => (
                    <div key={position.id} className="flex items-center justify-between">
                      <span>{position.name}</span>
                      {position.available ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handlePositionClick(position)}
                            disabled={userCredits < position.cost}
                          >
                            Reservar ({position.cost})
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleInviteFriend(position)}
                            disabled={userCredits < position.cost}
                          >
                            Invitar
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handlePositionClick(position)}>
                          Ver
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Equipo B</h3>
              <div className="space-y-2">
                {positions
                  .filter((p) => p.team === "B")
                  .map((position) => (
                    <div key={position.id} className="flex items-center justify-between">
                      <span>{position.name}</span>
                      {position.available ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handlePositionClick(position)}
                            disabled={userCredits < position.cost}
                          >
                            Reservar ({position.cost})
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleInviteFriend(position)}
                            disabled={userCredits < position.cost}
                          >
                            Invitar
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handlePositionClick(position)}>
                          Ver
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Diálogos */}
      <ConfirmationDialog />
      <InviteFriendDialog />
      <PlayerInfoDialog />

      {/* Estilos para la animación de pulso */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(74, 222, 128, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
          }
        }
      `}</style>
    </div>
  )
}
