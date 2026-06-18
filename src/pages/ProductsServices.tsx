import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export function ProductsServices() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="bg-gradient-to-r from-brand-navy to-brand-dark px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-white mb-4">Products & Catering Services</h1>
          <p className="text-gray-100">Order our delicious food, pastries, and catering services.</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-gray-600">Products and ordering system coming soon...</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
