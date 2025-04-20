import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/lib/auth"

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: () => boolean
}

// Usuario demo por defecto
const demoUser: User = {
  id: 0,
  name: "Usuario Demo",
  email: "demo@joinfutbol.com",
  role: "jugador",
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      isAuthenticated: () => {
        const currentUser = get().user
        return !!currentUser && currentUser.id !== 0
      },
    }),
    {
      name: "user-storage",
      // Solo persistir el usuario, no las funciones
      partialize: (state) => ({ user: state.user }),
      // Cargar el usuario demo si no hay usuario en el storage
      onRehydrateStorage: () => (set) => {
        return (state) => {
          if (!state || !state.user) {
            setTimeout(() => {
              set({ user: demoUser })
            }, 0)
          }
        }
      },
    },
  ),
)
