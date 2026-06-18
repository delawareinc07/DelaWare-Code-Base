import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useRole, type AppRole } from '@/hooks/useRole'

type Props = {
  children: ReactNode
  /** If set, the user must hold at least one of these roles. */
  roles?: AppRole[]
}

/**
 * The single rule that kills redirect loops: never make a routing
 * decision while auth or roles are still loading. Show a neutral
 * loading state instead. Only once we KNOW the user is signed out (or
 * lacks the role) do we redirect.
 */
export function ProtectedRoute({ children, roles }: Props) {
  const { session, loading: authLoading } = useAuth()
  const { hasRole, loading: roleLoading } = useRole()
  const location = useLocation()

  if (authLoading || (session && roles && roleLoading)) {
    return <FullScreenLoader />
  }

  if (!session) {
    // Remember where they were headed so login can send them back.
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && !roles.some((r) => hasRole(r))) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function FullScreenLoader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--color-ink)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      Loading...
    </div>
  )
}
