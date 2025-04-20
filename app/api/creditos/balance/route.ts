import { NextResponse } from "next/server"
import type { BalanceCredito } from "@/types/credito"

// Datos de ejemplo para el balance de créditos
const balanceCreditos: BalanceCredito = {
  total: 25000,
  disponible: 18500,
  pendiente: 6500,
  historial: [
    {
      id: 1,
      monto: 10000,
      fecha: new Date(Date.now() - 15 * 86400000).toISOString(), // 15 días atrás
      metodo: "tarjeta",
      estado: "completado",
      referencia: "TRX-10001",
    },
    {
      id: 2,
      monto: 8500,
      fecha: new Date(Date.now() - 7 * 86400000).toISOString(), // 7 días atrás
      metodo: "transferencia",
      estado: "completado",
      referencia: "TRX-10002",
    },
    {
      id: 3,
      monto: 6500,
      fecha: new Date().toISOString(), // Hoy
      metodo: "efectivo",
      estado: "pendiente",
      referencia: "TRX-10003",
    },
  ],
}

export async function GET() {
  // Simular un retraso para emular una llamada a la API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(balanceCreditos)
}
