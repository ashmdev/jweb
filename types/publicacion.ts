import type { TipoReaccion } from "./comentario"

export interface Hashtag {
  id: number
  texto: string
}

export interface Publicacion {
  id: number
  usuarioId: number
  usuario: {
    id: number
    nombre: string
    avatar?: string
  }
  texto: string
  hashtags: Hashtag[]
  imagenes: string[]
  fechaCreacion: string
  comentarios: number
  reacciones: Record<TipoReaccion, number>
  misReacciones: TipoReaccion[]
}

export interface PublicacionDetallada extends Publicacion {
  comentariosData: Comentario[]
}

export interface Comentario {
  id: number
  publicacionId: number
  autor: {
    id: number
    nombre: string
    avatar?: string
  }
  texto: string
  fecha: string
  respuestaAId?: number
  respuestas?: Comentario[]
  reacciones: Record<TipoReaccion, number>
  misReacciones: TipoReaccion[]
}

export interface PublicacionInput {
  texto: string
  hashtags: string[]
  imagenes?: string[]
}

export interface ComentarioPublicacionInput {
  publicacionId: number
  texto: string
  respuestaAId?: number
}

export interface ReaccionPublicacionInput {
  publicacionId: number
  tipo: TipoReaccion
}
