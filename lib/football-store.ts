import { create } from "zustand"
import type { Position, Player } from "./dialog-store"

// Datos de ejemplo para amigos
export const friends: Player[] = [
  { id: "1", name: "Carlos Rodríguez", image: "/placeholder.svg?height=200&width=200" },
  { id: "2", name: "Ana Martínez", image: "/placeholder.svg?height=200&width=200" },
  { id: "3", name: "Juan Pérez", image: "/placeholder.svg?height=200&width=200" },
  { id: "4", name: "María López", image: "/placeholder.svg?height=200&width=200" },
]

interface FootballState {
  positions: Position[]
  userCredits: number
  userId: string
  isLoading: boolean

  // Acciones
  setPositions: (positions: Position[]) => void
  updatePosition: (positionId: string, data: Partial<Position>) => void
  reservePosition: (positionId: string, userId: string, forFriend?: boolean, friendId?: string) => void
  cancelReservation: (positionId: string) => void
  setUserCredits: (credits: number) => void
  setIsLoading: (loading: boolean) => void
}

export const useFootballStore = create<FootballState>((set) => ({
  positions: [],
  userCredits: 100, // Créditos de ejemplo
  userId: "123", // ID de usuario de ejemplo
  isLoading: false,

  setPositions: (positions) => set({ positions }),
  updatePosition: (positionId, data) =>
    set((state) => ({
      positions: state.positions.map((pos) => (pos.id === positionId ? { ...pos, ...data } : pos)),
    })),
  reservePosition: (positionId, userId, forFriend = false, friendId) =>
    set((state) => {
      const position = state.positions.find((pos) => pos.id === positionId)
      if (!position) return state

      const cost = position.cost

      // Actualizar posición
      const updatedPositions = state.positions.map((pos) => {
        if (pos.id === positionId) {
          return {
            ...pos,
            available: false,
            reservedBy: userId,
            reservedByUser: forFriend ? userId : undefined,
            player:
              forFriend && friendId ? friends.find((f) => f.id === friendId) : { id: userId, name: "Usuario Actual" },
          }
        }
        return pos
      })

      // Restar créditos
      return {
        positions: updatedPositions,
        userCredits: state.userCredits - cost,
      }
    }),
  cancelReservation: (positionId) =>
    set((state) => {
      const position = state.positions.find((pos) => pos.id === positionId)
      if (!position) return state

      const cost = position.cost

      // Actualizar posición
      const updatedPositions = state.positions.map((pos) => {
        if (pos.id === positionId) {
          return {
            ...pos,
            available: true,
            reservedBy: undefined,
            reservedByUser: undefined,
            player: undefined,
          }
        }
        return pos
      })

      // Devolver créditos
      return {
        positions: updatedPositions,
        userCredits: state.userCredits + cost,
      }
    }),
  setUserCredits: (credits) => set({ userCredits: credits }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}))
