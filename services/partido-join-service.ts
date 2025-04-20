import type { Amigo } from "@/types/amigo"

// Función para obtener los amigos disponibles para invitar
export async function getAmigosDisponibles(): Promise<Amigo[]> {
  try {
    const response = await fetch("/api/amigos", {
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Error al obtener los amigos disponibles")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en getAmigosDisponibles:", error)
    throw error
  }
}

// Función para verificar si un usuario está participando en un partido
export async function verificarParticipacion(partidoId: number) {
  // Simulación de una llamada a la API
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Devolver datos de prueba
  return {
    participando: false,
    equipoId: undefined,
    posicion: undefined,
  }
}

// Función para unirse a un partido
export async function unirseAPartido(partidoId: number, equipoId: number, posicionKey: string, posicionNombre: string) {
  // Simulación de una llamada a la API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Devolver datos de prueba
  return {
    success: true,
    message: "Te has unido al partido correctamente",
  }
}

// Función para cancelar participación en un partido
export async function cancelarParticipacion(partidoId: number) {
  // Simulación de una llamada a la API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Devolver datos de prueba
  return {
    success: true,
    message: "Has cancelado tu participación en el partido",
  }
}

// Función para invitar a un amigo existente a un partido
export async function invitarAmigoExistente(
  partidoId: number,
  equipoId: number,
  posicion: string,
  amigoId: number,
  costo: number,
  posicionKey?: string,
  posicionX?: number,
  posicionY?: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/partidos/invitar-amigo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        partidoId,
        equipoId,
        posicion,
        amigoId,
        costo,
        posicionKey,
        posicionX,
        posicionY,
      }),
      credentials: "include",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error al invitar al amigo")
    }

    return data
  } catch (error) {
    console.error("Error en invitarAmigoExistente:", error)
    throw error
  }
}

// Función para invitar a un nuevo amigo a un partido
export async function invitarNuevoAmigo(
  partidoId: number,
  equipoId: number,
  posicion: string,
  nombre: string,
  email: string,
  telefono: string,
  costo: number,
  posicionKey?: string,
  posicionX?: number,
  posicionY?: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/partidos/invitar-nuevo-amigo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        partidoId,
        equipoId,
        posicion,
        nombre,
        email,
        telefono,
        costo,
        posicionKey,
        posicionX,
        posicionY,
      }),
      credentials: "include",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error al invitar al nuevo amigo")
    }

    return data
  } catch (error) {
    console.error("Error en invitarNuevoAmigo:", error)
    throw error
  }
}
