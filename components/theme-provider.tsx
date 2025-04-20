"use client"

import type React from "react"

import { useEffect } from "react"
import { useAparienciaConfigStore } from "@/lib/stores/config-store"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { tema, interfazCompacta, mostrarAnimaciones, aplicarTema } = useAparienciaConfigStore()

  // Aplicar el tema cuando el componente se monta y cuando cambian las preferencias
  useEffect(() => {
    // Aplicar tema inmediatamente al montar el componente
    aplicarTema()

    // Configurar un observador para cambios en preferencias del sistema
    if (tema === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      // Función para manejar cambios en la preferencia del sistema
      const handleChange = () => {
        aplicarTema()
      }

      // Agregar listener
      mediaQuery.addEventListener("change", handleChange)

      // Limpiar listener al desmontar
      return () => {
        mediaQuery.removeEventListener("change", handleChange)
      }
    }
  }, [tema, interfazCompacta, mostrarAnimaciones, aplicarTema])

  return <>{children}</>
}
