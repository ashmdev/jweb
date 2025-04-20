import Navbar from "@/components/ui/navbar"
import Hero from "@/components/sections/hero"
import Features from "@/components/sections/features"
import HowItWorks from "@/components/sections/how-it-works"
import Testimonials from "@/components/sections/testimonials"
import CTA from "@/components/sections/cta"
import Footer from "@/components/sections/footer"
import ScrollToTop from "@/components/ui/scroll-to-top"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
