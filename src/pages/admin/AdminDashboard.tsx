import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { ProgrammesAdmin } from './ProgrammesAdmin'
import { ProductsAdmin } from './ProductsAdmin'
import { DeliveryAdmin } from './DeliveryAdmin'
import { TestimonialsAdmin } from './TestimonialsAdmin'
import { SettingsAdmin } from './SettingsAdmin'

function AdminHome() {
  const { user, signOut } = useAuth()

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-sm text-brand-gold font-semibold uppercase tracking-wide">Administration</p>
          <h1 className="font-display text-3xl text-brand-navy">Control Panel</h1>
          <p className="mt-2 text-gray-600">Signed in as {user?.email}</p>
        </div>
        <Button variant="ghost" onClick={signOut}>
          Sign Out
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link to="/admin/students">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Students</h3>
            <p className="text-gray-600 text-sm">Manage student accounts and roles</p>
          </div>
        </Link>

        <Link to="/admin/teachers">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Teachers</h3>
            <p className="text-gray-600 text-sm">Manage teacher accounts</p>
          </div>
        </Link>

        <Link to="/admin/programmes">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Programmes</h3>
            <p className="text-gray-600 text-sm">Create and edit programmes</p>
          </div>
        </Link>

        <Link to="/admin/payments">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Payments</h3>
            <p className="text-gray-600 text-sm">Track payments and deadlines</p>
          </div>
        </Link>

        <Link to="/admin/content">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Training Content</h3>
            <p className="text-gray-600 text-sm">Manage all training materials</p>
          </div>
        </Link>

        <Link to="/admin/orders">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Orders</h3>
            <p className="text-gray-600 text-sm">Manage catering orders</p>
          </div>
        </Link>

        <Link to="/admin/products">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Products</h3>
            <p className="text-gray-600 text-sm">Manage products and pricing</p>
          </div>
        </Link>

        <Link to="/admin/delivery">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Delivery Cities</h3>
            <p className="text-gray-600 text-sm">Configure delivery zones</p>
          </div>
        </Link>

        <Link to="/admin/gallery">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Gallery</h3>
            <p className="text-gray-600 text-sm">Manage images and videos</p>
          </div>
        </Link>

        <Link to="/admin/testimonials">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Testimonials</h3>
            <p className="text-gray-600 text-sm">Manage testimonials</p>
          </div>
        </Link>

        <Link to="/admin/certificates">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Certificates</h3>
            <p className="text-gray-600 text-sm">Issue and manage certificates</p>
          </div>
        </Link>

        <Link to="/admin/settings">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Settings</h3>
            <p className="text-gray-600 text-sm">Site configuration</p>
          </div>
        </Link>
      </div>

      <div className="bg-brand-light p-8 rounded-brand">
        <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">Quick Stats</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold text-brand-navy">0</p>
            <p className="text-gray-600 text-sm">Total Students</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-brand-navy">0</p>
            <p className="text-gray-600 text-sm">Active Programmes</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-brand-navy">₦0</p>
            <p className="text-gray-600 text-sm">Total Revenue</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-brand-navy">0</p>
            <p className="text-gray-600 text-sm">Pending Payments</p>
          </div>
        </div>
      </div>
    </main>
  )
}

function AdminSubPage({ title }: { title: string }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link to="/admin" className="text-brand-navy hover:text-brand-gold mb-6 inline-block">
        ← Back to Dashboard
      </Link>
      <h1 className="font-display text-3xl text-brand-navy mb-8">{title}</h1>
      <p className="text-gray-600">Content coming soon...</p>
    </main>
  )
}

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-brand-light">
      <header className="bg-white border-b border-gray-200">
        <nav className="mx-auto max-w-6xl px-6 py-4">
          <Link to="/admin" className="font-display font-bold text-brand-navy">
            Admin Dashboard
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/students" element={<AdminSubPage title="Student Management" />} />
        <Route path="/teachers" element={<AdminSubPage title="Teacher Management" />} />
        <Route path="/programmes" element={<ProgrammesAdmin />} />
        <Route path="/payments" element={<AdminSubPage title="Payment Management" />} />
        <Route path="/content" element={<AdminSubPage title="Training Content" />} />
        <Route path="/orders" element={<AdminSubPage title="Orders" />} />
        <Route path="/products" element={<ProductsAdmin />} />
        <Route path="/delivery" element={<DeliveryAdmin />} />
        <Route path="/gallery" element={<AdminSubPage title="Gallery" />} />
        <Route path="/testimonials" element={<TestimonialsAdmin />} />
        <Route path="/certificates" element={<AdminSubPage title="Certificates" />} />
        <Route path="/settings" element={<SettingsAdmin />} />
      </Routes>
    </div>
  )
}
