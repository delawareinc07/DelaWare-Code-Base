import { Navigate } from 'react-router-dom'
import { useRole } from '@/hooks/useRole'

export function Dashboard() {
  const { isAdmin, isStudent, isStaff, loading } = useRole()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (isAdmin) return <Navigate to="/admin" replace />
  if (isStaff) return <Navigate to="/teacher" replace />
  if (isStudent) return <Navigate to="/student" replace />

  return <Navigate to="/" replace />
}
