import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Usuarios de prueba
const users = [
  { id: 1, email: "admin@joinfutbol.com", password: "123456", name: "Admin", role: "administrador" },
  {
    id: 2,
    email: "recinto@joinfutbol.com",
    password: "123456",
    name: "Juan Recinto",
    role: "administrador-de-recinto-deportivo",
  },
  { id: 3, email: "jugador@joinfutbol.com", password: "123456", name: "Pedro Jugador", role: "jugador" },
]

export async function POST(request: Request) {
  let email = ""
  let password = ""

  try {
    // Intentar obtener datos del cuerpo JSON
    try {
      const body = await request.json()
      email = body.email || ""
      password = body.password || ""
    } catch (error) {
      // Si falla, intentar obtener de los parámetros de URL
      const url = new URL(request.url)
      email = url.searchParams.get("email") || ""
      password = url.searchParams.get("password") || ""
    }

    // Buscar usuario
    const user = users.find((u) => u.email === email)

    // Verificar si el usuario existe y la contraseña es correcta
    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 })
    }

    // Crear objeto de usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user

    // Crear cookie de sesión
    const cookieStore = cookies()
    cookieStore.set({
      name: "user",
      value: JSON.stringify(userWithoutPassword),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
      sameSite: "lax",
    })

    return NextResponse.json({ message: "Inicio de sesión exitoso", user: userWithoutPassword }, { status: 200 })
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json(
      { message: "Error interno del servidor", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
