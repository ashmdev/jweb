import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-primary">Join Fútbol</span>
            </Link>
            <p className="text-gray-300 mb-4">
              La forma más fácil de organizar y unirse a partidos de fútbol en tu área.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Producto</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  Características
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  Testimonios
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  Términos de servicio
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Descarga</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  App Store
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  Google Play
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-300">
            &copy; {new Date().getFullYear()} Join Fútbol. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
