import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Form, FormField, Input, TextArea, Select } from '@/components/Forms'
import type { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']
type ProductCategory = Database['public']['Enums']['product_category']

const categories: { label: string; value: ProductCategory }[] = [
  { label: 'Food', value: 'food' },
  { label: 'Pastries', value: 'pastries' },
  { label: 'Desserts', value: 'desserts' },
  { label: 'Ethnic Treats', value: 'ethnic_treats' },
  { label: 'Event Catering', value: 'event_catering' },
  { label: 'Corporate Catering', value: 'corporate_catering' },
  { label: 'Services', value: 'services' },
]

export function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'food' as ProductCategory,
    price_naira: '',
    quantity_unit: 'unit',
    available: true,
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: formData.name,
      description: formData.description || null,
      category: formData.category,
      price_naira: parseInt(formData.price_naira) || 0,
      quantity_unit: formData.quantity_unit,
      available: formData.available,
    }

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId)
    } else {
      await supabase.from('products').insert([payload])
    }

    loadProducts()
    resetForm()
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      description: '',
      category: 'food',
      price_naira: '',
      quantity_unit: 'unit',
      available: true,
    })
  }

  const startEdit = (prod: Product) => {
    setFormData({
      name: prod.name,
      description: prod.description || '',
      category: prod.category,
      price_naira: prod.price_naira?.toString() || '',
      quantity_unit: prod.quantity_unit,
      available: prod.available || true,
    })
    setEditingId(prod.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) {
      await supabase.from('products').delete().eq('id', id)
      loadProducts()
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-brand-navy">Products & Services</h1>
        <Button onClick={() => setShowForm(true)}>+ Add Product</Button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-brand border border-gray-200">
          <Form
            onSubmit={handleSubmit}
            title={editingId ? 'Edit Product' : 'New Product'}
            submitLabel={editingId ? 'Update' : 'Create'}
          >
            <FormField label="Name" required>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Jollof Rice"
                required
              />
            </FormField>

            <FormField label="Description">
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Product description"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Category" required>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                  options={categories}
                  required
                />
              </FormField>

              <FormField label="Price (₦)" required>
                <Input
                  type="number"
                  value={formData.price_naira}
                  onChange={(e) => setFormData({ ...formData, price_naira: e.target.value })}
                  placeholder="e.g., 5000"
                  required
                />
              </FormField>
            </div>

            <FormField label="Quantity Unit">
              <Input
                value={formData.quantity_unit}
                onChange={(e) => setFormData({ ...formData, quantity_unit: e.target.value })}
                placeholder="e.g., plate, tray, serving"
              />
            </FormField>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Available for ordering</span>
            </label>

            <div className="flex gap-3">
              <Button type="submit">{editingId ? 'Update Product' : 'Create Product'}</Button>
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products yet.</p>
      ) : (
        <div className="grid gap-4">
          {products.map((prod) => (
            <div key={prod.id} className="bg-white border border-gray-200 p-6 rounded-brand flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-brand-navy">{prod.name}</h3>
                <p className="text-sm text-gray-600">{prod.description}</p>
                <div className="flex gap-4 text-sm text-gray-600 mt-2">
                  <span className="capitalize">{prod.category}</span>
                  <span className="text-brand-gold font-semibold">₦{prod.price_naira?.toLocaleString()}</span>
                  <span>{prod.available ? '✓ Available' : '✗ Unavailable'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => startEdit(prod)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(prod.id)}
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
