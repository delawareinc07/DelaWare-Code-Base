import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Form, FormField, Input, TextArea, Select } from '@/components/Forms'
import type { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']
type DeliveryCity = Database['public']['Tables']['delivery_cities']['Row']
type ProductCategory = Database['public']['Enums']['product_category']

interface CartItem {
  product: Product
  quantity: number
}

export function Ordering() {
  const [products, setProducts] = useState<Product[]>([])
  const [cities, setCities] = useState<DeliveryCity[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_city: '',
    delivery_address: '',
    notes: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [prodRes, cityRes] = await Promise.all([
      supabase.from('products').select('*').eq('available', true),
      supabase.from('delivery_cities').select('*'),
    ])
    if (prodRes.data) setProducts(prodRes.data)
    if (cityRes.data) setCities(cityRes.data)
    setLoading(false)
  }

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id)
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.product.id !== productId))
    } else {
      setCart(
        cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const getProductTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price_naira || 0) * item.quantity, 0)
  }

  const getDeliveryFee = () => {
    const city = cities.find((c) => c.city_name === formData.delivery_city)
    return city?.delivery_fee || 0
  }

  const getServiceCharge = () => {
    const city = cities.find((c) => c.city_name === formData.delivery_city)
    return city?.service_charge || 0
  }

  const getGrandTotal = () => {
    return getProductTotal() + getDeliveryFee() + getServiceCharge()
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) return

    setSubmitting(true)

    const productTotal = getProductTotal()
    const deliveryFee = getDeliveryFee()
    const serviceCharge = getServiceCharge()
    const grandTotal = getGrandTotal()

    const { data: order } = await supabase
      .from('product_orders')
      .insert([
        {
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: formData.customer_email || null,
          delivery_city: formData.delivery_city,
          delivery_address: formData.delivery_address,
          notes: formData.notes || null,
          product_total: productTotal,
          delivery_fee: deliveryFee,
          service_charge: serviceCharge,
          grand_total: grandTotal,
        },
      ])
      .select()
      .single()

    if (order) {
      const items = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price_naira || 0,
        subtotal: (item.product.price_naira || 0) * item.quantity,
      }))

      await supabase.from('order_items').insert(items)

      const productList = cart
        .map((item) => `${item.quantity}x ${item.product.name}`)
        .join(', ')

      const whatsappMessage = `Hi! I'd like to place an order.\n\nCustomer: ${formData.customer_name}\nPhone: ${formData.customer_phone}\nProducts: ${productList}\nDelivery: ${formData.delivery_address}, ${formData.delivery_city}\nTotal: ₦${grandTotal.toLocaleString()}`

      const whatsappUrl = `https://wa.me/09028877816?text=${encodeURIComponent(
        whatsappMessage
      )}`

      window.location.href = whatsappUrl
    }

    setSubmitting(false)
  }

  const categories = [
    'food',
    'pastries',
    'desserts',
    'ethnic_treats',
    'event_catering',
    'corporate_catering',
    'services',
  ] as ProductCategory[]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-brand-navy to-brand-dark px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-4xl font-bold text-white mb-4">Order Our Catering Services</h1>
          <p className="text-gray-100">
            Delicious food, pastries, desserts, and catering services delivered to your location.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Products List */}
            <div className="md:col-span-2">
              {loading ? (
                <p className="text-gray-600">Loading products...</p>
              ) : (
                <div className="space-y-8">
                  {categories.map((cat) => {
                    const catProducts = products.filter((p) => p.category === cat)
                    if (catProducts.length === 0) return null
                    return (
                      <div key={cat}>
                        <h2 className="font-display text-2xl font-bold text-brand-navy mb-4 capitalize">
                          {cat.replace('_', ' ')}
                        </h2>
                        <div className="grid gap-4">
                          {catProducts.map((prod) => (
                            <div
                              key={prod.id}
                              className="border border-gray-200 p-4 rounded-brand flex justify-between items-start gap-4"
                            >
                              <div className="flex-1">
                                <h3 className="font-display font-bold text-brand-navy">{prod.name}</h3>
                                {prod.description && (
                                  <p className="text-sm text-gray-600 mt-1">{prod.description}</p>
                                )}
                                <p className="text-brand-gold font-semibold mt-2">
                                  ₦{(prod.price_naira || 0).toLocaleString()}/{prod.quantity_unit}
                                </p>
                              </div>
                              <Button
                                onClick={() => addToCart(prod)}
                                variant="secondary"
                              >
                                Add
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Cart & Checkout */}
            <div className="sticky top-20 h-fit">
              <div className="bg-brand-light p-6 rounded-brand border border-gray-200">
                <h2 className="font-display font-bold text-brand-navy mb-4">Your Order</h2>

                {cart.length === 0 ? (
                  <p className="text-gray-600 text-sm">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.product.id} className="bg-white p-3 rounded-brand">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-semibold text-brand-navy">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => updateQuantity(item.product.id, 0)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="text-xs px-2 py-1 border border-gray-300 rounded"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                              className="w-10 text-center text-sm border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="text-xs px-2 py-1 border border-gray-300 rounded"
                            >
                              +
                            </button>
                            <span className="text-xs font-semibold text-brand-gold ml-auto">
                              ₦{((item.product.price_naira || 0) * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-300 pt-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold">₦{getProductTotal().toLocaleString()}</span>
                      </div>
                      {formData.delivery_city && (
                        <>
                          <div className="flex justify-between">
                            <span>Delivery</span>
                            <span className="font-semibold">₦{getDeliveryFee().toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Service Charge</span>
                            <span className="font-semibold">₦{getServiceCharge().toLocaleString()}</span>
                          </div>
                        </>
                      )}
                      <div className="border-t border-gray-300 pt-2 flex justify-between text-base font-bold text-brand-navy">
                        <span>Total</span>
                        <span>₦{getGrandTotal().toLocaleString()}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowCheckout(true)}
                      className="w-full mt-4"
                      disabled={cart.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-brand p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-2xl font-bold text-brand-navy mb-6">Checkout</h2>

            <Form onSubmit={handleSubmitOrder} loading={submitting}>
              <FormField label="Full Name" required>
                <Input
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Phone" required>
                <Input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Email">
                <Input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                />
              </FormField>

              <FormField label="Delivery City" required>
                <Select
                  value={formData.delivery_city}
                  onChange={(e) => setFormData({ ...formData, delivery_city: e.target.value })}
                  options={cities.map((c) => ({ label: c.city_name, value: c.city_name }))}
                  required
                />
              </FormField>

              <FormField label="Delivery Address" required>
                <TextArea
                  value={formData.delivery_address}
                  onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                  rows={2}
                  required
                />
              </FormField>

              <FormField label="Special Notes">
                <TextArea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Any special instructions..."
                />
              </FormField>

              <div className="bg-brand-light p-4 rounded-brand text-sm space-y-1 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{getProductTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₦{getDeliveryFee().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span>₦{getServiceCharge().toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-brand-gold">₦{getGrandTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
