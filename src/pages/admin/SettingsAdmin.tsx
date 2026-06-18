import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Form, FormField, Input, TextArea } from '@/components/Forms'
import type { Database } from '@/types/database'

type AdminSettings = Database['public']['Tables']['admin_settings']['Row']

export function SettingsAdmin() {
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    const { data } = await supabase.from('admin_settings').select('*').limit(1).single()
    if (data) setSettings(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    setSaving(true)
    const { id, updated_at, ...updatePayload } = settings
    await supabase.from('admin_settings').update(updatePayload).eq('id', id)
    setSaving(false)
  }

  const updateField = (field: keyof AdminSettings, value: any) => {
    if (!settings) return
    setSettings({ ...settings, [field]: value })
  }

  if (loading || !settings) return <p className="text-gray-600">Loading settings...</p>

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-brand-navy">Site Settings</h1>

      <Form onSubmit={handleSubmit} loading={saving} submitLabel="Save Settings">
        <div className="space-y-8">
          {/* Branding Section */}
          <div>
            <h2 className="font-display text-xl font-bold text-brand-navy mb-4">Branding</h2>
            <div className="space-y-4">
              <FormField label="Site Name">
                <Input
                  value={settings.site_name}
                  onChange={(e) => updateField('site_name', e.target.value)}
                />
              </FormField>

              <FormField label="Tagline">
                <Input
                  value={settings.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                />
              </FormField>

              <div className="grid grid-cols-3 gap-4">
                <FormField label="Primary Color">
                  <Input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => updateField('primary_color', e.target.value)}
                  />
                </FormField>
                <FormField label="Secondary Color">
                  <Input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => updateField('secondary_color', e.target.value)}
                  />
                </FormField>
                <FormField label="Accent Color">
                  <Input
                    type="color"
                    value={settings.accent_color}
                    onChange={(e) => updateField('accent_color', e.target.value)}
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="font-display text-xl font-bold text-brand-navy mb-4">Contact Information</h2>
            <div className="space-y-4">
              <FormField label="Address">
                <TextArea
                  value={settings.address || ''}
                  onChange={(e) => updateField('address', e.target.value)}
                  rows={2}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Phone">
                  <Input
                    value={settings.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </FormField>
                <FormField label="WhatsApp">
                  <Input
                    value={settings.whatsapp}
                    onChange={(e) => updateField('whatsapp', e.target.value)}
                  />
                </FormField>
              </div>

              <FormField label="Email">
                <Input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="font-display text-xl font-bold text-brand-navy mb-4">Social Media</h2>
            <div className="space-y-4">
              <FormField label="Facebook URL">
                <Input
                  value={settings.facebook_url || ''}
                  onChange={(e) => updateField('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/pabblyn"
                />
              </FormField>

              <FormField label="Instagram URL">
                <Input
                  value={settings.instagram_url || ''}
                  onChange={(e) => updateField('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/pabblyn"
                />
              </FormField>

              <FormField label="Twitter URL">
                <Input
                  value={settings.twitter_url || ''}
                  onChange={(e) => updateField('twitter_url', e.target.value)}
                  placeholder="https://twitter.com/pabblyn"
                />
              </FormField>

              <FormField label="LinkedIn URL">
                <Input
                  value={settings.linkedin_url || ''}
                  onChange={(e) => updateField('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/company/pabblyn"
                />
              </FormField>

              <FormField label="YouTube URL">
                <Input
                  value={settings.youtube_url || ''}
                  onChange={(e) => updateField('youtube_url', e.target.value)}
                  placeholder="https://youtube.com/@pabblyn"
                />
              </FormField>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h2 className="font-display text-xl font-bold text-brand-navy mb-4">Features</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.animations_enabled}
                  onChange={(e) => updateField('animations_enabled', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Enable animations</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.learning_community_enabled}
                  onChange={(e) => updateField('learning_community_enabled', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Enable learning community</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.catering_enabled}
                  onChange={(e) => updateField('catering_enabled', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Enable catering/orders</span>
              </label>
            </div>
          </div>

          {/* WhatsApp Section */}
          <div>
            <h2 className="font-display text-xl font-bold text-brand-navy mb-4">WhatsApp Integration</h2>
            <div className="space-y-4">
              <FormField label="WhatsApp Order Template">
                <TextArea
                  value={settings.whatsapp_template}
                  onChange={(e) => updateField('whatsapp_template', e.target.value)}
                  rows={4}
                />
              </FormField>
              <p className="text-xs text-gray-600">
                Use variables: {'{customer_name}'}, {'{customer_phone}'}, {'{products}'}, {'{delivery_address}'}, {'{grand_total}'}
              </p>
            </div>
          </div>
        </div>
      </Form>
    </div>
  )
}
