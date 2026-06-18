import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/Button'

export function Login() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Already signed in? Send them on. Gating on loading prevents a flash.
  if (!loading && session) {
    const dest = (location.state as { from?: Location })?.from?.pathname ?? '/'
    return <Navigate to={dest} replace />
  }

  const signIn = async () => {
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6 bg-gradient-to-br from-brand-navy to-brand-dark">
      <div className="text-center mb-8">
        <img src="/images/pabblyn-logo.png" alt="Pabblyn" className="h-16 mx-auto mb-4" />
        <h1 className="font-display text-3xl text-white mb-2">Sign In</h1>
        <p className="text-gray-100 text-sm">Pabblyn Metropolitan College</p>
      </div>

      <div className="bg-white p-8 rounded-brand space-y-4">
        <input
          className="w-full rounded-brand border border-gray-300 px-4 py-2.5 focus:outline-none focus:border-brand-navy"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-brand border border-gray-300 px-4 py-2.5 focus:outline-none focus:border-brand-navy"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button onClick={signIn} disabled={busy} className="w-full">
          {busy ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>

      <p className="text-center text-gray-300 text-xs mt-6">
        Demo: admissions@pabblyncollege.edu / P@bblyn2026!
      </p>
    </main>
  )
}
