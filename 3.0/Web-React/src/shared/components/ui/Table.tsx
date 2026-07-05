import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
      <table className={cn('min-w-full text-sm text-left text-gray-700', className)} {...props} />
    </div>
  )
}

export function Thead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn('bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200', className)}
      {...props}
    />
  )
}

export function Tbody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-gray-100 bg-white', className)} {...props} />
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('px-4 py-3 font-medium', className)} {...props} />
}

export function Td({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-3', className)} {...props} />
}

export function EmptyRow({ cols, message = 'Nenhum registro encontrado.' }: { cols: number; message?: string }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-8 text-center text-gray-400">
        {message}
      </td>
    </tr>
  )
}
