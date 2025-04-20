import { NextResponse } from "next/server"
import type { Credito } from "@/types/credito"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { monto, metodo } = body

    // Validar que se proporcionó un monto y un método
    if (!monto || !metodo) {
      return NextResponse.json({ success: false, message: "El monto y el método son requeridos" }, { status: 400 })
    }

    // Validar que el monto sea un número positivo
    if (typeof monto !== "number" || monto <= 0) {
      return NextResponse.json({ success: false, message: "El monto debe ser un número positivo" }, { status: 400 })
    }

    // Validar que el método sea válido
    if (!["tarjeta", "transferencia", "efectivo"].includes(metodo)) {
      return NextResponse.json({ success: false, message: "El método de pago no es válido" }, { status: 400 })
    }

    // Simular un retraso para emular una llamada a la API real
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Crear un nuevo crédito
    const nuevoCredito: Credito = {
      id: Math.floor(Math.random() * 10000) + 1,
      monto,
      fecha: new Date().toISOString(),
      metodo,
      estado: metodo === "efectivo" ? "pendiente" : "completado",
      referencia: `TRX-${Math.floor(Math.random() * 100000)}`,
    }

    return NextResponse.json(nuevoCredito, { status: 201 })
  } catch (error) {
    console.error("Error al procesar la recarga:", error)
    return NextResponse.json({ success: false, message: "Error al procesar la recarga" }, { status: 500 })
  }
}
