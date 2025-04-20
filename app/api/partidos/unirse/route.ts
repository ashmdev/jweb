import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Verificar que el usuario esté autenticado
    const user = getUser()
    if (!user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    // Obtener datos del cuerpo de la solicitud
    const body = await request.json()
    const { partidoId, equipoId, posicion, costo } = body

    // Validar que se proporcionaron todos los datos necesarios
    if (!partidoId || !equipoId || !posicion || !costo) {
      return NextResponse.json({ message: "Faltan datos requeridos" }, { status: 400 })
    }

    // Simular un retraso para emular una llamada a la API real
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // En una aplicación real, aquí verificaríamos:
    // 1. Si el usuario ya está en el partido
    // 2. Si hay cupos disponibles en el equipo
    // 3. Si el usuario tiene suficientes créditos

    // Para simular, vamos a usar IDs fijos para pruebas
    // Si el partidoId es 1 y el usuario tiene ID 999, simulamos que ya está en el partido
    if (partidoId === 1 && user.id === 999) {
      return NextResponse.json(
        {
          success: false,
          message: "Ya estás participando en este partido",
        },
        { status: 400 },
      )
    }

    // Simulamos verificación de cupos (si equipoId es 2 y el partidoId es 2, no hay cupos)
    if (partidoId === 2 && equipoId === 2) {
      return NextResponse.json(
        {
          success: false,
          message: "No hay cupos disponibles en este equipo",
        },
        { status: 400 },
      )
    }

    // Simulamos verificación de créditos (si el costo es mayor a 10000, no hay suficientes créditos)
    if (costo > 10000) {
      return NextResponse.json(
        {
          success: false,
          message: "No tienes suficientes créditos para unirte a este partido",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Te has unido al partido correctamente",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error al unirse al partido:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
