import type { Partido } from "@/types/partido"

// Función para obtener todos los partidos
export async function getPartidos(): Promise<Partido[]> {
  try {
    // En una aplicación real, esta sería una llamada a tu API
    const response = await fetch("/api/partidos", {
      credentials: "include",
    })

    if (!response.ok) {
      // Intentar obtener el mensaje de error
      let errorMessage = "Error al obtener los partidos"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // Si no podemos parsear el JSON, usamos el texto de la respuesta
        errorMessage = await response.text()
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error("Error en getPartidos:", error)
    throw error
  }
}

// Función para obtener un partido específico por ID
export async function getPartidoById(id: number): Promise<Partido> {
  try {
    // En una aplicación real, esta sería una llamada a tu API
    const response = await fetch(`/api/partidos/${id}`, {
      credentials: "include",
    })

    if (!response.ok) {
      // Intentar obtener el mensaje de error
      let errorMessage = `Error al obtener el partido con ID ${id}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // Si no podemos parsear el JSON, verificamos si es HTML
        const text = await response.text()
        if (text.includes("<!DOCTYPE") || text.includes("<html")) {
          errorMessage = "El servidor devolvió HTML en lugar de JSON. Posible error del servidor."
        } else {
          errorMessage = text || errorMessage
        }
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error en getPartidoById(${id}):`, error)
    throw error
  }
}
