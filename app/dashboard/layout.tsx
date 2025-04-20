"use client"

import { useEffect } from "react"
import type React from "react"
import DashboardSidebar from "@/components/dashboard/sidebar"
import DashboardHeader from "@/components/dashboard/header"
import { useUserStore } from "@/lib/stores/user-store"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useUserStore((state) => state.user)
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const router = useRouter()

  // Redirigir al login si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Si no hay usuario, mostrar un estado de carga
  if (!user) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar user={user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background p-4 w-full max-w-full">
          <div className="max-w-full overflow-x-hidden">{children}</div>
        </main>
      </div>
    </div>
  )
}
