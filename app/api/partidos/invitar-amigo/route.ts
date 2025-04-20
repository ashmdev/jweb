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
    const { partidoId, equipoId, posicion, amigoId, costo } = body

    // Validar que se proporcionaron todos los datos necesarios
    if (!partidoId || !equipoId || !posicion || !amigoId || !costo) {
      return NextResponse.json({ message: "Faltan datos requeridos" }, { status: 400 })
    }

    // Simular un retraso para emular una llamada a la API real
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // En una aplicación real, aquí verificaríamos si el usuario tiene suficientes créditos
    // y procesaríamos la invitación en la base de datos

    return NextResponse.json(
      {
        success: true,
        message: "Invitación enviada correctamente",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error al invitar amigo:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
