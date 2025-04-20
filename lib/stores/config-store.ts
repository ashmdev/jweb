import { create } from "zustand"
import { persist } from "zustand/middleware"

// Estado para configuración general
interface GeneralConfigState {
  idioma: string
  zonaHoraria: string
  unidadesMetricas: boolean
  setIdioma: (idioma: string) => void
  setZonaHoraria: (zonaHoraria: string) => void
  setUnidadesMetricas: (unidadesMetricas: boolean) => void
}

export const useGeneralConfigStore = create<GeneralConfigState>()(
  persist(
    (set) => ({
      idioma: "es",
      zonaHoraria: "america-santiago",
      unidadesMetricas: true,
      setIdioma: (idioma) => set({ idioma }),
      setZonaHoraria: (zonaHoraria) => set({ zonaHoraria }),
      setUnidadesMetricas: (unidadesMetricas) => set({ unidadesMetricas }),
    }),
    {
      name: "general-config-storage",
      partialize: (state) => ({
        idioma: state.idioma,
        zonaHoraria: state.zonaHoraria,
        unidadesMetricas: state.unidadesMetricas,
      }),
    },
  ),
)

// Estado para configuración de apariencia
interface AparienciaConfigState {
  tema: "light" | "dark" | "system"
  interfazCompacta: boolean
  mostrarAnimaciones: boolean
  setTema: (tema: "light" | "dark" | "system") => void
  setInterfazCompacta: (interfazCompacta: boolean) => void
  setMostrarAnimaciones: (mostrarAnimaciones: boolean) => void
  aplicarTema: () => void
}

export const useAparienciaConfigStore = create<AparienciaConfigState>()(
  persist(
    (set, get) => ({
      tema: "light",
      interfazCompacta: false,
      mostrarAnimaciones: true,
      setTema: (tema) => set({ tema }),
      setInterfazCompacta: (interfazCompacta) => set({ interfazCompacta }),
      setMostrarAnimaciones: (mostrarAnimaciones) => set({ mostrarAnimaciones }),
      aplicarTema: () => {
        const { tema, interfazCompacta, mostrarAnimaciones } = get()
        const root = document.documentElement

        // Aplicar tema
        if (tema === "dark") {
          root.classList.add("dark")
        } else if (tema === "light") {
          root.classList.remove("dark")
        } else if (tema === "system") {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
          if (prefersDark) {
            root.classList.add("dark")
          } else {
            root.classList.remove("dark")
          }
        }

        // Aplicar clase para interfaz compacta
        if (interfazCompacta) {
          root.classList.add("interfaz-compacta")
        } else {
          root.classList.remove("interfaz-compacta")
        }

        // Aplicar clase para animaciones
        if (!mostrarAnimaciones) {
          root.classList.add("sin-animaciones")
        } else {
          root.classList.remove("sin-animaciones")
        }
      },
    }),
    {
      name: "apariencia-config-storage",
      partialize: (state) => ({
        tema: state.tema,
        interfazCompacta: state.interfazCompacta,
        mostrarAnimaciones: state.mostrarAnimaciones,
      }),
      onRehydrateStorage: () => (state) => {
        // Aplicar tema al cargar el estado
        if (state) {
          setTimeout(() => {
            state.aplicarTema()
          }, 0)
        }
      },
    },
  ),
)

// Estado para configuración de privacidad
interface PrivacidadConfigState {
  perfilPublico: boolean
  mostrarEstadisticas: boolean
  mostrarUbicacion: boolean
  compartirDatos: boolean
  aceptarCookies: boolean
  setPerfilPublico: (perfilPublico: boolean) => void
  setMostrarEstadisticas: (mostrarEstadisticas: boolean) => void
  setMostrarUbicacion: (mostrarUbicacion: boolean) => void
  setCompartirDatos: (compartirDatos: boolean) => void
  setAceptarCookies: (aceptarCookies: boolean) => void
}

export const usePrivacidadConfigStore = create<PrivacidadConfigState>()(
  persist(
    (set) => ({
      perfilPublico: true,
      mostrarEstadisticas: true,
      mostrarUbicacion: false,
      compartirDatos: true,
      aceptarCookies: true,
      setPerfilPublico: (perfilPublico) => set({ perfilPublico }),
      setMostrarEstadisticas: (mostrarEstadisticas) => set({ mostrarEstadisticas }),
      setMostrarUbicacion: (mostrarUbicacion) => set({ mostrarUbicacion }),
      setCompartirDatos: (compartirDatos) => set({ compartirDatos }),
      setAceptarCookies: (aceptarCookies) => set({ aceptarCookies }),
    }),
    {
      name: "privacidad-config-storage",
      partialize: (state) => ({
        perfilPublico: state.perfilPublico,
        mostrarEstadisticas: state.mostrarEstadisticas,
        mostrarUbicacion: state.mostrarUbicacion,
        compartirDatos: state.compartirDatos,
        aceptarCookies: state.aceptarCookies,
      }),
    },
  ),
)
