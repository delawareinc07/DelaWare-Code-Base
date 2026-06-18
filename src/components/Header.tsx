import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useRole } from '@/hooks/useRole'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { session, signOut } = useAuth()
  const { isAdmin, isStudent, isStaff } = useRole()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/pabblyn-logo.png" alt="Pabblyn" className="h-10" />
          <span className="font-display font-bold text-brand-navy hidden sm:inline">Pabblyn</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/programmes" className="text-sm font-medium text-gray-700 hover:text-brand-navy">
            Programmes
          </Link>
          <Link to="/learning-community" className="text-sm font-medium text-gray-700 hover:text-brand-navy">
            Community
          </Link>
          <Link to="/gallery" className="text-sm font-medium text-gray-700 hover:text-brand-navy">
            Gallery
          </Link>
          <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-brand-navy">
            Contact
          </Link>

          {session ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" className="text-sm">Admin</Button>
                </Link>
              )}
              {isStaff && (
                <Link to="/teacher">
                  <Button variant="ghost" className="text-sm">Dashboard</Button>
                </Link>
              )}
              {isStudent && (
                <Link to="/student">
                  <Button variant="ghost" className="text-sm">Portal</Button>
                </Link>
              )}
              <Button variant="ghost" onClick={signOut} className="text-sm">
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="text-sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-brand-navy"
        >
          ☰
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 md:hidden">
            <div className="flex flex-col gap-4 p-6">
              <Link to="/programmes" className="text-sm font-medium text-gray-700">
                Programmes
              </Link>
              <Link to="/learning-community" className="text-sm font-medium text-gray-700">
                Community
              </Link>
              <Link to="/gallery" className="text-sm font-medium text-gray-700">
                Gallery
              </Link>
              <Link to="/contact" className="text-sm font-medium text-gray-700">
                Contact
              </Link>
              {session ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="text-sm font-medium text-gray-700">
                      Admin
                    </Link>
                  )}
                  {isStaff && (
                    <Link to="/teacher" className="text-sm font-medium text-gray-700">
                      Dashboard
                    </Link>
                  )}
                  {isStudent && (
                    <Link to="/student" className="text-sm font-medium text-gray-700">
                      Portal
                    </Link>
                  )}
                  <button onClick={signOut} className="text-sm font-medium text-left text-gray-700">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-sm font-medium text-gray-700">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
