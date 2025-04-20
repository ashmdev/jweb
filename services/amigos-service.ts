import type { Amigo, SolicitudAmistad } from "@/types/amigo"

// Función para obtener todos los amigos
export async function getAmigos(): Promise<Amigo[]> {
  try {
    // En una aplicación real, esta sería una llamada a tu API
    const response = await fetch("/api/amigos")

    if (!response.ok) {
      throw new Error("Error al obtener los amigos")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en getAmigos:", error)
    throw error
  }
}

// Función para obtener las solicitudes de amistad pendientes
export async function getSolicitudesAmistad(): Promise<SolicitudAmistad[]> {
  try {
    const response = await fetch("/api/amigos/solicitudes")

    if (!response.ok) {
      throw new Error("Error al obtener las solicitudes de amistad")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en getSolicitudesAmistad:", error)
    throw error
  }
}

// Función para enviar una solicitud de amistad
export async function enviarSolicitudAmistad(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/amigos/solicitudes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error al enviar la solicitud de amistad")
    }

    return data
  } catch (error) {
    console.error("Error en enviarSolicitudAmistad:", error)
    throw error
  }
}

// Función para aceptar una solicitud de amistad
export async function aceptarSolicitudAmistad(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/amigos/solicitudes/${id}/aceptar`, {
      method: "POST",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error al aceptar la solicitud de amistad")
    }

    return data
  } catch (error) {
    console.error("Error en aceptarSolicitudAmistad:", error)
    throw error
  }
}

// Función para rechazar una solicitud de amistad
export async function rechazarSolicitudAmistad(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/amigos/solicitudes/${id}/rechazar`, {
      method: "POST",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error al rechazar la solicitud de amistad")
    }

    return data
  } catch (error) {
    console.error("Error en rechazarSolicitudAmistad:", error)
    throw error
  }
}

// Función para eliminar un amigo
export async function eliminarAmigo(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/amigos/${id}`, {
      method: "DELETE",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error al eliminar el amigo")
    }

    return data
  } catch (error) {
    console.error("Error en eliminarAmigo:", error)
    throw error
  }
}

// Función para buscar jugadores por email o nombre
export async function buscarJugadores(query: string): Promise<Amigo[]> {
  try {
    const response = await fetch(`/api/jugadores/buscar?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error("Error al buscar jugadores")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en buscarJugadores:", error)
    throw error
  }
}
