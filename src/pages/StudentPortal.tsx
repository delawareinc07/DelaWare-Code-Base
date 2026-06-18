import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { StudentProgrammes } from './student/StudentProgrammes'
import { StudentPayments } from './student/StudentPayments'

function StudentDashboard() {
  const { user, signOut } = useAuth()

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-sm text-brand-gold font-semibold uppercase tracking-wide">Student Portal</p>
          <h1 className="font-display text-3xl text-brand-navy">Dashboard</h1>
          <p className="mt-2 text-gray-600">Signed in as {user?.email}</p>
        </div>
        <Button variant="ghost" onClick={signOut}>
          Sign Out
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/student/programmes">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">My Programmes</h3>
            <p className="text-gray-600 text-sm">View your enrolled programmes</p>
          </div>
        </Link>

        <Link to="/student/library">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Learning Library</h3>
            <p className="text-gray-600 text-sm">Access training materials</p>
          </div>
        </Link>

        <Link to="/student/payments">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Payments</h3>
            <p className="text-gray-600 text-sm">Manage your payments</p>
          </div>
        </Link>

        <Link to="/student/uploads">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">My Uploads</h3>
            <p className="text-gray-600 text-sm">Your training content</p>
          </div>
        </Link>

        <Link to="/student/projects">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Projects</h3>
            <p className="text-gray-600 text-sm">Submit your projects</p>
          </div>
        </Link>

        <Link to="/student/certificates">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Certificates</h3>
            <p className="text-gray-600 text-sm">Your certificates</p>
          </div>
        </Link>
      </div>
    </main>
  )
}

function StudentSubPage({ title }: { title: string }) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link to="/student" className="text-brand-navy hover:text-brand-gold mb-6 inline-block">
        ← Back to Dashboard
      </Link>
      <h1 className="font-display text-3xl text-brand-navy mb-8">{title}</h1>
      <p className="text-gray-600">Content coming soon...</p>
    </main>
  )
}

export function StudentPortal() {
  return (
    <div className="min-h-screen bg-brand-light">
      <header className="bg-white border-b border-gray-200">
        <nav className="mx-auto max-w-4xl px-6 py-4">
          <Link to="/student" className="font-display font-bold text-brand-navy">
            Student Portal
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/programmes" element={<StudentProgrammes />} />
        <Route path="/library" element={<StudentSubPage title="Learning Library" />} />
        <Route path="/payments" element={<StudentPayments />} />
        <Route path="/uploads" element={<StudentSubPage title="My Uploads" />} />
        <Route path="/projects" element={<StudentSubPage title="Projects" />} />
        <Route path="/certificates" element={<StudentSubPage title="Certificates" />} />
      </Routes>
    </div>
  )
}
