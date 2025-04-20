import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Leer el cuerpo de la solicitud una sola vez
    const body = await request.json()
    const { email, name, password, role } = body

    // En una aplicación real, aquí verificaríamos si el correo ya existe
    // y guardaríamos el usuario en la base de datos

    // Simulamos un retraso para mostrar el estado de carga
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verificar que el rol sea válido
    if (role !== "jugador" && role !== "administrador-de-recinto-deportivo") {
      return NextResponse.json({ message: "Rol no válido" }, { status: 400 })
    }

    // Simulamos un correo ya registrado
    if (email === "admin@joinfutbol.com" || email === "recinto@joinfutbol.com" || email === "jugador@joinfutbol.com") {
      return NextResponse.json({ message: "Este correo electrónico ya está registrado" }, { status: 400 })
    }

    return NextResponse.json({ message: "Usuario registrado correctamente" }, { status: 201 })
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
