import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Package, ShoppingCart,
  TrendingDown, TrendingUp, CreditCard, CheckSquare,
  FileText, Store, ShoppingBag, ChevronDown, ChevronRight,
  Boxes, Wallet, Tag, WarehouseIcon, LogOut,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'

const topNav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/clientes', icon: Users, label: 'Clientes', permission: 'cliente:listar' },
]

const produtosNav = [
  { to: '/produtos', icon: Package, label: 'Produtos', permission: 'produto:listar' },
  { to: '/categorias', icon: Tag, label: 'Categorias', permission: 'categoria:listar' },
  { to: '/estoque', icon: WarehouseIcon, label: 'Estoque', permission: 'estoque:listar' },
  { to: '/regras-fiscais', icon: FileText, label: 'Regras Fiscais', permission: 'regra-fiscal:listar' },
]

const financeiroNav = [
  { to: '/contas-pagar', icon: TrendingDown, label: 'Contas a Pagar', permission: 'contas-pagar:listar' },
  { to: '/contas-receber', icon: TrendingUp, label: 'Contas a Receber', permission: 'contas-receber:listar' },
  { to: '/pagamentos', icon: CreditCard, label: 'Formas de Pagamento', permission: 'pagamento:listar' },
  { to: '/status-pagamento', icon: CheckSquare, label: 'Status de Pagamento', permission: 'status-pagamento:listar' },
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

  if (items.length === 0) return null

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
  const { user, hasPermission, logout } = useAuth()
  const navigate = useNavigate()

  const visibleTopNav = topNav.filter(item => !item.permission || hasPermission(item.permission))
  const visibleProdutosNav = produtosNav.filter(item => hasPermission(item.permission))
  const visibleFinanceiroNav = financeiroNav.filter(item => hasPermission(item.permission))
  const showVendas = hasPermission('venda:listar')
  const showLoja = hasPermission('loja:listar')

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

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
          {visibleTopNav.map(item => <NavItem key={item.to} {...item} />)}
          <NavGroup label="Produtos" icon={Boxes} items={visibleProdutosNav} />
          {showVendas && <NavItem to="/vendas" icon={ShoppingCart} label="Vendas" />}
          <NavGroup label="Financeiro" icon={Wallet} items={visibleFinanceiroNav} />
        </div>

        <div className="space-y-1 border-t border-gray-800 pt-3 mt-3">
          {showLoja && <NavItem to="/loja" icon={Store} label="Loja" />}
          <div className="px-3 py-1 text-xs text-gray-500 truncate" title={user?.email}>
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </nav>
    </aside>
  )
}
