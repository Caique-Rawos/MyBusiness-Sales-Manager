import { cn } from '../../lib/utils'

interface Tab {
  value: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (value: string) => void
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-6">
        {tabs.map(tab => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'border-b-2 px-1 py-3 text-sm font-medium transition-colors',
              value === tab.value
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
