import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Form, FormField, Input, TextArea } from '@/components/Forms'
import type { Database } from '@/types/database'

type Programme = Database['public']['Tables']['programmes']['Row']

export function ProgrammesAdmin() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    duration_weeks: '',
    certification: '',
    fee_naira: '',
    category: '',
    featured: false,
    active: true,
  })

  useEffect(() => {
    loadProgrammes()
  }, [])

  const loadProgrammes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('programmes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setProgrammes(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: formData.name,
      slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description || null,
      duration_weeks: formData.duration_weeks ? parseInt(formData.duration_weeks) : null,
      certification: formData.certification || null,
      fee_naira: parseInt(formData.fee_naira) || 0,
      category: formData.category || null,
      featured: formData.featured,
      active: formData.active,
    }

    if (editingId) {
      await supabase.from('programmes').update(payload).eq('id', editingId)
    } else {
      await supabase.from('programmes').insert([payload])
    }

    loadProgrammes()
    resetForm()
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      duration_weeks: '',
      certification: '',
      fee_naira: '',
      category: '',
      featured: false,
      active: true,
    })
  }

  const startEdit = (prog: Programme) => {
    setFormData({
      name: prog.name,
      slug: prog.slug,
      description: prog.description || '',
      duration_weeks: prog.duration_weeks?.toString() || '',
      certification: prog.certification || '',
      fee_naira: prog.fee_naira?.toString() || '',
      category: prog.category || '',
      featured: prog.featured || false,
      active: prog.active || true,
    })
    setEditingId(prog.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this programme?')) {
      await supabase.from('programmes').delete().eq('id', id)
      loadProgrammes()
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-brand-navy">Programmes</h1>
        <Button onClick={() => setShowForm(true)}>+ Add Programme</Button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-brand border border-gray-200">
          <Form
            onSubmit={handleSubmit}
            title={editingId ? 'Edit Programme' : 'New Programme'}
            submitLabel={editingId ? 'Update' : 'Create'}
          >
            <FormField label="Name" required>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Professional Catering"
                required
              />
            </FormField>

            <FormField label="Slug (auto-generated)" required>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., professional-catering"
                required
              />
            </FormField>

            <FormField label="Description">
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Programme description"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Duration (weeks)">
                <Input
                  type="number"
                  value={formData.duration_weeks}
                  onChange={(e) => setFormData({ ...formData, duration_weeks: e.target.value })}
                  placeholder="e.g., 12"
                />
              </FormField>

              <FormField label="Fee (₦)" required>
                <Input
                  type="number"
                  value={formData.fee_naira}
                  onChange={(e) => setFormData({ ...formData, fee_naira: e.target.value })}
                  placeholder="e.g., 150000"
                  required
                />
              </FormField>
            </div>

            <FormField label="Certification">
              <Input
                value={formData.certification}
                onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                placeholder="e.g., Diploma in Catering"
              />
            </FormField>

            <FormField label="Category">
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Culinary"
              />
            </FormField>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Featured Programme</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit">
                {editingId ? 'Update Programme' : 'Create Programme'}
              </Button>
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading programmes...</p>
      ) : programmes.length === 0 ? (
        <p className="text-gray-600">No programmes yet. Create your first one!</p>
      ) : (
        <div className="grid gap-4">
          {programmes.map((prog) => (
            <div key={prog.id} className="bg-white border border-gray-200 p-6 rounded-brand flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-display font-bold text-brand-navy">{prog.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{prog.description}</p>
                <div className="flex gap-4 text-sm text-gray-600 mt-3">
                  {prog.duration_weeks && <span>{prog.duration_weeks} weeks</span>}
                  <span className="text-brand-gold font-semibold">₦{prog.fee_naira?.toLocaleString()}</span>
                  {prog.certification && <span>{prog.certification}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => startEdit(prog)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(prog.id)}
                  className="text-red-600 hover:bg-red-50"
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
