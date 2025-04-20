import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromCookie } from "@/lib/auth"

// Datos de ejemplo para publicaciones
let publicaciones = [
  {
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
    misReacciones: [],
  },
  {
    id: 2,
    usuarioId: 2,
    usuario: {
      id: 2,
      nombre: "Ana García",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    texto: "Buscando equipo para el torneo del fin de semana. ¿Alguien se apunta? #torneo #futbol",
    hashtags: [
      { id: 1, texto: "futbol" },
      { id: 3, texto: "torneo" },
    ],
    imagenes: [],
    fechaCreacion: new Date(Date.now() - 86400000).toISOString(),
    comentarios: 3,
    reacciones: {
      me_gusta: 8,
      divertido: 1,
    },
    misReacciones: [],
  },
  {
    id: 3,
    usuarioId: 3,
    usuario: {
      id: 3,
      nombre: "Carlos Rodríguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    texto: "Nuevo balón para la temporada. ¡A estrenar! #equipamiento #futbol",
    hashtags: [
      { id: 1, texto: "futbol" },
      { id: 4, texto: "equipamiento" },
    ],
    imagenes: ["/placeholder.svg?height=300&width=500"],
    fechaCreacion: new Date(Date.now() - 172800000).toISOString(),
    comentarios: 1,
    reacciones: {
      me_gusta: 12,
      me_encanta: 3,
    },
    misReacciones: [],
  },
]

// GET - Obtener todas las publicaciones
export async function GET() {
  try {
    // Obtener usuario actual
    const cookieStore = cookies()
    const user = await getUserFromCookie(cookieStore)

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Simular que algunas publicaciones tienen reacciones del usuario actual
    const publicacionesConReacciones = publicaciones.map((pub) => ({
      ...pub,
      misReacciones: Math.random() > 0.7 ? ["me_gusta"] : [],
    }))

    return NextResponse.json(publicacionesConReacciones)
  } catch (error) {
    console.error("Error al obtener publicaciones:", error)
    return NextResponse.json({ error: "Error al obtener publicaciones" }, { status: 500 })
  }
}

// POST - Crear una nueva publicación
export async function POST(request: Request) {
  try {
    // Obtener usuario actual
    const cookieStore = cookies()
    const user = await getUserFromCookie(cookieStore)

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()

    // Validar datos
    if (!data.texto || data.texto.trim() === "") {
      return NextResponse.json({ error: "El texto de la publicación es requerido" }, { status: 400 })
    }

    // Procesar hashtags
    const hashtagsTexto = data.hashtags || []
    const hashtags = hashtagsTexto.map((texto: string, index: number) => ({
      id: 100 + index, // IDs ficticios
      texto: texto.replace(/^#/, ""), // Eliminar # si existe
    }))

    // Crear nueva publicación
    const nuevaPublicacion = {
      id: publicaciones.length + 1,
      usuarioId: user.id,
      usuario: {
        id: user.id,
        nombre: user.name,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      texto: data.texto,
      hashtags,
      imagenes: data.imagenes || [],
      fechaCreacion: new Date().toISOString(),
      comentarios: 0,
      reacciones: {},
      misReacciones: [],
    }

    // Agregar a la lista de publicaciones
    publicaciones = [nuevaPublicacion, ...publicaciones]

    return NextResponse.json(nuevaPublicacion)
  } catch (error) {
    console.error("Error al crear publicación:", error)
    return NextResponse.json({ error: "Error al crear publicación" }, { status: 500 })
  }
}
