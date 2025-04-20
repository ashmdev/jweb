import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import type { Comentario, ComentarioInput } from "@/types/comentario"

// Referencia a la "base de datos" simulada
// Esta variable debe ser declarada en el archivo real que contiene la base de datos
// Aquí solo la referenciamos para el ejemplo
const comentariosDB: Comentario[] = []

// ID para nuevos comentarios
let nextComentarioId = 10

export async function POST(request: Request) {
  try {
    const user = getUser()

    if (!user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const body: ComentarioInput = await request.json()

    if (!body.texto || !body.partidoId) {
      return NextResponse.json({ message: "Faltan datos requeridos" }, { status: 400 })
    }

    // Crear nuevo comentario
    const nuevoComentario: Comentario = {
      id: nextComentarioId++,
      partidoId: body.partidoId,
      autor: {
        id: user.id,
        nombre: user.name,
        avatar: user.avatar || "/placeholder.svg?height=40&width=40",
      },
      texto: body.texto,
      fecha: new Date().toISOString(),
      reacciones: {
        me_gusta: 0,
        no_me_gusta: 0,
        me_encanta: 0,
        divertido: 0,
        sorprendido: 0,
        triste: 0,
        enojado: 0,
      },
      misReacciones: [],
    }

    // Si es una respuesta, agregar el ID del comentario padre
    if (body.respuestaAId) {
      nuevoComentario.respuestaAId = body.respuestaAId
    }

    // Agregar a la "base de datos"
    comentariosDB.push(nuevoComentario)

    return NextResponse.json(nuevoComentario)
  } catch (error) {
    console.error("Error al crear comentario:", error)
    return NextResponse.json({ message: "Error al crear comentario" }, { status: 500 })
  }
}
