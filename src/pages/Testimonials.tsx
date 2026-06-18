import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import type { Database } from '@/types/database'

type Testimonial = Database['public']['Tables']['testimonials']['Row']
type TestimonialCategory = Database['public']['Enums']['testimonial_category']

const categories: { label: string; value: TestimonialCategory }[] = [
  { label: 'Students', value: 'student' },
  { label: 'Graduates', value: 'graduate' },
  { label: 'Catering Clients', value: 'catering_client' },
  { label: 'Corporate Clients', value: 'corporate_client' },
]

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<TestimonialCategory | 'all'>('all')

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
    if (data) setTestimonials(data)
    setLoading(false)
  }

  const filtered =
    selectedCategory === 'all'
      ? testimonials
      : testimonials.filter((t) => t.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-brand-navy to-brand-dark px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-white mb-4">Testimonials</h1>
          <p className="text-gray-100">Hear from our students, graduates, and clients.</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-brand transition ${
                selectedCategory === 'all'
                  ? 'bg-brand-navy text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-brand transition ${
                  selectedCategory === cat.value
                    ? 'bg-brand-navy text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading testimonials...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-600">No testimonials in this category yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filtered.map((test) => (
                <div
                  key={test.id}
                  className="bg-brand-light p-8 rounded-brand border-l-4 border-brand-gold hover:shadow-lg transition"
                >
                  {test.featured && (
                    <div className="mb-3">
                      <span className="text-xs bg-brand-gold text-brand-navy px-3 py-1 rounded-full font-semibold">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                  <p className="text-gray-700 italic text-lg mb-6">"{test.quote}"</p>
                  <div>
                    <p className="font-display font-bold text-brand-navy">{test.author_name}</p>
                    {test.author_title && (
                      <p className="text-sm text-gray-600">{test.author_title}</p>
                    )}
                    <p className="text-xs text-gray-500 capitalize mt-2">
                      {test.category.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
