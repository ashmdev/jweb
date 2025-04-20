import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Leer el cuerpo de la solicitud una sola vez
    const body = await request.json()
    const { email } = body

    // Simulamos un retraso para mostrar el estado de carga
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // En una aplicación real, aquí verificaríamos si el correo existe
    // y enviaríamos un correo con un enlace para restablecer la contraseña

    // Para fines de demostración, siempre devolvemos éxito
    return NextResponse.json(
      { message: "Se ha enviado un correo con instrucciones para restablecer la contraseña" },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error en recuperación de contraseña:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
