import type {
  Publicacion,
  PublicacionDetallada,
  PublicacionInput,
  ComentarioPublicacionInput,
  ReaccionPublicacionInput,
  Comentario,
} from "@/types/publicacion"
import type { TipoReaccion } from "@/types/comentario"
import type { Hashtag } from "@/types/hashtag"

// Obtener publicaciones de la comunidad (amigos y propias)
export async function getPublicaciones(): Promise<Publicacion[]> {
  try {
    const response = await fetch("/api/publicaciones")

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al obtener publicaciones")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en getPublicaciones:", error)
    throw new Error(error.message || "No se pudieron cargar las publicaciones")
  }
}

// Obtener una publicación específica con sus comentarios
export async function getPublicacionById(id: number): Promise<PublicacionDetallada> {
  try {
    const response = await fetch(`/api/publicaciones/${id}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al obtener la publicación")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en getPublicacionById:", error)
    throw new Error(error.message || "No se pudo cargar la publicación")
  }
}

// Crear una nueva publicación
export async function crearPublicacion(publicacion: PublicacionInput): Promise<Publicacion> {
  try {
    const response = await fetch("/api/publicaciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(publicacion),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al crear la publicación")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en crearPublicacion:", error)
    throw new Error(error.message || "No se pudo crear la publicación")
  }
}

// Eliminar una publicación
export async function eliminarPublicacion(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/publicaciones/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al eliminar la publicación")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en eliminarPublicacion:", error)
    throw new Error(error.message || "No se pudo eliminar la publicación")
  }
}

// Comentar una publicación
export async function comentarPublicacion(comentario: ComentarioPublicacionInput): Promise<Comentario> {
  try {
    const response = await fetch(`/api/publicaciones/${comentario.publicacionId}/comentarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comentario),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al comentar la publicación")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en comentarPublicacion:", error)
    throw new Error(error.message || "No se pudo comentar la publicación")
  }
}

// Reaccionar a una publicación
export async function reaccionarPublicacion(reaccion: ReaccionPublicacionInput): Promise<{
  reacciones: Record<TipoReaccion, number>
  misReacciones: TipoReaccion[]
}> {
  try {
    const response = await fetch(`/api/publicaciones/${reaccion.publicacionId}/reacciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tipo: reaccion.tipo }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al reaccionar a la publicación")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en reaccionarPublicacion:", error)
    throw new Error(error.message || "No se pudo procesar la reacción")
  }
}

// Quitar una reacción de una publicación
export async function quitarReaccionPublicacion(
  publicacionId: number,
  tipo: TipoReaccion,
): Promise<{
  reacciones: Record<TipoReaccion, number>
  misReacciones: TipoReaccion[]
}> {
  try {
    const response = await fetch(`/api/publicaciones/${publicacionId}/reacciones/${tipo}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al quitar la reacción")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en quitarReaccionPublicacion:", error)
    throw new Error(error.message || "No se pudo quitar la reacción")
  }
}

// Obtener hashtags populares
export async function getHashtagsPopulares(): Promise<Hashtag[]> {
  try {
    const response = await fetch("/api/publicaciones/hashtags")

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al obtener hashtags")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error en getHashtagsPopulares:", error)
    throw new Error(error.message || "No se pudieron cargar los hashtags")
  }
}
