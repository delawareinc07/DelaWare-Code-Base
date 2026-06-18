import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import type { Database } from '@/types/database'

type Programme = Database['public']['Tables']['programmes']['Row']
type Enrollment = Database['public']['Tables']['programme_enrollments']['Row']

interface EnrolledProgramme extends Enrollment {
  programmes: Programme | null
}

export function StudentProgrammes() {
  const { user } = useAuth()
  const [allProgrammes, setAllProgrammes] = useState<Programme[]>([])
  const [enrolledProgrammes, setEnrolledProgrammes] = useState<EnrolledProgramme[]>([])
  const [loading, setLoading] = useState(true)
  const [enrollingId, setEnrollingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) loadData()
  }, [user])

  const loadData = async () => {
    setLoading(true)

    const [allRes, enrolledRes] = await Promise.all([
      supabase.from('programmes').select('*').eq('active', true),
      supabase
        .from('programme_enrollments')
        .select('*, programmes(*)')
        .eq('student_id', user?.id),
    ])

    if (allRes.data) setAllProgrammes(allRes.data)
    if (enrolledRes.data) setEnrolledProgrammes(enrolledRes.data as EnrolledProgramme[])
    setLoading(false)
  }

  const enrollProgramme = async (programmeId: string, fee: number) => {
    if (!user) return

    setEnrollingId(programmeId)
    const { error } = await supabase.from('programme_enrollments').insert([
      {
        student_id: user.id,
        programme_id: programmeId,
        amount_due: fee,
        status: 'pending',
      },
    ])

    if (!error) {
      loadData()
    }
    setEnrollingId(null)
  }

  const enrolledIds = enrolledProgrammes.map((e) => e.programme_id)
  const availableProgrammes = allProgrammes.filter((p) => !enrolledIds.includes(p.id))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">My Programmes</h2>
        {enrolledProgrammes.length === 0 ? (
          <p className="text-gray-600">You haven't enrolled in any programmes yet.</p>
        ) : (
          <div className="grid gap-4">
            {enrolledProgrammes.map((enr) => (
              <div
                key={enr.id}
                className="bg-white border border-gray-200 p-6 rounded-brand"
              >
                <h3 className="font-display font-bold text-brand-navy mb-2">
                  {enr.programmes?.name}
                </h3>
                <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-semibold capitalize text-brand-navy">{enr.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount Paid</p>
                    <p className="font-semibold text-brand-gold">₦{enr.amount_paid?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Outstanding</p>
                    <p className="font-semibold text-brand-navy">₦{enr.amount_due?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Deadline</p>
                    <p className="font-semibold">
                      {enr.payment_deadline
                        ? new Date(enr.payment_deadline).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                {enr.locked && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-brand text-sm text-red-700 mb-4">
                    ⚠️ Your access has been restricted due to overdue payment. Please complete your outstanding payment.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">
          Available Programmes
        </h2>
        {loading ? (
          <p className="text-gray-600">Loading programmes...</p>
        ) : availableProgrammes.length === 0 ? (
          <p className="text-gray-600">You're enrolled in all available programmes!</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {availableProgrammes.map((prog) => (
              <div
                key={prog.id}
                className="border border-gray-200 p-6 rounded-brand hover:shadow-lg transition"
              >
                <h3 className="font-display font-bold text-brand-navy mb-2">{prog.name}</h3>
                {prog.description && (
                  <p className="text-gray-600 text-sm mb-3">{prog.description}</p>
                )}
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  {prog.duration_weeks && <span>{prog.duration_weeks} weeks</span>}
                  <span className="text-brand-gold font-semibold">
                    ₦{prog.fee_naira?.toLocaleString()}
                  </span>
                </div>
                <Button
                  onClick={() => enrollProgramme(prog.id, prog.fee_naira || 0)}
                  disabled={enrollingId === prog.id}
                  className="w-full"
                >
                  {enrollingId === prog.id ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
