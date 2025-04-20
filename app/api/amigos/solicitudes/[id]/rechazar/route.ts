import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Simular un retraso para emular una llamada a la API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  // En una aplicación real, aquí rechazaríamos la solicitud en la base de datos

  return NextResponse.json({
    success: true,
    message: `Solicitud de amistad con ID ${id} rechazada correctamente`,
  })
}
