import { useState } from 'react'
import { Modal } from '../../../shared/components/ui/Modal'
import Input from '../../../shared/components/ui/Input'
import Select from '../../../shared/components/ui/Select'
import Button from '../../../shared/components/ui/Button'

interface RelatorioModalProps {
  open: boolean
  onClose: () => void
  onGerar: (dataInicio: string, dataFinal: string, tipo: string) => void
}

const TIPO_OPTIONS = [
  { value: '1', label: 'Relatório de Venda' },
  { value: '2', label: 'Por Cliente' },
  { value: '3', label: 'Por Data' },
]

export function RelatorioModal({ open, onClose, onGerar }: RelatorioModalProps) {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const [tipoRelatorio, setTipoRelatorio] = useState('1')

  function handleGerar() {
    if (!dataInicio || !dataFinal) return
    onGerar(dataInicio, dataFinal, tipoRelatorio)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Gerar Relatório">
      <div className="space-y-4">
        <Input label="Data Início" type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
        <Input label="Data Final" type="date" value={dataFinal} onChange={e => setDataFinal(e.target.value)} />
        <Select
          label="Tipo de Relatório"
          options={TIPO_OPTIONS}
          value={tipoRelatorio}
          onChange={e => setTipoRelatorio(e.target.value)}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="button" onClick={handleGerar} disabled={!dataInicio || !dataFinal}>Gerar</Button>
        </div>
      </div>
    </Modal>
  )
}
