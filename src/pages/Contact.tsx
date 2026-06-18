import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="bg-gradient-to-r from-brand-navy to-brand-dark px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-100">Get in touch with Pabblyn Metropolitan College.</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-brand focus:outline-none focus:border-brand-navy"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-brand focus:outline-none focus:border-brand-navy"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-brand focus:outline-none focus:border-brand-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-brand focus:outline-none focus:border-brand-navy"
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit">Send Message</Button>
                {submitted && (
                  <p className="text-green-600 text-sm">Message sent! We'll get back to you soon.</p>
                )}
              </form>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-brand-navy mb-2">Address</h3>
                  <p className="text-gray-600">
                    Mbeirebe Akpawat<br />
                    Ibesikpo Asuthan LGA<br />
                    Akwa Ibom State, Nigeria
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-navy mb-2">WhatsApp</h3>
                  <a href="https://wa.me/09028877816" className="text-brand-gold hover:underline">
                    +234 902 887 7816
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-navy mb-2">Email</h3>
                  <a href="mailto:admissions@pabblyncollege.edu" className="text-brand-gold hover:underline">
                    admissions@pabblyncollege.edu
                  </a>
                </div>
                <div className="bg-brand-light p-6 rounded-brand">
                  <h3 className="font-semibold text-brand-navy mb-2">Business Hours</h3>
                  <p className="text-gray-600 text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
