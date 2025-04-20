import { NextResponse } from "next/server"
import type { SolicitudAmistad } from "@/types/amigo"

// Datos de ejemplo para solicitudes de amistad
const solicitudes: SolicitudAmistad[] = [
  {
    id: 101,
    nombre: "Roberto Díaz",
    email: "roberto@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    fechaSolicitud: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
  },
  {
    id: 102,
    nombre: "Sofía Ramírez",
    email: "sofia@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    fechaSolicitud: new Date(Date.now() - 172800000).toISOString(), // 2 días atrás
  },
  {
    id: 103,
    nombre: "Javier Torres",
    email: "javier@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    fechaSolicitud: new Date().toISOString(), // Hoy
  },
]

export async function GET() {
  // Simular un retraso para emular una llamada a la API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(solicitudes)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Validar que se proporcionó un email
    if (!email) {
      return NextResponse.json({ success: false, message: "El email es requerido" }, { status: 400 })
    }

    // Simular un retraso para emular una llamada a la API real
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simular que el email ya existe como amigo
    if (email === "amigo@ejemplo.com") {
      return NextResponse.json({ success: false, message: "Este usuario ya es tu amigo" }, { status: 400 })
    }

    // Simular que el email ya tiene una solicitud pendiente
    if (email === "pendiente@ejemplo.com") {
      return NextResponse.json(
        { success: false, message: "Ya has enviado una solicitud a este usuario" },
        { status: 400 },
      )
    }

    // Simular que el email no existe
    if (email === "noexiste@ejemplo.com") {
      return NextResponse.json(
        { success: false, message: "No se encontró ningún usuario con este email" },
        { status: 404 },
      )
    }

    // En una aplicación real, aquí crearíamos la solicitud en la base de datos

    return NextResponse.json({ success: true, message: "Solicitud de amistad enviada correctamente" }, { status: 201 })
  } catch (error) {
    console.error("Error al procesar la solicitud:", error)
    return NextResponse.json({ success: false, message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
