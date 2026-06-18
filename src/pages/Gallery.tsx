import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import type { Database } from '@/types/database'

type GalleryItem = Database['public']['Tables']['gallery_items']['Row']
type GalleryCategory = Database['public']['Enums']['gallery_category']

const categories: { label: string; value: GalleryCategory }[] = [
  { label: 'Classes', value: 'classes' },
  { label: 'Trainings', value: 'trainings' },
  { label: 'Practical Sessions', value: 'practical_sessions' },
  { label: 'Catering Events', value: 'catering_events' },
  { label: 'Food Displays', value: 'food_displays' },
  { label: 'Cakes', value: 'cakes' },
  { label: 'Student Projects', value: 'student_projects' },
]

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | 'all'>('all')

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    setLoading(true)
    const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }

  const filteredItems =
    selectedCategory === 'all' ? items : items.filter((item) => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-brand-navy to-brand-dark px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-white mb-4">Gallery</h1>
          <p className="text-gray-100">View our classes, events, and student work.</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
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
            <p className="text-center text-gray-600">Loading gallery...</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-gray-600">No images in this category yet.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="rounded-brand overflow-hidden shadow-lg hover:shadow-xl transition">
                  {item.media_type.startsWith('image') ? (
                    <img
                      src={item.media_url}
                      alt={item.title ?? ''}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <video
                      src={item.media_url}
                      controls
                      className="w-full h-48 object-cover bg-black"
                    />
                  )}
                  <div className="p-4 bg-white">
                    {item.title && (
                      <h3 className="font-display font-bold text-brand-navy mb-2">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                    <p className="text-xs text-gray-500 capitalize mt-2">{item.category.replace('_', ' ')}</p>
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
