import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/Button'

function TeacherDashboard() {
  const { user, signOut } = useAuth()

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-sm text-brand-gold font-semibold uppercase tracking-wide">Teacher Portal</p>
          <h1 className="font-display text-3xl text-brand-navy">Dashboard</h1>
          <p className="mt-2 text-gray-600">Signed in as {user?.email}</p>
        </div>
        <Button variant="ghost" onClick={signOut}>
          Sign Out
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/teacher/courses">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">My Courses</h3>
            <p className="text-gray-600 text-sm">Manage your courses and programmes</p>
          </div>
        </Link>

        <Link to="/teacher/uploads">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Upload Training</h3>
            <p className="text-gray-600 text-sm">Create and upload training content</p>
          </div>
        </Link>

        <Link to="/teacher/students">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Student Management</h3>
            <p className="text-gray-600 text-sm">View and manage your students</p>
          </div>
        </Link>

        <Link to="/teacher/discussions">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Discussions</h3>
            <p className="text-gray-600 text-sm">Moderate student discussions</p>
          </div>
        </Link>

        <Link to="/teacher/reports">
          <div className="bg-white border border-gray-200 p-6 rounded-brand hover:shadow-lg transition cursor-pointer">
            <h3 className="font-display font-bold text-brand-navy mb-2">Reports</h3>
            <p className="text-gray-600 text-sm">View course analytics</p>
          </div>
        </Link>
      </div>
    </main>
  )
}

function TeacherSubPage({ title }: { title: string }) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link to="/teacher" className="text-brand-navy hover:text-brand-gold mb-6 inline-block">
        ← Back to Dashboard
      </Link>
      <h1 className="font-display text-3xl text-brand-navy mb-8">{title}</h1>
      <p className="text-gray-600">Content coming soon...</p>
    </main>
  )
}

export function TeacherPortal() {
  return (
    <div className="min-h-screen bg-brand-light">
      <header className="bg-white border-b border-gray-200">
        <nav className="mx-auto max-w-4xl px-6 py-4">
          <Link to="/teacher" className="font-display font-bold text-brand-navy">
            Teacher Portal
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<TeacherDashboard />} />
        <Route path="/courses" element={<TeacherSubPage title="My Courses" />} />
        <Route path="/uploads" element={<TeacherSubPage title="Upload Training" />} />
        <Route path="/students" element={<TeacherSubPage title="Student Management" />} />
        <Route path="/discussions" element={<TeacherSubPage title="Discussions" />} />
        <Route path="/reports" element={<TeacherSubPage title="Reports" />} />
      </Routes>
    </div>
  )
}
