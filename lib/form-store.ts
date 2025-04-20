import { create } from "zustand"

interface FormState {
  isForFriend: boolean
  selectedFriend: string | null
  newFriendName: string
  newFriendEmail: string
  newFriendPhone: string
  showNewFriendForm: boolean

  // Acciones
  setIsForFriend: (value: boolean) => void
  setSelectedFriend: (friendId: string) => void
  setNewFriendName: (name: string) => void
  setNewFriendEmail: (email: string) => void
  setNewFriendPhone: (phone: string) => void
  setShowNewFriendForm: (show: boolean) => void
  toggleNewFriendForm: () => void
  resetForm: () => void
  validateFriendForm: () => { isValid: boolean; errorMessage: string }
}

export const useFormStore = create<FormState>((set, get) => ({
  isForFriend: false,
  selectedFriend: null,
  newFriendName: "",
  newFriendEmail: "",
  newFriendPhone: "",
  showNewFriendForm: false,

  setIsForFriend: (value) => set({ isForFriend: value }),
  setSelectedFriend: (friendId) => set({ selectedFriend: friendId }),
  setNewFriendName: (name) => set({ newFriendName: name }),
  setNewFriendEmail: (email) => set({ newFriendEmail: email }),
  setNewFriendPhone: (phone) => set({ newFriendPhone: phone }),
  setShowNewFriendForm: (show) => set({ showNewFriendForm: show }),
  toggleNewFriendForm: () => set((state) => ({ showNewFriendForm: !state.showNewFriendForm })),
  resetForm: () =>
    set({
      isForFriend: false,
      selectedFriend: null,
      newFriendName: "",
      newFriendEmail: "",
      newFriendPhone: "",
      showNewFriendForm: false,
    }),
  validateFriendForm: () => {
    const state = get()

    if (!state.showNewFriendForm && !state.selectedFriend) {
      return { isValid: false, errorMessage: "Debes seleccionar un amigo" }
    }

    if (state.showNewFriendForm) {
      if (!state.newFriendName) {
        return { isValid: false, errorMessage: "El nombre del amigo es obligatorio" }
      }
      if (!state.newFriendEmail) {
        return { isValid: false, errorMessage: "El correo del amigo es obligatorio" }
      }
      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(state.newFriendEmail)) {
        return { isValid: false, errorMessage: "El correo electrónico no es válido" }
      }
    }

    return { isValid: true, errorMessage: "" }
  },
}))
