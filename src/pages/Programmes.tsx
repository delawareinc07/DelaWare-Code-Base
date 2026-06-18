import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import type { Database } from '@/types/database'

export function Programmes() {
  const [programmes, setProgammes] = useState<Database['public']['Tables']['programmes']['Row'][]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('programmes')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setProgammes(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-brand-navy to-brand-dark px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-white mb-4">Our Programmes</h1>
          <p className="text-gray-100">
            Choose from our comprehensive range of culinary and catering programs designed to develop your skills and launch your career.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading programmes...</p>
            </div>
          ) : programmes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No programmes available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {programmes.map((prog) => (
                <div
                  key={prog.id}
                  className="border border-gray-200 rounded-brand overflow-hidden hover:shadow-lg transition"
                >
                  {prog.image_url && (
                    <img src={prog.image_url} alt={prog.name} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-brand-navy mb-2">{prog.name}</h3>
                    {prog.description && (
                      <p className="text-gray-600 text-sm mb-4">{prog.description}</p>
                    )}
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      {prog.duration_weeks && (
                        <span>Duration: {prog.duration_weeks} weeks</span>
                      )}
                      <span className="text-brand-gold font-semibold">
                        ₦{prog.fee_naira.toLocaleString()}
                      </span>
                    </div>
                    {prog.certification && (
                      <p className="text-xs text-gray-500 mb-4">
                        <strong>Certificate:</strong> {prog.certification}
                      </p>
                    )}
                    <Link to="/login">
                      <Button className="w-full">Enroll Now</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
