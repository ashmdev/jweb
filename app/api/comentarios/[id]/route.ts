import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import type { Comentario } from "@/types/comentario"

// Referencia a la "base de datos" simulada
let comentariosDB: Comentario[] = []

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUser()

    if (!user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const comentarioId = Number.parseInt(params.id)

    if (isNaN(comentarioId)) {
      return NextResponse.json({ message: "ID de comentario inválido" }, { status: 400 })
    }

    // Buscar el comentario
    const comentario = comentariosDB.find((c) => c.id === comentarioId)

    if (!comentario) {
      return NextResponse.json({ message: "Comentario no encontrado" }, { status: 404 })
    }

    // Verificar que el usuario sea el autor del comentario
    if (comentario.autor.id !== user.id) {
      return NextResponse.json({ message: "No tienes permiso para eliminar este comentario" }, { status: 403 })
    }

    // Eliminar el comentario y sus respuestas
    comentariosDB = comentariosDB.filter((c) => c.id !== comentarioId && c.respuestaAId !== comentarioId)

    return NextResponse.json({
      success: true,
      message: "Comentario eliminado correctamente",
    })
  } catch (error) {
    console.error("Error al eliminar comentario:", error)
    return NextResponse.json({ message: "Error al eliminar comentario" }, { status: 500 })
  }
}
