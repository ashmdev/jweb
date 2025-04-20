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
    const { partidoId, jugadorId } = body

    // Validar que se proporcionó el ID del partido
    if (!partidoId) {
      return NextResponse.json({ message: "Falta el ID del partido" }, { status: 400 })
    }

    // Simular un retraso para emular una llamada a la API real
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // En una aplicación real, aquí verificaríamos si el usuario está en el partido
    // y procesaríamos la cancelación en la base de datos

    // Si se proporciona jugadorId, estamos cancelando la participación de un amigo
    const mensaje = jugadorId
      ? "Has cancelado la participación de tu amigo correctamente"
      : "Has cancelado tu participación correctamente"

    // Asegurarnos de devolver una respuesta JSON válida
    return NextResponse.json(
      {
        success: true,
        message: mensaje,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error al cancelar participación:", error)
    // Asegurarnos de devolver una respuesta JSON válida incluso en caso de error
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
