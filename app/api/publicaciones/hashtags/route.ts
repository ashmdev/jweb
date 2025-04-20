import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromCookie } from "@/lib/auth"

// GET - Obtener hashtags populares
export async function GET() {
  try {
    // Obtener usuario actual
    const cookieStore = cookies()
    const user = await getUserFromCookie(cookieStore)

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Hashtags de ejemplo
    const hashtags = [
      { id: 1, texto: "futbol", count: 15 },
      { id: 2, texto: "amigos", count: 8 },
      { id: 3, texto: "torneo", count: 6 },
      { id: 4, texto: "equipamiento", count: 4 },
      { id: 5, texto: "entrenamiento", count: 3 },
    ]

    return NextResponse.json(hashtags)
  } catch (error) {
    console.error("Error al obtener hashtags:", error)
    return NextResponse.json({ error: "Error al obtener hashtags" }, { status: 500 })
  }
}
