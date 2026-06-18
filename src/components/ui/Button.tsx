import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'inline-flex items-center justify-center rounded-brand px-5 py-2.5 ' +
  'font-medium transition-colors focus-visible:outline-none ' +
  'focus-visible:ring-2 disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-navy text-white hover:bg-[#001a2e] focus-visible:ring-brand-navy',
  secondary: 'bg-brand-gold text-brand-navy hover:bg-[#e6c200] focus-visible:ring-brand-gold',
  ghost: 'bg-transparent text-brand-navy hover:bg-black/5 focus-visible:ring-brand-navy',
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
