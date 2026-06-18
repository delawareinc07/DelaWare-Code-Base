// Pabblyn Metropolitan College database types.
// Generated from migrations 0001-0005.

export type AppRole = 'super_admin' | 'admin' | 'teacher' | 'student'
export type PaymentStatus = 'pending' | 'part_payment' | 'fully_paid' | 'overdue' | 'locked' | 'suspended'
export type Visibility = 'public' | 'students_only' | 'programme_members_only' | 'private' | 'admin_only'
export type ProductCategory = 'food' | 'pastries' | 'desserts' | 'ethnic_treats' | 'event_catering' | 'corporate_catering' | 'services'
export type GalleryCategory = 'classes' | 'trainings' | 'practical_sessions' | 'catering_events' | 'food_displays' | 'cakes' | 'student_projects'
export type TestimonialCategory = 'student' | 'graduate' | 'catering_client' | 'corporate_client'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          whatsapp: string | null
          avatar_url: string | null
          bio: string | null
          occupation: string | null
          created_at: string
        }
        Insert: { id: string; full_name?: string | null; phone?: string | null; whatsapp?: string | null; avatar_url?: string | null; bio?: string | null; occupation?: string | null }
        Update: { full_name?: string | null; phone?: string | null; whatsapp?: string | null; avatar_url?: string | null; bio?: string | null; occupation?: string | null }
        Relationships: []
      }
      user_roles: {
        Row: { id: string; user_id: string; role: AppRole }
        Insert: { user_id: string; role: AppRole }
        Update: { role?: AppRole }
        Relationships: []
      }
      programmes: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          duration_weeks: number | null
          certification: string | null
          fee_naira: number
          image_url: string | null
          category: string | null
          featured: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: { name: string; slug: string; description?: string | null; duration_weeks?: number | null; certification?: string | null; fee_naira?: number; image_url?: string | null; category?: string | null; featured?: boolean; active?: boolean }
        Update: { name?: string; slug?: string; description?: string | null; duration_weeks?: number | null; certification?: string | null; fee_naira?: number; image_url?: string | null; category?: string | null; featured?: boolean; active?: boolean; updated_at?: string }
        Relationships: []
      }
      programme_enrollments: {
        Row: {
          id: string
          student_id: string
          programme_id: string
          status: PaymentStatus
          amount_paid: number
          amount_due: number
          payment_deadline: string | null
          locked: boolean
          completed: boolean
          completed_at: string | null
          enrolled_at: string
          updated_at: string
        }
        Insert: { student_id: string; programme_id: string; status?: PaymentStatus; amount_paid?: number; amount_due?: number; payment_deadline?: string | null; locked?: boolean; completed?: boolean; completed_at?: string | null }
        Update: { status?: PaymentStatus; amount_paid?: number; amount_due?: number; payment_deadline?: string | null; locked?: boolean; completed?: boolean; completed_at?: string | null; updated_at?: string }
        Relationships: [
          { foreignKeyName: 'programme_enrollments_student_id_fkey'; columns: ['student_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'programme_enrollments_programme_id_fkey'; columns: ['programme_id']; isOneToOne: false; referencedRelation: 'programmes'; referencedColumns: ['id'] }
        ]
      }
      programme_payments: {
        Row: {
          id: string
          enrollment_id: string
          amount_naira: number
          status: string
          payment_date: string
          approved_by: string | null
          notes: string | null
          created_at: string
        }
        Insert: { enrollment_id: string; amount_naira: number; status?: string; payment_date?: string; approved_by?: string | null; notes?: string | null }
        Update: { amount_naira?: number; status?: string; payment_date?: string; approved_by?: string | null; notes?: string | null }
        Relationships: [
          { foreignKeyName: 'programme_payments_enrollment_id_fkey'; columns: ['enrollment_id']; isOneToOne: false; referencedRelation: 'programme_enrollments'; referencedColumns: ['id'] }
        ]
      }
      certificates: {
        Row: {
          id: string
          student_id: string
          programme_id: string
          issued_at: string
          certificate_url: string | null
        }
        Insert: { student_id: string; programme_id: string; certificate_url?: string | null }
        Update: { certificate_url?: string | null }
        Relationships: [
          { foreignKeyName: 'certificates_student_id_fkey'; columns: ['student_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'certificates_programme_id_fkey'; columns: ['programme_id']; isOneToOne: false; referencedRelation: 'programmes'; referencedColumns: ['id'] }
        ]
      }
      training_uploads: {
        Row: {
          id: string
          author_id: string
          programme_id: string | null
          title: string
          description: string | null
          category: string | null
          tags: string[] | null
          thumbnail_url: string | null
          visibility: Visibility
          featured: boolean
          is_official: boolean
          views: number
          likes: number
          created_at: string
          updated_at: string
        }
        Insert: { author_id: string; programme_id?: string | null; title: string; description?: string | null; category?: string | null; tags?: string[] | null; thumbnail_url?: string | null; visibility?: Visibility; featured?: boolean; is_official?: boolean }
        Update: { title?: string; description?: string | null; category?: string | null; tags?: string[] | null; thumbnail_url?: string | null; visibility?: Visibility; featured?: boolean; is_official?: boolean; views?: number; likes?: number; updated_at?: string }
        Relationships: [
          { foreignKeyName: 'training_uploads_author_id_fkey'; columns: ['author_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'training_uploads_programme_id_fkey'; columns: ['programme_id']; isOneToOne: false; referencedRelation: 'programmes'; referencedColumns: ['id'] }
        ]
      }
      training_files: {
        Row: {
          id: string
          training_id: string
          file_url: string
          file_type: string
          file_size_mb: number | null
          uploaded_at: string
        }
        Insert: { training_id: string; file_url: string; file_type: string; file_size_mb?: number | null }
        Update: { file_url?: string; file_type?: string; file_size_mb?: number | null }
        Relationships: [
          { foreignKeyName: 'training_files_training_id_fkey'; columns: ['training_id']; isOneToOne: false; referencedRelation: 'training_uploads'; referencedColumns: ['id'] }
        ]
      }
      training_comments: {
        Row: {
          id: string
          training_id: string
          author_id: string
          parent_id: string | null
          content: string
          pinned: boolean
          likes: number
          created_at: string
          updated_at: string
        }
        Insert: { training_id: string; author_id: string; parent_id?: string | null; content: string; pinned?: boolean }
        Update: { content?: string; pinned?: boolean; likes?: number; updated_at?: string }
        Relationships: [
          { foreignKeyName: 'training_comments_training_id_fkey'; columns: ['training_id']; isOneToOne: false; referencedRelation: 'training_uploads'; referencedColumns: ['id'] },
          { foreignKeyName: 'training_comments_author_id_fkey'; columns: ['author_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'training_comments_parent_id_fkey'; columns: ['parent_id']; isOneToOne: false; referencedRelation: 'training_comments'; referencedColumns: ['id'] }
        ]
      }
      student_projects: {
        Row: {
          id: string
          student_id: string
          programme_id: string | null
          title: string
          description: string | null
          image_url: string | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: { student_id: string; programme_id?: string | null; title: string; description?: string | null; image_url?: string | null; featured?: boolean }
        Update: { title?: string; description?: string | null; image_url?: string | null; featured?: boolean; updated_at?: string }
        Relationships: [
          { foreignKeyName: 'student_projects_student_id_fkey'; columns: ['student_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'student_projects_programme_id_fkey'; columns: ['programme_id']; isOneToOne: false; referencedRelation: 'programmes'; referencedColumns: ['id'] }
        ]
      }
      teacher_programmes: {
        Row: {
          id: string
          teacher_id: string
          programme_id: string
        }
        Insert: { teacher_id: string; programme_id: string }
        Update: {}
        Relationships: [
          { foreignKeyName: 'teacher_programmes_teacher_id_fkey'; columns: ['teacher_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'teacher_programmes_programme_id_fkey'; columns: ['programme_id']; isOneToOne: false; referencedRelation: 'programmes'; referencedColumns: ['id'] }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category: ProductCategory
          price_naira: number
          image_url: string | null
          available: boolean
          quantity_unit: string
          created_at: string
          updated_at: string
        }
        Insert: { name: string; description?: string | null; category: ProductCategory; price_naira: number; image_url?: string | null; available?: boolean; quantity_unit?: string }
        Update: { name?: string; description?: string | null; category?: ProductCategory; price_naira?: number; image_url?: string | null; available?: boolean; quantity_unit?: string; updated_at?: string }
        Relationships: []
      }
      delivery_cities: {
        Row: {
          id: string
          city_name: string
          delivery_fee: number
          service_charge: number
          created_at: string
          updated_at: string
        }
        Insert: { city_name: string; delivery_fee?: number; service_charge?: number }
        Update: { city_name?: string; delivery_fee?: number; service_charge?: number; updated_at?: string }
        Relationships: []
      }
      product_orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          delivery_city: string
          delivery_address: string
          notes: string | null
          product_total: number
          delivery_fee: number
          service_charge: number
          grand_total: number
          status: string
          whatsapp_sent: boolean
          created_at: string
          updated_at: string
        }
        Insert: { customer_name: string; customer_phone: string; customer_email?: string | null; delivery_city: string; delivery_address: string; notes?: string | null; product_total?: number; delivery_fee?: number; service_charge?: number; grand_total: number; status?: string }
        Update: { customer_name?: string; customer_phone?: string; customer_email?: string | null; delivery_city?: string; delivery_address?: string; notes?: string | null; product_total?: number; delivery_fee?: number; service_charge?: number; grand_total?: number; status?: string; whatsapp_sent?: boolean; updated_at?: string }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Insert: { order_id: string; product_id: string; quantity: number; unit_price: number; subtotal: number }
        Update: { quantity?: number; unit_price?: number; subtotal?: number }
        Relationships: [
          { foreignKeyName: 'order_items_order_id_fkey'; columns: ['order_id']; isOneToOne: false; referencedRelation: 'product_orders'; referencedColumns: ['id'] },
          { foreignKeyName: 'order_items_product_id_fkey'; columns: ['product_id']; isOneToOne: false; referencedRelation: 'products'; referencedColumns: ['id'] }
        ]
      }
      gallery_items: {
        Row: {
          id: string
          category: GalleryCategory
          title: string | null
          description: string | null
          media_url: string
          media_type: string
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: { category: GalleryCategory; title?: string | null; description?: string | null; media_url: string; media_type: string; featured?: boolean }
        Update: { category?: GalleryCategory; title?: string | null; description?: string | null; media_url?: string; media_type?: string; featured?: boolean; updated_at?: string }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          category: TestimonialCategory
          author_name: string
          author_title: string | null
          quote: string
          image_url: string | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: { category: TestimonialCategory; author_name: string; author_title?: string | null; quote: string; image_url?: string | null; featured?: boolean }
        Update: { category?: TestimonialCategory; author_name?: string; author_title?: string | null; quote?: string; image_url?: string | null; featured?: boolean; updated_at?: string }
        Relationships: []
      }
      admin_settings: {
        Row: {
          id: string
          site_name: string
          tagline: string
          logo_url: string | null
          favicon_url: string | null
          address: string | null
          phone: string | null
          whatsapp: string
          email: string | null
          facebook_url: string | null
          instagram_url: string | null
          twitter_url: string | null
          linkedin_url: string | null
          youtube_url: string | null
          primary_color: string
          secondary_color: string
          accent_color: string
          animations_enabled: boolean
          learning_community_enabled: boolean
          catering_enabled: boolean
          whatsapp_template: string
          updated_at: string
        }
        Insert: {
          site_name?: string
          tagline?: string
          logo_url?: string | null
          favicon_url?: string | null
          address?: string | null
          phone?: string | null
          whatsapp?: string
          email?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          twitter_url?: string | null
          linkedin_url?: string | null
          youtube_url?: string | null
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          animations_enabled?: boolean
          learning_community_enabled?: boolean
          catering_enabled?: boolean
          whatsapp_template?: string
        }
        Update: {
          site_name?: string
          tagline?: string
          logo_url?: string | null
          favicon_url?: string | null
          address?: string | null
          phone?: string | null
          whatsapp?: string
          email?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          twitter_url?: string | null
          linkedin_url?: string | null
          youtube_url?: string | null
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          animations_enabled?: boolean
          learning_community_enabled?: boolean
          catering_enabled?: boolean
          whatsapp_template?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          id: string
          page_slug: string
          section_name: string | null
          content_json: Record<string, any> | null
          updated_at: string
        }
        Insert: { page_slug: string; section_name?: string | null; content_json?: Record<string, any> | null }
        Update: { page_slug?: string; section_name?: string | null; content_json?: Record<string, any> | null; updated_at?: string }
        Relationships: []
      }
      notifications_settings: {
        Row: {
          id: string
          event_type: string
          enabled: boolean
          email_template: string | null
          updated_at: string
        }
        Insert: { event_type: string; enabled?: boolean; email_template?: string | null }
        Update: { enabled?: boolean; email_template?: string | null; updated_at?: string }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      app_role: AppRole
      payment_status: PaymentStatus
      visibility: Visibility
      product_category: ProductCategory
      gallery_category: GalleryCategory
      testimonial_category: TestimonialCategory
    }
    CompositeTypes: { [_ in never]: never }
  }
}
