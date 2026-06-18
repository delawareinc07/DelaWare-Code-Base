import { Button } from './ui/Button'
import { FormEvent, ReactNode } from 'react'

interface FormProps {
  onSubmit: (e: FormEvent) => void
  children: ReactNode
  title?: string
  submitLabel?: string
  loading?: boolean
}

export function Form({ onSubmit, children, title, submitLabel = 'Submit', loading = false }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {title && <h2 className="font-display text-2xl font-bold text-brand-navy">{title}</h2>}
      {children}
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  )
}

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2.5 border border-gray-300 rounded-brand focus:outline-none focus:border-brand-navy transition ${className}`}
    />
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea({ className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-2.5 border border-gray-300 rounded-brand focus:outline-none focus:border-brand-navy transition ${className}`}
    />
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[]
}

export function Select({ options, className = '', ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`w-full px-4 py-2.5 border border-gray-300 rounded-brand focus:outline-none focus:border-brand-navy transition ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
