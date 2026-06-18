import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Form, FormField, Input, TextArea, Select } from '@/components/Forms'
import type { Database } from '@/types/database'

type Testimonial = Database['public']['Tables']['testimonials']['Row']
type TestimonialCategory = Database['public']['Enums']['testimonial_category']

const categories: { label: string; value: TestimonialCategory }[] = [
  { label: 'Student', value: 'student' },
  { label: 'Graduate', value: 'graduate' },
  { label: 'Catering Client', value: 'catering_client' },
  { label: 'Corporate Client', value: 'corporate_client' },
]

export function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category: 'student' as TestimonialCategory,
    author_name: '',
    author_title: '',
    quote: '',
    featured: false,
  })

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    if (data) setTestimonials(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      category: formData.category,
      author_name: formData.author_name,
      author_title: formData.author_title || null,
      quote: formData.quote,
      featured: formData.featured,
    }

    if (editingId) {
      await supabase.from('testimonials').update(payload).eq('id', editingId)
    } else {
      await supabase.from('testimonials').insert([payload])
    }

    loadTestimonials()
    resetForm()
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      category: 'student',
      author_name: '',
      author_title: '',
      quote: '',
      featured: false,
    })
  }

  const startEdit = (test: Testimonial) => {
    setFormData({
      category: test.category,
      author_name: test.author_name,
      author_title: test.author_title || '',
      quote: test.quote,
      featured: test.featured || false,
    })
    setEditingId(test.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this testimonial?')) {
      await supabase.from('testimonials').delete().eq('id', id)
      loadTestimonials()
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-brand-navy">Testimonials</h1>
        <Button onClick={() => setShowForm(true)}>+ Add Testimonial</Button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-brand border border-gray-200">
          <Form
            onSubmit={handleSubmit}
            title={editingId ? 'Edit Testimonial' : 'New Testimonial'}
            submitLabel={editingId ? 'Update' : 'Create'}
          >
            <FormField label="Category" required>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TestimonialCategory })}
                options={categories}
                required
              />
            </FormField>

            <FormField label="Author Name" required>
              <Input
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="e.g., Chioma Okafor"
                required
              />
            </FormField>

            <FormField label="Author Title/Role">
              <Input
                value={formData.author_title}
                onChange={(e) => setFormData({ ...formData, author_title: e.target.value })}
                placeholder="e.g., Catering Entrepreneur"
              />
            </FormField>

            <FormField label="Quote/Testimonial" required>
              <TextArea
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                rows={4}
                placeholder="The testimonial text..."
                required
              />
            </FormField>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Featured on homepage</span>
            </label>

            <div className="flex gap-3">
              <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading testimonials...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-gray-600">No testimonials yet.</p>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((test) => (
            <div key={test.id} className="bg-white border border-gray-200 p-6 rounded-brand">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-display font-bold text-brand-navy">{test.author_name}</h3>
                  {test.author_title && (
                    <p className="text-sm text-gray-600">{test.author_title}</p>
                  )}
                  <p className="text-xs text-gray-500 capitalize mt-1">{test.category}</p>
                </div>
                {test.featured && (
                  <span className="bg-brand-gold text-brand-navy text-xs px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-gray-700 italic">"{test.quote}"</p>
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" onClick={() => startEdit(test)} className="text-sm">
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(test.id)}
                  className="text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
