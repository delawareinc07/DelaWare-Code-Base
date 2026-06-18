import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Login } from '@/pages/Login'
import { Home } from '@/pages/Home'
import { Programmes } from '@/pages/Programmes'
import { LearningCommunity } from '@/pages/LearningCommunity'
import { StudentProjects } from '@/pages/StudentProjects'
import { ProductsServices } from '@/pages/ProductsServices'
import { Gallery } from '@/pages/Gallery'
import { Testimonials } from '@/pages/Testimonials'
import { Contact } from '@/pages/Contact'
import { StudentPortal } from '@/pages/StudentPortal'
import { TeacherPortal } from '@/pages/TeacherPortal'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'

export function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/programmes" element={<Programmes />} />
      <Route path="/learning-community" element={<LearningCommunity />} />
      <Route path="/student-projects" element={<StudentProjects />} />
      <Route path="/products-services" element={<ProductsServices />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Student Portal */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute roles={['student']}>
            <StudentPortal />
          </ProtectedRoute>
        }
      />

      {/* Teacher Portal */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute roles={['teacher']}>
            <TeacherPortal />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={['admin', 'super_admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
