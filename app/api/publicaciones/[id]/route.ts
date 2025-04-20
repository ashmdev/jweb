import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromCookie } from "@/lib/auth"

// Datos de ejemplo para comentarios
const comentariosEjemplo = [
  {
    id: 1,
    publicacionId: 1,
    autor: {
      id: 2,
      nombre: "Ana García",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    texto: "¡Excelente partido! Deberíamos organizar otro pronto.",
    fecha: new Date(Date.now() - 1800000).toISOString(),
    reacciones: {
      me_gusta: 2,
    },
    misReacciones: [],
  },
  {
    id: 2,
    publicacionId: 1,
    autor: {
      id: 3,
      nombre: "Carlos Rodríguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    texto: "La próxima vez me apunto yo también.",
    fecha: new Date(Date.now() - 900000).toISOString(),
    reacciones: {
      me_gusta: 1,
    },
    misReacciones: [],
  },
]

// GET - Obtener una publicación específica con sus comentarios
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Obtener usuario actual
    const cookieStore = cookies()
    const user = await getUserFromCookie(cookieStore)

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    // Buscar la publicación en los datos de ejemplo
    // En una aplicación real, esto sería una consulta a la base de datos
    const publicacion = {
      id: 1,
      usuarioId: 1,
      usuario: {
        id: 1,
        nombre: "Juan Pérez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      texto: "¡Gran partido ayer! #futbol #amigos",
      hashtags: [
        { id: 1, texto: "futbol" },
        { id: 2, texto: "amigos" },
      ],
      imagenes: ["/placeholder.svg?height=300&width=500"],
      fechaCreacion: new Date(Date.now() - 3600000).toISOString(),
      comentarios: 2,
      reacciones: {
        me_gusta: 5,
        me_encanta: 2,
      },
      misReacciones: Math.random() > 0.5 ? ["me_gusta"] : [],
      comentariosData: comentariosEjemplo.map((c) => ({
        ...c,
        misReacciones: Math.random() > 0.7 ? ["me_gusta"] : [],
      })),
    }

    if (!publicacion) {
      return NextResponse.json({ error: "Publicación no encontrada" }, { status: 404 })
    }

    return NextResponse.json(publicacion)
  } catch (error) {
    console.error("Error al obtener publicación:", error)
    return NextResponse.json({ error: "Error al obtener publicación" }, { status: 500 })
  }
}

// DELETE - Eliminar una publicación
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Obtener usuario actual
    const cookieStore = cookies()
    const user = await getUserFromCookie(cookieStore)

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    // En una aplicación real, verificaríamos que el usuario sea el propietario
    // y eliminaríamos la publicación de la base de datos

    return NextResponse.json({ success: true, message: "Publicación eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar publicación:", error)
    return NextResponse.json({ error: "Error al eliminar publicación" }, { status: 500 })
  }
}
