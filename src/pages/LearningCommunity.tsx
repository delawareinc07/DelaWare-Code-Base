import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export function LearningCommunity() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="bg-gradient-to-r from-brand-navy to-brand-dark px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-white mb-4">Learning Community</h1>
          <p className="text-gray-100">
            Explore trainings, discussions, and learn from teachers and students.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-brand-light p-8 rounded-brand">
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">Latest Trainings</h2>
              <p className="text-gray-600">Trainings coming soon...</p>
            </div>
            <div className="bg-brand-light p-8 rounded-brand">
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">Popular Trainings</h2>
              <p className="text-gray-600">Popular content coming soon...</p>
            </div>
            <div className="bg-brand-light p-8 rounded-brand">
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">Discussions</h2>
              <p className="text-gray-600">Active discussions coming soon...</p>
            </div>
            <div className="bg-brand-light p-8 rounded-brand">
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">Top Contributors</h2>
              <p className="text-gray-600">Featured contributors coming soon...</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
