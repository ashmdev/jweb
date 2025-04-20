"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Partido, Jugador } from "@/types/partido"
import "@/app/field-styles.css"

interface FieldPreviewProps {
  partido: Partido
}

// Definir las posiciones para diferentes modalidades (un solo conjunto de coordenadas)
const CONFIGURACIONES_CANCHA = {
  "7vs7": {
    local: [
      { key: "portero", nombre: "Portero", x: 50, y: 10 },
      { key: "defensaIzquierdo", nombre: "Defensa Izquierdo", x: 30, y: 25 },
      { key: "defensaDerecho", nombre: "Defensa Derecho", x: 70, y: 25 },
      { key: "mediocentroIzquierdo", nombre: "Mediocampista Izquierdo", x: 30, y: 40 },
      { key: "mediocentroDerecho", nombre: "Mediocampista Derecho", x: 70, y: 40 },
      { key: "delanteroIzquierdo", nombre: "Delantero Izquierdo", x: 30, y: 55 },
      { key: "delanteroDerecho", nombre: "Delantero Derecho", x: 70, y: 55 },
    ],
    visitante: [
      { key: "portero", nombre: "Portero", x: 50, y: 90 },
      { key: "defensaIzquierdo", nombre: "Defensa Izquierdo", x: 30, y: 75 },
      { key: "defensaDerecho", nombre: "Defensa Derecho", x: 70, y: 75 },
      { key: "mediocentroIzquierdo", nombre: "Mediocampista Izquierdo", x: 30, y: 60 },
      { key: "mediocentroDerecho", nombre: "Mediocampista Derecho", x: 70, y: 60 },
      { key: "delanteroIzquierdo", nombre: "Delantero Izquierdo", x: 30, y: 45 },
      { key: "delanteroDerecho", nombre: "Delantero Derecho", x: 70, y: 45 },
    ],
  },
  "11vs11": {
    local: [
      { key: "portero", nombre: "Portero", x: 50, y: 10 },
      { key: "defensaIzquierdo", nombre: "Defensa Izquierdo", x: 20, y: 25 },
      { key: "defensaCentroIzquierdo", nombre: "Defensa Central Izquierdo", x: 35, y: 25 },
      { key: "defensaCentroDerecho", nombre: "Defensa Central Derecho", x: 65, y: 25 },
      { key: "defensaDerecho", nombre: "Defensa Derecho", x: 80, y: 25 },
      { key: "mediocentroIzquierdo", nombre: "Mediocampista Izquierdo", x: 20, y: 40 },
      { key: "mediocentroCentroIzquierdo", nombre: "Mediocampista Central Izquierdo", x: 35, y: 40 },
      { key: "mediocentroCentroDerecho", nombre: "Mediocampista Central Derecho", x: 65, y: 40 },
      { key: "mediocentroDerecho", nombre: "Mediocampista Derecho", x: 80, y: 40 },
      { key: "delanteroIzquierdo", nombre: "Delantero Izquierdo", x: 35, y: 55 },
      { key: "delanteroDerecho", nombre: "Delantero Derecho", x: 65, y: 55 },
    ],
    visitante: [
      { key: "portero", nombre: "Portero", x: 50, y: 90 },
      { key: "defensaIzquierdo", nombre: "Defensa Izquierdo", x: 20, y: 75 },
      { key: "defensaCentroIzquierdo", nombre: "Defensa Central Izquierdo", x: 35, y: 75 },
      { key: "defensaCentroDerecho", nombre: "Defensa Central Derecho", x: 65, y: 75 },
      { key: "defensaDerecho", nombre: "Defensa Derecho", x: 80, y: 75 },
      { key: "mediocentroIzquierdo", nombre: "Mediocampista Izquierdo", x: 20, y: 60 },
      { key: "mediocentroCentroIzquierdo", nombre: "Mediocampista Central Izquierdo", x: 35, y: 60 },
      { key: "mediocentroCentroDerecho", nombre: "Mediocampista Central Derecho", x: 65, y: 60 },
      { key: "mediocentroDerecho", nombre: "Mediocampista Derecho", x: 80, y: 60 },
      { key: "delanteroIzquierdo", nombre: "Delantero Izquierdo", x: 35, y: 45 },
      { key: "delanteroDerecho", nombre: "Delantero Derecho", x: 65, y: 45 },
    ],
  },
}

