import { create } from "zustand"

export interface Player {
  id: string
  name: string
  image?: string
}

export interface Position {
  id: string
  name: string
  team: "A" | "B"
  x: number
  y: number
  cost: number
  available: boolean
  reservedBy?: string
  reservedByUser?: string
  player?: Player
}

interface DialogState {
  isConfirmationOpen: boolean
  isInviteFriendOpen: boolean
  isPlayerInfoOpen: boolean
  selectedPosition: Position | null

  // Acciones
  openConfirmation: (position: Position) => void
  closeConfirmation: () => void
  openInviteFriend: (position: Position) => void
  closeInviteFriend: () => void
  openPlayerInfo: (position: Position) => void
  closePlayerInfo: () => void
  setSelectedPosition: (position: Position | null) => void
  resetDialogs: () => void
}

export const useDialogStore = create<DialogState>((set) => ({
  isConfirmationOpen: false,
  isInviteFriendOpen: false,
  isPlayerInfoOpen: false,
  selectedPosition: null,

  openConfirmation: (position) => set({ isConfirmationOpen: true, selectedPosition: position }),
  closeConfirmation: () => set({ isConfirmationOpen: false }),
  openInviteFriend: (position) => set({ isInviteFriendOpen: true, selectedPosition: position }),
  closeInviteFriend: () => set({ isInviteFriendOpen: false }),
  openPlayerInfo: (position) => set({ isPlayerInfoOpen: true, selectedPosition: position }),
  closePlayerInfo: () => set({ isPlayerInfoOpen: false }),
  setSelectedPosition: (position) => set({ selectedPosition: position }),
  resetDialogs: () =>
    set({
      isConfirmationOpen: false,
      isInviteFriendOpen: false,
      isPlayerInfoOpen: false,
      selectedPosition: null,
    }),
}))
