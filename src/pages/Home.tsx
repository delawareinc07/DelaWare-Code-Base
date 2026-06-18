import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-dark to-brand-navy px-6 py-20 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              LEARN. PRACTICE. IMPACT.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-100 max-w-2xl mx-auto">
              Join a growing community of aspiring caterers, culinary professionals, food entrepreneurs, and hospitality leaders learning, sharing, and building skills for the modern world.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/programmes">
                <Button className="px-8">Register For A Programme</Button>
              </Link>
              <Link to="/learning-community">
                <Button variant="secondary" className="px-8">Explore Learning Community</Button>
              </Link>
              <Link to="/products-services">
                <Button variant="ghost" className="px-8 text-white border border-white hover:bg-white/10">Order Catering Services</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Pabblyn */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-brand-navy text-center mb-12">
            Why Choose Pabblyn?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Expert Teachers',
                desc: 'Learn from industry professionals with years of experience in catering and culinary arts.',
              },
              {
                title: 'Hands-On Practice',
                desc: 'Participate in live practical sessions and share your culinary creations with the community.',
              },
              {
                title: 'Certificates',
                desc: 'Earn recognized certificates upon completion to boost your career and credentials.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 bg-brand-gold rounded-brand mx-auto mb-4"></div>
                <h3 className="font-display text-xl font-bold text-brand-navy mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Community Preview */}
      <section className="bg-brand-light px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-brand-navy text-center mb-12">
            Active Learning Community
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-brand border border-gray-200">
              <h3 className="font-display text-xl font-bold text-brand-navy mb-4">Latest Trainings</h3>
              <p className="text-gray-600 mb-4">Explore new courses and training materials uploaded daily by our expert teachers.</p>
              <Link to="/learning-community">
                <Button variant="ghost">View Trainings →</Button>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-brand border border-gray-200">
              <h3 className="font-display text-xl font-bold text-brand-navy mb-4">Student Projects</h3>
              <p className="text-gray-600 mb-4">See what students are creating and be inspired by their culinary projects.</p>
              <Link to="/student-projects">
                <Button variant="ghost">View Projects →</Button>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-brand border border-gray-200">
              <h3 className="font-display text-xl font-bold text-brand-navy mb-4">Discussions</h3>
              <p className="text-gray-600 mb-4">Join active discussions and get answers from teachers and fellow students.</p>
              <Link to="/learning-community">
                <Button variant="ghost">View Discussions →</Button>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-brand border border-gray-200">
              <h3 className="font-display text-xl font-bold text-brand-navy mb-4">Testimonials</h3>
              <p className="text-gray-600 mb-4">Read inspiring stories from graduates and catering clients.</p>
              <Link to="/testimonials">
                <Button variant="ghost">Read Testimonials →</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-navy px-6 py-16 sm:py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-white mb-6">
            Ready to Transform Your Skills?
          </h2>
          <p className="text-gray-100 mb-8 text-lg">
            Join hundreds of students learning and growing with Pabblyn Metropolitan College.
          </p>
          <Link to="/programmes">
            <Button className="px-8 bg-brand-gold text-brand-navy hover:bg-[#e6c200]">
              Explore Our Programmes
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
