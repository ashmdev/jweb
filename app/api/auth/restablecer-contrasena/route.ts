import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Leer el cuerpo de la solicitud una sola vez
    const body = await request.json()
    const { token, password } = body

    // Simulamos un retraso para mostrar el estado de carga
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // En una aplicación real, aquí verificaríamos si el token es válido
    // y actualizaríamos la contraseña del usuario en la base de datos

    // Verificar que el token no esté vacío
    if (!token) {
      return NextResponse.json({ message: "Token no válido" }, { status: 400 })
    }

    // Para fines de demostración, siempre devolvemos éxito
    return NextResponse.json({ message: "Contraseña restablecida correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error en restablecimiento de contraseña:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
