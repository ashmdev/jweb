import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Eliminar cookie de sesión
    const cookieStore = cookies()
    cookieStore.delete("user")

    return NextResponse.json({ message: "Sesión cerrada correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error en logout:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
