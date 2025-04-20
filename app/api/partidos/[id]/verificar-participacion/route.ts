import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar que el usuario esté autenticado
    const user = getUser()
    if (!user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const partidoId = Number.parseInt(params.id)

    // Simular un retraso para emular una llamada a la API real
    await new Promise((resolve) => setTimeout(resolve, 300))

    // En una aplicación real, aquí verificaríamos en la base de datos
    // si el usuario ya está participando en el partido

    // Para simular, vamos a usar un ID fijo para pruebas
    // Si el partidoId es 1, simulamos que el usuario ya está participando
    if (partidoId === 1 && user.id === 999) {
      return NextResponse.json({
        participando: true,
        equipoId: 1, // ID del equipo local
        posicion: "mediocampista",
      })
    }

    // Si no, devolvemos que no está participando
    return NextResponse.json({ participando: false })
  } catch (error) {
    console.error("Error al verificar participación:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
