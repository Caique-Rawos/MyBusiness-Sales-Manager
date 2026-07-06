import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Package, ShoppingCart,
  TrendingDown, TrendingUp, CreditCard, CheckSquare,
  FileText, Store, ShoppingBag, ChevronDown, ChevronRight,
  Boxes, Wallet, Tag, WarehouseIcon,
} from 'lucide-react'
import { cn } from '../../lib/utils'

const topNav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/clientes', icon: Users, label: 'Clientes' },
]

const produtosNav = [
  { to: '/produtos', icon: Package, label: 'Produtos' },
  { to: '/categorias', icon: Tag, label: 'Categorias' },
  { to: '/estoque', icon: WarehouseIcon, label: 'Estoque' },
  { to: '/regras-fiscais', icon: FileText, label: 'Regras Fiscais' },
]

const financeiroNav = [
  { to: '/contas-pagar', icon: TrendingDown, label: 'Contas a Pagar' },
  { to: '/contas-receber', icon: TrendingUp, label: 'Contas a Receber' },
  { to: '/pagamentos', icon: CreditCard, label: 'Formas de Pagamento' },
  { to: '/status-pagamento', icon: CheckSquare, label: 'Status de Pagamento' },
]

function NavItem({ to, icon: Icon, label, exact }: { to: string; icon: React.ElementType; label: string; exact?: boolean }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
        )
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  )
}

interface NavGroupProps {
  label: string
  icon: React.ElementType
  items: typeof produtosNav
  defaultOpen?: boolean
}

function NavGroup({ label, icon: Icon, items, defaultOpen = false }: NavGroupProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
      >
        <span className="flex items-center gap-3">
          <Icon size={18} />
          {label}
        </span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open && (
        <div className="mt-1 space-y-1 pl-4">
          {items.map(item => <NavItem key={item.to} {...item} />)}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-gray-900">
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <ShoppingBag size={16} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-white leading-tight">
          MyBusiness<br />
          <span className="text-xs font-normal text-gray-400">Sales Manager</span>
        </span>
      </div>

      <nav className="flex flex-col flex-1 overflow-y-auto p-3">
        <div className="space-y-1 flex-1">
          {topNav.map(item => <NavItem key={item.to} {...item} />)}
          <NavGroup label="Produtos" icon={Boxes} items={produtosNav} />
          <NavItem to="/vendas" icon={ShoppingCart} label="Vendas" />
          <NavGroup label="Financeiro" icon={Wallet} items={financeiroNav} />
        </div>

        <div className="pt-3 border-t border-gray-800 mt-3">
          <NavItem to="/loja" icon={Store} label="Loja" />
        </div>
      </nav>
    </aside>
  )
}
