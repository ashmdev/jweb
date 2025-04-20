import { NextResponse } from "next/server"
import type { Amigo } from "@/types/amigo"

// Datos de ejemplo para amigos
const amigos: Amigo[] = [
  {
    id: 1,
    nombre: "Carlos Rodríguez",
    email: "carlos@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    estado: "online",
    ultimaConexion: new Date().toISOString(),
    partidosJugados: 15,
    posicionPreferida: "delantero",
    nivelJuego: "intermedio",
  },
  {
    id: 2,
    nombre: "Laura Martínez",
    email: "laura@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    estado: "jugando",
    ultimaConexion: new Date().toISOString(),
    partidosJugados: 8,
    posicionPreferida: "mediocampista",
    nivelJuego: "avanzado",
  },
  {
    id: 3,
    nombre: "Miguel Sánchez",
    email: "miguel@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    estado: "offline",
    ultimaConexion: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
    partidosJugados: 12,
    posicionPreferida: "defensa",
    nivelJuego: "intermedio",
  },
  {
    id: 4,
    nombre: "Ana López",
    email: "ana@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    estado: "online",
    ultimaConexion: new Date().toISOString(),
    partidosJugados: 20,
    posicionPreferida: "portero",
    nivelJuego: "avanzado",
  },
  {
    id: 5,
    nombre: "Pedro Gómez",
    email: "pedro@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    estado: "offline",
    ultimaConexion: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
    partidosJugados: 5,
    posicionPreferida: "mediocampista",
    nivelJuego: "principiante",
  },
]

export async function GET() {
  // Simular un retraso para emular una llamada a la API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(amigos)
}

export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const id = url.pathname.split("/").pop()

  // Simular un retraso para emular una llamada a la API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  // En una aplicación real, aquí eliminaríamos el amigo de la base de datos

  return NextResponse.json({
    success: true,
    message: `Amigo con ID ${id} eliminado correctamente`,
  })
}
