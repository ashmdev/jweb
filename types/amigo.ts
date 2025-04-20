export interface Amigo {
  id: number
  nombre: string
  email: string
  avatar?: string
  estado: "online" | "offline" | "jugando"
  ultimaConexion: string
  partidosJugados: number
  posicionPreferida?: string
  nivelJuego?: "principiante" | "intermedio" | "avanzado" | "profesional"
}

export interface SolicitudAmistad {
  id: number
  nombre: string
  email: string
  avatar?: string
  fechaSolicitud: string
}
