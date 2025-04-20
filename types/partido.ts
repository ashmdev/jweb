export interface Jugador {
  id: number
  nombre: string
  posicion: string
  avatar?: string
}

export interface Equipo {
  id: number
  nombre: string
  jugadores: Jugador[]
  puestosDisponibles: number
}

export interface Recinto {
  id: number
  nombre: string
  direccion: string
  ciudad: string
  imagen?: string
}

export interface Partido {
  id: number
  titulo: string
  fecha: string
  hora: string
  valorComision: number
  estado: "programado" | "en_curso" | "finalizado" | "cancelado"
  modalidad: "7vs7" | "11vs11" // Nueva propiedad para la modalidad
  recinto: Recinto
  equipoLocal: Equipo
  equipoVisitante: Equipo
  creador: {
    id: number
    nombre: string
  }
}
