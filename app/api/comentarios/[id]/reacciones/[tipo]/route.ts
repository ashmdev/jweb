import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import type { Comentario, TipoReaccion } from "@/types/comentario"

// Referencia a la "base de datos" simulada
const comentariosDB: Comentario[] = []

export async function DELETE(request: Request, { params }: { params: { id: string; tipo: string } }) {
  try {
    const user = getUser()

    if (!user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const comentarioId = Number.parseInt(params.id)

    if (isNaN(comentarioId)) {
      return NextResponse.json({ message: "ID de comentario inválido" }, { status: 400 })
    }

    const tipo = params.tipo as TipoReaccion

    if (
      !tipo ||
      !Object.values([
        "me_gusta",
        "no_me_gusta",
        "me_encanta",
        "divertido",
        "sorprendido",
        "triste",
        "enojado",
      ]).includes(tipo)
    ) {
      return NextResponse.json({ message: "Tipo de reacción inválido" }, { status: 400 })
    }

    // Buscar el comentario
    const comentarioIndex = comentariosDB.findIndex((c) => c.id === comentarioId)

    if (comentarioIndex === -1) {
      return NextResponse.json({ message: "Comentario no encontrado" }, { status: 404 })
    }

    const comentario = comentariosDB[comentarioIndex]

    // Verificar si el usuario tiene esta reacción
    const tieneReaccion = comentario.misReacciones.includes(tipo)

    if (!tieneReaccion) {
      return NextResponse.json({ message: "No has reaccionado con este tipo" }, { status: 400 })
    }

    // Actualizar reacciones
    comentario.reacciones[tipo] = Math.max(0, (comentario.reacciones[tipo] || 0) - 1)
    comentario.misReacciones = comentario.misReacciones.filter((r) => r !== tipo)

    // Actualizar en la "base de datos"
    comentariosDB[comentarioIndex] = comentario

    return NextResponse.json({
      reacciones: comentario.reacciones,
      misReacciones: comentario.misReacciones,
    })
  } catch (error) {
    console.error("Error al quitar reacción:", error)
    return NextResponse.json({ message: "Error al quitar la reacción" }, { status: 500 })
  }
}
