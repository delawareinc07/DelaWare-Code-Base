import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AuthContextValue = {
  session: Session | null
  user: User | null
  /**
   * `loading` is true until we have resolved the initial session ONE way
   * or the other. Gate every redirect on this. Redirecting while loading
   * is still true is what produces the login -> dashboard -> login loops.
   */
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    // ORDER MATTERS. Subscribe to auth changes FIRST, then fetch the
    // existing session. Doing it the other way round drops the very
    // first SIGNED_IN event on a fresh load and leaves the UI thinking
    // nobody is logged in until a refresh.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!mounted.current) return
      setSession(next)
      setLoading(false)
      // NOTE: never await a Supabase call directly inside this callback.
      // The client holds a lock during the event and an inline await can
      // deadlock it. If you need to load data on sign-in, defer it:
      //   setTimeout(() => { void loadProfile(next!.user.id) }, 0)
    })

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted.current) return
      setSession(data.session)
      setLoading(false)
    })

    return () => {
      mounted.current = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
