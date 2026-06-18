import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Form, FormField, Input } from '@/components/Forms'
import type { Database } from '@/types/database'

type DeliveryCity = Database['public']['Tables']['delivery_cities']['Row']

export function DeliveryAdmin() {
  const [cities, setCities] = useState<DeliveryCity[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    city_name: '',
    delivery_fee: '',
    service_charge: '',
  })

  useEffect(() => {
    loadCities()
  }, [])

  const loadCities = async () => {
    setLoading(true)
    const { data } = await supabase.from('delivery_cities').select('*').order('created_at', { ascending: false })
    if (data) setCities(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      city_name: formData.city_name,
      delivery_fee: parseInt(formData.delivery_fee) || 0,
      service_charge: parseInt(formData.service_charge) || 0,
    }

    if (editingId) {
      await supabase.from('delivery_cities').update(payload).eq('id', editingId)
    } else {
      await supabase.from('delivery_cities').insert([payload])
    }

    loadCities()
    resetForm()
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ city_name: '', delivery_fee: '', service_charge: '' })
  }

  const startEdit = (city: DeliveryCity) => {
    setFormData({
      city_name: city.city_name,
      delivery_fee: city.delivery_fee?.toString() || '',
      service_charge: city.service_charge?.toString() || '',
    })
    setEditingId(city.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this city?')) {
      await supabase.from('delivery_cities').delete().eq('id', id)
      loadCities()
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-brand-navy">Delivery Cities</h1>
        <Button onClick={() => setShowForm(true)}>+ Add City</Button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-brand border border-gray-200">
          <Form
            onSubmit={handleSubmit}
            title={editingId ? 'Edit City' : 'New Delivery City'}
            submitLabel={editingId ? 'Update' : 'Create'}
          >
            <FormField label="City Name" required>
              <Input
                value={formData.city_name}
                onChange={(e) => setFormData({ ...formData, city_name: e.target.value })}
                placeholder="e.g., Lagos"
                required
              />
            </FormField>

            <FormField label="Delivery Fee (₦)" required>
              <Input
                type="number"
                value={formData.delivery_fee}
                onChange={(e) => setFormData({ ...formData, delivery_fee: e.target.value })}
                placeholder="e.g., 2000"
                required
              />
            </FormField>

            <FormField label="Service Charge (₦)">
              <Input
                type="number"
                value={formData.service_charge}
                onChange={(e) => setFormData({ ...formData, service_charge: e.target.value })}
                placeholder="e.g., 500"
              />
            </FormField>

            <div className="flex gap-3">
              <Button type="submit">{editingId ? 'Update City' : 'Add City'}</Button>
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading cities...</p>
      ) : cities.length === 0 ? (
        <p className="text-gray-600">No cities configured yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Delivery Fee</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Service Charge</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cities.map((city) => (
                <tr key={city.id}>
                  <td className="px-6 py-4 text-sm font-medium text-brand-navy">{city.city_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">₦{city.delivery_fee?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">₦{city.service_charge?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Button variant="ghost" onClick={() => startEdit(city)} className="text-xs">
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(city.id)}
                      className="text-xs text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
