import { getUser } from "@/lib/auth"
import AdminView from "@/components/dashboard/admin-view"
import RecintoView from "@/components/dashboard/recinto-view"
import JugadorView from "@/components/dashboard/jugador-view"

export default function DashboardPage() {
  // Obtener el usuario pero usar un usuario demo si no existe
  const user = getUser() || {
    id: 0,
    name: "Usuario Demo",
    email: "demo@joinfutbol.com",
    role: "jugador" as const,
  }

  // Renderizar vista según el rol del usuario
  return (
    <div className="container mx-auto">
      {user.role === "administrador" && <AdminView user={user} />}
      {user.role === "administrador-de-recinto-deportivo" && <RecintoView user={user} />}
      {user.role === "jugador" && <JugadorView user={user} />}
    </div>
  )
}
