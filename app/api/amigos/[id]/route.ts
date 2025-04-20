import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Simular un retraso para emular una llamada a la API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  // En una aplicación real, aquí eliminaríamos el amigo de la base de datos

  return NextResponse.json({
    success: true,
    message: `Amigo con ID ${id} eliminado correctamente`,
  })
}
