import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps {
  children: ReactNode
  color?: string
  className?: string
}

export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', !color && 'bg-gray-100 text-gray-700', className)}
      style={color ? { color, backgroundColor: `${color}22` } : undefined}
    >
      {children}
    </span>
  )
}
