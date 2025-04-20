import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MapPin, Calendar, TrendingUp, UserPlus, MapPinned, CalendarPlus } from "lucide-react"
import type { User } from "@/lib/auth"

interface AdminViewProps {
  user: User
}

export default function AdminView({ user }: AdminViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Bienvenido, {user.name}</h1>
      <p className="text-muted-foreground">
        Administra usuarios, recintos deportivos y visualiza estadísticas del sistema.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+180 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recintos Deportivos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+5 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partidos Creados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+86 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Crecimiento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24.5%</div>
            <p className="text-xs text-muted-foreground">+7.2% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usuarios" className="mt-4">
        <TabsList>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="recintos">Recintos</TabsTrigger>
          <TabsTrigger value="partidos">Partidos</TabsTrigger>
        </TabsList>
        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Recientes</CardTitle>
              <CardDescription>Se han registrado 180 nuevos usuarios en el último mes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserPlus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Usuario {i}</p>
                      <p className="text-xs text-muted-foreground">usuario{i}@ejemplo.com</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Hace {i} día{i !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recintos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recintos Recientes</CardTitle>
              <CardDescription>Se han agregado 5 nuevos recintos deportivos en el último mes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPinned className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Recinto Deportivo {i}</p>
                      <p className="text-xs text-muted-foreground">Dirección {i}, Ciudad</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Hace {i * 2} día{i * 2 !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="partidos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Partidos Recientes</CardTitle>
              <CardDescription>Se han creado 86 nuevos partidos en el último mes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CalendarPlus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Partido {i}</p>
                      <p className="text-xs text-muted-foreground">
                        Recinto {i}, {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Hace {i} hora{i !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
