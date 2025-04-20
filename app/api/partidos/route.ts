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
  {
    id: 2,
    titulo: "Amistoso Vecinal",
    fecha: "2025-03-26",
    hora: "20:00",
    valorComision: 3000,
    estado: "programado",
    modalidad: "7vs7", // Añadir modalidad
    recinto: {
      id: 2,
      nombre: "Cancha Municipal Sur",
      direccion: "Calle Secundaria 456",
      ciudad: "Santiago",
      imagen: "/placeholder.svg?height=100&width=100",
    },
    equipoLocal: {
      id: 3,
      nombre: "Vecinos Unidos",
      jugadores: [
        { id: 8, nombre: "Fernando Martínez", posicion: "portero", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 9, nombre: "Raúl Jiménez", posicion: "defensa", avatar: "/placeholder.svg?height=40&width=40" },
        {
          id: 10,
          nombre: "Javier Hernández",
          posicion: "mediocampista",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        { id: 11, nombre: "Héctor Moreno", posicion: "delantero", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 12, nombre: "Guillermo Ochoa", posicion: "mediocampista", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      puestosDisponibles: 2,
    },
    equipoVisitante: {
      id: 4,
      nombre: "Amigos del Barrio",
      jugadores: [
        { id: 13, nombre: "Diego Reyes", posicion: "portero", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 14, nombre: "Carlos Vela", posicion: "defensa", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 15, nombre: "Andrés Guardado", posicion: "mediocampista", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 16, nombre: "Hirving Lozano", posicion: "delantero", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      puestosDisponibles: 3,
    },
    creador: {
      id: 8,
      nombre: "Fernando Martínez",
    },
  },
  {
    id: 3,
    titulo: "Torneo Empresarial - Grupo A",
    fecha: "2025-03-27",
    hora: "19:30",
    valorComision: 7000,
    estado: "programado",
    modalidad: "11vs11", // Añadir modalidad
    recinto: {
      id: 3,
      nombre: "Complejo Deportivo Empresarial",
      direccion: "Av. Industrial 789",
      ciudad: "Santiago",
      imagen: "/placeholder.svg?height=100&width=100",
    },
    equipoLocal: {
      id: 5,
      nombre: "Empresa ABC",
      jugadores: [
        { id: 17, nombre: "Ricardo González", posicion: "portero", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 18, nombre: "Eduardo Vargas", posicion: "defensa", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 19, nombre: "Arturo Vidal", posicion: "mediocampista", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 20, nombre: "Alexis Sánchez", posicion: "delantero", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 21, nombre: "Gary Medel", posicion: "defensa", avatar: "/placeholder.svg?height=40&width=40" },
        {
          id: 22,
          nombre: "Charles Aránguiz",
          posicion: "mediocampista",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
      puestosDisponibles: 1,
    },
    equipoVisitante: {
      id: 6,
      nombre: "Corporación XYZ",
      jugadores: [
        { id: 23, nombre: "Claudio Bravo", posicion: "portero", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 24, nombre: "Mauricio Isla", posicion: "defensa", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 25, nombre: "Jean Beausejour", posicion: "mediocampista", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 26, nombre: "Eduardo Vargas", posicion: "delantero", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 27, nombre: "Gonzalo Jara", posicion: "defensa", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      puestosDisponibles: 2,
    },
    creador: {
      id: 17,
      nombre: "Ricardo González",
    },
  },
  {
    id: 4,
    titulo: "Liga Universitaria - Fecha 2",
    fecha: "2025-03-28",
    hora: "16:00",
    valorComision: 4000,
    estado: "programado",
    modalidad: "7vs7", // Añadir modalidad
    recinto: {
      id: 4,
      nombre: "Campus Deportivo Universidad",
      direccion: "Av. Universitaria 321",
      ciudad: "Santiago",
      imagen: "/placeholder.svg?height=100&width=100",
    },
    equipoLocal: {
      id: 7,
      nombre: "Facultad de Ingeniería",
      jugadores: [
        { id: 28, nombre: "Matías Fernández", posicion: "portero", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 29, nombre: "Jorge Valdivia", posicion: "defensa", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 30, nombre: "Marcelo Díaz", posicion: "mediocampista", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 31, nombre: "Esteban Paredes", posicion: "delantero", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      puestosDisponibles: 3,
    },
    equipoVisitante: {
      id: 8,
      nombre: "Facultad de Medicina",
      jugadores: [
        { id: 32, nombre: "Johnny Herrera", posicion: "portero", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 33, nombre: "Gonzalo Fierro", posicion: "defensa", avatar: "/placeholder.svg?height=40&width=40" },
        {
          id: 34,
          nombre: "Matías Rodríguez",
          posicion: "mediocampista",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        { id: 35, nombre: "Eduardo Vargas", posicion: "delantero", avatar: "/placeholder.svg?height=40&width=40" },
        {
          id: 36,
          nombre: "Charles Aránguiz",
          posicion: "mediocampista",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
      puestosDisponibles: 2,
    },
    creador: {
      id: 28,
      nombre: "Matías Fernández",
    },
  },
]

export async function GET() {
  // Simular un retraso para emular una llamada a la API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(partidos)
}
