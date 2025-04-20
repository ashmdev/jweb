import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 bg-secondary text-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Descarga Join Fútbol y comienza a jugar hoy mismo
              </h2>
              <p className="max-w-[600px] text-gray-200 md:text-xl/relaxed">
                Disponible para iOS y Android. Únete a miles de jugadores que ya están disfrutando de la mejor
                experiencia de fútbol.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Download className="mr-2 h-5 w-5" /> App Store
              </Button>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Download className="mr-2 h-5 w-5" /> Google Play
              </Button>
            </div>
            <div className="mt-6 flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <span className="text-yellow-400">★★★★★</span>
                <span className="ml-1 text-gray-200">4.8/5 (500+ reseñas)</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-200">Descarga gratuita</span>
              </div>
            </div>
          </div>
          <div className="relative mx-auto lg:mx-0 w-full max-w-[500px]">
            <div className="relative z-10">
              <Image
                src="/placeholder.svg?height=600&width=500"
                width={500}
                height={600}
                alt="Join Fútbol App Screenshots"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 h-[300px] w-[300px] rounded-full bg-primary/30 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
