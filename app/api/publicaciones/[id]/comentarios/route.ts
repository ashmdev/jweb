import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromCookie } from "@/lib/auth"

// POST - Crear un nuevo comentario en una publicación
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
    if (!data.texto || data.texto.trim() === "") {
      return NextResponse.json({ error: "El texto del comentario es requerido" }, { status: 400 })
    }

    // Crear nuevo comentario (simulado)
    const nuevoComentario = {
      id: Math.floor(Math.random() * 1000) + 100,
      publicacionId,
      autor: {
        id: user.id,
        nombre: user.name,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      texto: data.texto,
      fecha: new Date().toISOString(),
      respuestaAId: data.respuestaAId,
      reacciones: {},
      misReacciones: [],
    }

    return NextResponse.json(nuevoComentario)
  } catch (error) {
    console.error("Error al crear comentario:", error)
    return NextResponse.json({ error: "Error al crear comentario" }, { status: 500 })
  }
}
