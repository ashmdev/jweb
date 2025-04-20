import { NextResponse } from "next/server"
import type { Amigo } from "@/types/amigo"

// Datos de ejemplo para jugadores
const jugadores: Amigo[] = [
  {
    id: 201,
    nombre: "Fernando Martínez",
    email: "fernando@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    estado: "online",
    ultimaConexion: new Date().toISOString(),
    partidosJugados: 25,
    posicionPreferida: "delantero",
    nivelJuego: "avanzado",
  },
  {
    id: 202,
    nombre: "Lucía Fernández",
    email: "lucia@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    estado: "offline",
    ultimaConexion: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
    partidosJugados: 18,
    posicionPreferida: "mediocampista",
    nivelJuego: "intermedio",
  },
  {
    id: 203,
    nombre: "Gabriel Torres",
    email: "gabriel@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    estado: "jugando",
    ultimaConexion: new Date().toISOString(),
    partidosJugados: 30,
    posicionPreferida: "defensa",
    nivelJuego: "profesional",
  },
  {
    id: 204,
    nombre: "Valentina López",
    email: "valentina@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    estado: "online",
    ultimaConexion: new Date().toISOString(),
    partidosJugados: 12,
    posicionPreferida: "portero",
    nivelJuego: "intermedio",
  },
  {
    id: 205,
    nombre: "Martín Rodríguez",
    email: "martin@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    estado: "offline",
    ultimaConexion: new Date(Date.now() - 259200000).toISOString(), // 3 días atrás
    partidosJugados: 8,
    posicionPreferida: "delantero",
    nivelJuego: "principiante",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  // Simular un retraso para emular una llamada a la API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filtrar jugadores por nombre o email
  const resultados = jugadores.filter(
    (jugador) =>
      jugador.nombre.toLowerCase().includes(query.toLowerCase()) ||
      jugador.email.toLowerCase().includes(query.toLowerCase()),
  )

  return NextResponse.json(resultados)
}
