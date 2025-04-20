export type TipoReaccion =
  | "me_gusta"
  | "no_me_gusta"
  | "me_encanta"
  | "divertido"
  | "sorprendido"
  | "triste"
  | "enojado"

export interface Autor {
  id: number
  nombre: string
  avatar?: string
}

export interface Comentario {
  id: number
  partidoId: number
  autor: Autor
  texto: string
  fecha: string
  respuestaAId?: number
  respuestas?: Comentario[]
  reacciones: Record<TipoReaccion, number>
  misReacciones: TipoReaccion[]
}

export interface ComentarioInput {
  partidoId: number
  texto: string
  respuestaAId?: number
}

export interface ReaccionInput {
  comentarioId: number
  tipo: TipoReaccion
}
