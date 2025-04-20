import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromCookie } from "@/lib/auth"

// DELETE - Quitar una reacción de una publicación
export async function DELETE(request: Request, { params }: { params: { id: string; tipo: string } }) {
  try {
    // Obtener usuario actual
    const cookieStore = cookies()
    const user = await getUserFromCookie(cookieStore)

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const publicacionId = Number.parseInt(params.id)
    const tipo = params.tipo

    // Simular actualización de reacciones
    const reacciones = {
      me_gusta: 5,
      me_encanta: 2,
    }

    if (reacciones[tipo] && reacciones[tipo] > 0) {
      reacciones[tipo] -= 1
    }

    // Simular mis reacciones (vacío después de quitar)
    const misReacciones: string[] = []

    return NextResponse.json({ reacciones, misReacciones })
  } catch (error) {
    console.error("Error al quitar reacción:", error)
    return NextResponse.json({ error: "Error al quitar reacción" }, { status: 500 })
  }
}
