import { NextResponse } from "next/server"
import type { Comentario } from "@/types/comentario"

// Datos de ejemplo para simular una base de datos
const comentariosDB: Comentario[] = [
  {
    id: 1,
    partidoId: 1,
    autor: {
      id: 999,
      nombre: "Usuario Demo",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    texto: "¡Qué buen partido! Estoy emocionado por participar.",
    fecha: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
    reacciones: {
      me_gusta: 3,
      me_encanta: 1,
      divertido: 0,
      sorprendido: 0,
      triste: 0,
      enojado: 0,
      no_me_gusta: 0,
    },
    misReacciones: ["me_gusta"],
    respuestas: [
      {
        id: 2,
        partidoId: 1,
        autor: {
          id: 2,
          nombre: "Carlos Rodríguez",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        texto: "¡Yo también! ¿En qué posición jugarás?",
        fecha: new Date(Date.now() - 1800000).toISOString(), // 30 minutos atrás
        respuestaAId: 1,
        reacciones: {
          me_gusta: 1,
          me_encanta: 0,
          divertido: 0,
          sorprendido: 0,
          triste: 0,
          enojado: 0,
          no_me_gusta: 0,
        },
        misReacciones: [],
      },
    ],
  },
  {
    id: 3,
    partidoId: 1,
    autor: {
      id: 3,
      nombre: "Ana Martínez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    texto: "¿Alguien sabe si hay estacionamiento cerca del recinto?",
    fecha: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
    reacciones: {
      me_gusta: 0,
      me_encanta: 0,
      divertido: 0,
      sorprendido: 1,
      triste: 0,
      enojado: 0,
      no_me_gusta: 0,
    },
    misReacciones: [],
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const partidoId = Number.parseInt(params.id)

    if (isNaN(partidoId)) {
      return NextResponse.json({ message: "ID de partido inválido" }, { status: 400 })
    }

    // Filtrar comentarios por partidoId
    const comentariosPartido = comentariosDB.filter((c) => c.partidoId === partidoId && !c.respuestaAId)

    return NextResponse.json(comentariosPartido)
  } catch (error) {
    console.error("Error al obtener comentarios:", error)
    return NextResponse.json({ message: "Error al obtener comentarios" }, { status: 500 })
  }
}
