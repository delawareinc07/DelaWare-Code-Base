import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type AppRole = Database['public']['Enums']['app_role']

/**
 * Resolves the current user's roles from the `user_roles` table.
 *
 * We deliberately do NOT read roles from the JWT or user metadata.
 * Metadata is set at signup and goes stale the moment an admin changes
 * someone's role; the table is the single source of truth. The cost is
 * one extra query, which is cheap and correct.
 */
export function useRole() {
  const { user, loading: authLoading } = useAuth()
  const [roles, setRoles] = useState<AppRole[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    if (authLoading) return
    if (!user) {
      setRoles([])
      setLoading(false)
      return
    }

    setLoading(true)
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          console.error('Failed to resolve roles:', error.message)
          setRoles([])
        } else {
          setRoles(data.map((r) => r.role))
        }
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user, authLoading])

  const hasRole = (role: AppRole) => roles.includes(role)
  const isAdmin = hasRole('admin') || hasRole('super_admin')
  const isStaff = isAdmin || hasRole('teacher')
  const isStudent = hasRole('student')

  return { roles, hasRole, isAdmin, isStaff, isStudent, loading: loading || authLoading }
}
