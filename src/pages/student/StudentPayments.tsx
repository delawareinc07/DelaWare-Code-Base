import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import type { Database } from '@/types/database'

type Enrollment = Database['public']['Tables']['programme_enrollments']['Row']
type Payment = Database['public']['Tables']['programme_payments']['Row']
type Programme = Database['public']['Tables']['programmes']['Row']

interface EnrollmentWithDetails extends Enrollment {
  programmes: Programme | null
}

interface PaymentWithEnrollment extends Payment {
  programme_enrollments: EnrollmentWithDetails | null
}

export function StudentPayments() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([])
  const [payments, setPayments] = useState<PaymentWithEnrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return
    setLoading(true)

    const [enrollRes, payRes] = await Promise.all([
      supabase
        .from('programme_enrollments')
        .select('*, programmes(*)')
        .eq('student_id', user.id),
      supabase
        .from('programme_payments')
        .select('*, programme_enrollments(*, programmes(*))')
        .in(
          'enrollment_id',
          (
            await supabase
              .from('programme_enrollments')
              .select('id')
              .eq('student_id', user.id)
          ).data?.map((e) => e.id) || []
        )
        .order('created_at', { ascending: false }),
    ])

    if (enrollRes.data) setEnrollments(enrollRes.data as EnrollmentWithDetails[])
    if (payRes.data) setPayments(payRes.data as PaymentWithEnrollment[])
    setLoading(false)
  }

  const getTotalPaid = () => {
    return payments.reduce((sum, p) => sum + (p.amount_naira || 0), 0)
  }

  const getTotalDue = () => {
    return enrollments.reduce((sum, e) => sum + (e.amount_due || 0), 0)
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 p-6 rounded-brand">
          <p className="text-gray-600 text-sm">Total Paid</p>
          <p className="font-display text-3xl font-bold text-brand-gold mt-2">
            ₦{getTotalPaid().toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-brand">
          <p className="text-gray-600 text-sm">Total Outstanding</p>
          <p className="font-display text-3xl font-bold text-red-600 mt-2">
            ₦{getTotalDue().toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-brand">
          <p className="text-gray-600 text-sm">Programmes</p>
          <p className="font-display text-3xl font-bold text-brand-navy mt-2">
            {enrollments.length}
          </p>
        </div>
      </div>

      {/* Payment Status by Programme */}
      {loading ? (
        <p className="text-gray-600">Loading payment information...</p>
      ) : enrollments.length === 0 ? (
        <p className="text-gray-600">No enrollments yet.</p>
      ) : (
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">
            Payment Status by Programme
          </h2>
          <div className="grid gap-4">
            {enrollments.map((enr) => (
              <div
                key={enr.id}
                className="bg-white border border-gray-200 p-6 rounded-brand"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display font-bold text-brand-navy">
                      {enr.programmes?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Enrolled: {new Date(enr.enrolled_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-semibold capitalize ${
                      enr.status === 'fully_paid'
                        ? 'bg-green-100 text-green-700'
                        : enr.status === 'overdue' || enr.status === 'locked'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {enr.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Programme Fee</p>
                    <p className="font-bold text-brand-navy">
                      ₦{(enr.amount_paid || 0 + enr.amount_due || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Paid</p>
                    <p className="font-bold text-green-600">
                      ₦{(enr.amount_paid || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Outstanding</p>
                    <p className="font-bold text-red-600">
                      ₦{(enr.amount_due || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Deadline</p>
                    <p className="font-bold">
                      {enr.payment_deadline
                        ? new Date(enr.payment_deadline).toLocaleDateString()
                        : 'Not set'}
                    </p>
                  </div>
                </div>

                {enr.locked && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded text-red-700 text-sm">
                    ⚠️ Access temporarily restricted due to overdue payment
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Payment Progress</span>
                    <span className="font-semibold">
                      {Math.round(
                        ((enr.amount_paid || 0) / ((enr.amount_paid || 0) + (enr.amount_due || 0))) * 100
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-brand-gold h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.round(
                          ((enr.amount_paid || 0) / ((enr.amount_paid || 0) + (enr.amount_due || 0))) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">
            Payment History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Programme
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((pay) => (
                  <tr key={pay.id}>
                    <td className="px-6 py-4 text-sm">
                      {new Date(pay.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-brand-navy">
                      {pay.programme_enrollments?.programmes?.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-brand-gold">
                      ₦{(pay.amount_naira || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          pay.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : pay.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
