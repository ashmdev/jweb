import { NextResponse } from "next/server"
import type { Partido } from "@/types/partido"

// Actualizar los datos de ejemplo para incluir la modalidad
const partidos: Partido[] = [
  {
    id: 1,
    titulo: "Liga Barrial - Jornada 5",
    fecha: "2025-03-25",
    hora: "18:00",
    valorComision: 5000,
    estado: "programado",
    modalidad: "11vs11", // Añadir modalidad
    recinto: {
      id: 1,
      nombre: "Complejo Deportivo Norte",
      direccion: "Av. Principal 123",
      ciudad: "Santiago",
      imagen: "/placeholder.svg?height=100&width=100",
    },
    equipoLocal: {
      id: 1,
      nombre: "Leones FC",
      jugadores: [
        { id: 1, nombre: "Carlos Pérez", posicion: "portero", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 2, nombre: "Juan Gómez", posicion: "defensa", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 3, nombre: "Pedro Sánchez", posicion: "mediocampista", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 4, nombre: "Luis Rodríguez", posicion: "delantero", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      puestosDisponibles: 3,
    },
    equipoVisitante: {
      id: 2,
      nombre: "Águilas Doradas",
      jugadores: [
        { id: 5, nombre: "Miguel Torres", posicion: "portero", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 6, nombre: "Roberto Díaz", posicion: "defensa", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 7, nombre: "Andrés López", posicion: "mediocampista", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      puestosDisponibles: 4,
    },
    creador: {
      id: 1,
      nombre: "Carlos Pérez",
    },
  },
  // ... (resto de los partidos, igual que en la ruta principal)
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  // Simular un retraso para emular una llamada a la API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  const partido = partidos.find((p) => p.id === id)

  if (!partido) {
    return NextResponse.json({ message: `Partido con ID ${id} no encontrado` }, { status: 404 })
  }

  return NextResponse.json(partido)
}
