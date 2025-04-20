import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | Join Fútbol",
  description: "Inicia sesión en tu cuenta de Join Fútbol",
}

export default function LoginPage() {
  return (
    <div className="container relative flex-col items-center justify-center min-h-screen grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-secondary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Join Fútbol</span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Join Fútbol ha revolucionado la forma en que organizamos nuestros partidos. Ahora es mucho más fácil
              encontrar jugadores y canchas disponibles."
            </p>
            <footer className="text-sm">Carlos Rodríguez</footer>
          </blockquote>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-secondary to-secondary/80 z-10" />
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Fútbol background"
          fill
          className="absolute inset-0 object-cover z-0 opacity-20"
        />
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
            <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="/registro" className="underline underline-offset-4 hover:text-primary">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
