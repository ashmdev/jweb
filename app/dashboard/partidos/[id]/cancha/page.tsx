"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from "next/navigation"
import FieldView from "@/components/partidos/field-view"

// Definir las posiciones para diferentes modalidades
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

export default function CanchaPage() {
  const params = useParams()
  const matchId = params.id as string

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vista de la Cancha</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldView matchId={matchId} />
        </CardContent>
      </Card>
    </div>
  )
}
