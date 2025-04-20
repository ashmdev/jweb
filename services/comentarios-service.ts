import type { Comentario, ComentarioInput, ReaccionInput, TipoReaccion } from "@/types/comentario"

// Obtener comentarios de un partido
export async function getComentariosByPartidoId(partidoId: number): Promise<Comentario[]> {
  try {
    const response = await fetch(`/api/partidos/${partidoId}/comentarios`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al obtener comentarios")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en getComentariosByPartidoId:", error)
    throw new Error(error.message || "No se pudieron cargar los comentarios")
  }
}

// Crear un nuevo comentario
export async function crearComentario(comentario: ComentarioInput): Promise<Comentario> {
  try {
    const response = await fetch("/api/comentarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comentario),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al crear comentario")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en crearComentario:", error)
    throw new Error(error.message || "No se pudo crear el comentario")
  }
}

// Eliminar un comentario
export async function eliminarComentario(comentarioId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/comentarios/${comentarioId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al eliminar comentario")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en eliminarComentario:", error)
    throw new Error(error.message || "No se pudo eliminar el comentario")
  }
}

// Reaccionar a un comentario
export async function reaccionarComentario(reaccion: ReaccionInput): Promise<{
  reacciones: Record<TipoReaccion, number>
  misReacciones: TipoReaccion[]
}> {
  try {
    const response = await fetch(`/api/comentarios/${reaccion.comentarioId}/reacciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tipo: reaccion.tipo }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al reaccionar al comentario")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en reaccionarComentario:", error)
    throw new Error(error.message || "No se pudo procesar la reacción")
  }
}

// Quitar una reacción
export async function quitarReaccion(
  comentarioId: number,
  tipo: TipoReaccion,
): Promise<{
  reacciones: Record<TipoReaccion, number>
  misReacciones: TipoReaccion[]
}> {
  try {
    const response = await fetch(`/api/comentarios/${comentarioId}/reacciones/${tipo}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al quitar la reacción")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en quitarReaccion:", error)
    throw new Error(error.message || "No se pudo quitar la reacción")
  }
}
