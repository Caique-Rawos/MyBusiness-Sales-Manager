import { TriangleAlert } from 'lucide-react'
import { Modal } from './Modal'
import Button from './Button'

interface ConfirmModalProps {
  open: boolean
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title = 'Confirmar exclusão',
  description = 'Esta ação não pode ser desfeita.',
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel} className="max-w-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <TriangleAlert size={24} className="text-red-600" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex w-full gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Excluindo...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
