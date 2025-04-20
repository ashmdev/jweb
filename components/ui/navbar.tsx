"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Función para scroll suave
  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: offsetTop - 80, // Ajuste para el navbar fijo
        behavior: "smooth",
      })
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${
        isScrolled ? "bg-background/95 shadow-md" : "bg-transparent border-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => scrollToSection("hero")} className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Join Fútbol</span>
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6">
          <button onClick={() => scrollToSection("features")} className="text-sm font-medium hover:text-primary">
            Características
          </button>
          <button onClick={() => scrollToSection("how-it-works")} className="text-sm font-medium hover:text-primary">
            Cómo funciona
          </button>
          <button onClick={() => scrollToSection("testimonials")} className="text-sm font-medium hover:text-primary">
            Testimonios
          </button>
          <Link href="/blog" className="text-sm font-medium hover:text-primary">
            Blog
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" asChild>
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button className="bg-primary text-white hover:bg-primary/90" asChild>
            <Link href="/registro">Registrarse</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 pb-6 border-b bg-background">
          <nav className="flex flex-col space-y-4">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium hover:text-primary text-left"
            >
              Características
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium hover:text-primary text-left"
            >
              Cómo funciona
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-sm font-medium hover:text-primary text-left"
            >
              Testimonios
            </button>
            <Link href="/blog" className="text-sm font-medium hover:text-primary text-left">
              Blog
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white w-full"
                asChild
              >
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button className="bg-primary text-white hover:bg-primary/90 w-full" asChild>
                <Link href="/registro">Registrarse</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