// Mapeo de posiciones para asignar jugadores correctamente
const POSICION_MAPPING: Record<string, string[]> = {
  portero: ["portero", "arquero", "goalkeeper", "arco"],
  defensa: ["defensa", "lateral", "central", "back", "stopper"],
  mediocampista: ["mediocampista", "medio", "volante", "midfielder"],
  delantero: ["delantero", "atacante", "forward", "striker"],
}

export default function FieldPreview({ partido }: FieldPreviewProps) {
  const [fieldWidth, setFieldWidth] = useState(0)

  // Obtener el ancho del campo para cálculos responsivos
  useEffect(() => {
    const handleResize = () => {
      const fieldElement = document.getElementById("soccer-field")
      if (fieldElement) {
        setFieldWidth(fieldElement.offsetWidth)
      }
    }

    handleResize() // Ejecutar inmediatamente
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Determinar la modalidad del partido
  const getModalidad = (partido: Partido): "7vs7" | "11vs11" => {
    if (partido.modalidad) return partido.modalidad

    // Si no hay modalidad explícita, inferirla del número de jugadores
    const totalJugadores =
      partido.equipoLocal.jugadores.length +
      partido.equipoLocal.puestosDisponibles +
      partido.equipoVisitante.jugadores.length +
      partido.equipoVisitante.puestosDisponibles

    return totalJugadores <= 14 ? "7vs7" : "11vs11"
  }

  // Función mejorada para asignar jugadores a posiciones
  const asignarJugadoresAPosiciones = (
    equipo: Partido["equipoLocal"] | Partido["equipoVisitante"],
    esLocal: boolean,
  ) => {
    const modalidad = getModalidad(partido)
    const posiciones = esLocal ? CONFIGURACIONES_CANCHA[modalidad].local : CONFIGURACIONES_CANCHA[modalidad].visitante
    const jugadoresAsignados: Record<string, Jugador & { posicionKey?: string }> = {}

    // Copia de jugadores para trabajar
    const jugadoresPendientes = [...equipo.jugadores]

    // Primero, intentamos asignar por coincidencia exacta de posición
    posiciones.forEach((posicion) => {
      const posicionKey = posicion.key
      const categoriaGeneral = posicionKey.includes("portero")
        ? "portero"
        : posicionKey.includes("defensa")
          ? "defensa"
          : posicionKey.includes("mediocentro")
            ? "mediocampista"
            : "delantero"

      const posiblesTerminos = POSICION_MAPPING[categoriaGeneral] || []

      // Buscar jugador con posición exacta
      const jugadorIndex = jugadoresPendientes.findIndex((j) =>
        posiblesTerminos.some(
          (termino) =>
            j.posicion?.toLowerCase() === termino.toLowerCase() ||
            j.posicion?.toLowerCase().includes(termino.toLowerCase()),
        ),
      )

      if (jugadorIndex !== -1) {
        const jugador = { ...jugadoresPendientes[jugadorIndex], posicionKey }
        jugadoresAsignados[posicionKey] = jugador
        jugadoresPendientes.splice(jugadorIndex, 1)
      }
    })

    // Asignar jugadores restantes a posiciones vacías
    posiciones.forEach((posicion) => {
      const posicionKey = posicion.key
      if (!jugadoresAsignados[posicionKey] && jugadoresPendientes.length > 0) {
        const jugador = { ...jugadoresPendientes.shift()!, posicionKey }
        jugadoresAsignados[posicionKey] = jugador
      }
    })

    return jugadoresAsignados
  }

  const modalidad = getModalidad(partido)
  const configuracion = CONFIGURACIONES_CANCHA[modalidad]
  const jugadoresLocal = asignarJugadoresAPosiciones(partido.equipoLocal, true)
  const jugadoresVisitante = asignarJugadoresAPosiciones(partido.equipoVisitante, false)

  return (
    <div className="relative w-full bg-green-600 rounded-lg overflow-hidden" id="soccer-field">
      {/* Campo de fútbol */}
      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
        {/* Líneas del campo */}
        <div className="absolute inset-0 p-4">
          {/* Línea central */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-1/2"></div>

          {/* Círculo central */}
          <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full border border-white transform -translate-x-1/2 -translate-y-1/2"></div>

          {/* Área grande superior */}
          <div className="absolute top-0 left-1/2 w-32 h-16 border border-white transform -translate-x-1/2"></div>

          {/* Área pequeña superior */}
          <div className="absolute top-0 left-1/2 w-16 h-6 border border-white transform -translate-x-1/2"></div>

          {/* Área grande inferior */}
          <div className="absolute bottom-0 left-1/2 w-32 h-16 border border-white transform -translate-x-1/2"></div>

          {/* Área pequeña inferior */}
          <div className="absolute bottom-0 left-1/2 w-16 h-6 border border-white transform -translate-x-1/2"></div>

          {/* Esquinas */}
          <div className="absolute top-0 left-0 w-4 h-4 border-r border-b border-white rounded-br-full"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-l border-b border-white rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-r border-t border-white rounded-tr-full"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-l border-t border-white rounded-tl-full"></div>
        </div>

        {/* Jugadores en espera */}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-30">
          {partido.equipoLocal.puestosDisponibles + partido.equipoVisitante.puestosDisponibles} jugadores en espera
        </div>

        {/* Leyenda de equipos */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-lg z-30">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>{partido.equipoLocal.nombre || "Equipo Local"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>{partido.equipoVisitante.nombre || "Equipo Visitante"}</span>
          </div>
        </div>

        {/* Posiciones del equipo local */}
        {configuracion.local.map((posicion) => {
          const jugador = jugadoresLocal[posicion.key]
          const isOcupada = !!jugador

          return (
            <div
              key={`local-${posicion.key}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 player-position"
              style={{ top: `${posicion.y}%`, left: `${posicion.x}%` }}
            >
              {isOcupada ? (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-500/30"></div>
                  <Avatar className="border-2 border-white player-avatar">
                    <AvatarImage src={jugador.avatar || "/placeholder.svg?height=40&width=40"} alt={jugador.nombre} />
                    <AvatarFallback className="bg-red-500 text-white player-avatar-text">
                      {jugador.nombre.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute player-name-tag left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap max-w-[80px] truncate text-center">
                    {jugador.nombre.split(" ")[0]}
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-500/70 animate-ping player-avatar"></div>
                  <div className="absolute inset-0 rounded-full bg-red-500 flex items-center justify-center player-avatar">
                    <span className="text-white player-libre-text">Libre</span>
                  </div>
                </>
              )}
            </div>
          )
        })}

        {/* Posiciones del equipo visitante */}
        {configuracion.visitante.map((posicion) => {
          const jugador = jugadoresVisitante[posicion.key]
          const isOcupada = !!jugador

          return (
            <div
              key={`visitante-${posicion.key}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 player-position"
              style={{ top: `${posicion.y}%`, left: `${posicion.x}%` }}
            >
              {isOcupada ? (
                <>
                  <div className="absolute inset-0 rounded-full bg-blue-500/30"></div>
                  <Avatar className="border-2 border-white player-avatar">
                    <AvatarImage src={jugador.avatar || "/placeholder.svg?height=40&width=40"} alt={jugador.nombre} />
                    <AvatarFallback className="bg-blue-500 text-white player-avatar-text">
                      {jugador.nombre.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute player-name-tag left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap max-w-[80px] truncate text-center">
                    {jugador.nombre.split(" ")[0]}
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 rounded-full bg-blue-500/70 animate-ping player-avatar"></div>
                  <div className="absolute inset-0 rounded-full bg-blue-500 flex items-center justify-center player-avatar">
                    <span className="text-white player-libre-text">Libre</span>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
