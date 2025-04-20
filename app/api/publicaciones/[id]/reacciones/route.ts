import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromCookie } from "@/lib/auth"

// POST - Agregar una reacción a una publicación
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Obtener usuario actual
    const cookieStore = cookies()
    const user = await getUserFromCookie(cookieStore)

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const publicacionId = Number.parseInt(params.id)
    const data = await request.json()

    // Validar datos
    if (!data.tipo) {
      return NextResponse.json({ error: "El tipo de reacción es requerido" }, { status: 400 })
    }

    // Simular actualización de reacciones
    const reacciones = {
      me_gusta: 6,
      me_encanta: 2,
    }
    reacciones[data.tipo] = (reacciones[data.tipo] || 0) + 1

    // Simular mis reacciones
    const misReacciones = [data.tipo]

    return NextResponse.json({ reacciones, misReacciones })
  } catch (error) {
    console.error("Error al agregar reacción:", error)
    return NextResponse.json({ error: "Error al agregar reacción" }, { status: 500 })
  }
}
