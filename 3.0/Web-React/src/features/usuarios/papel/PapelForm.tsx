import { useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { papelSchema, type PapelFormData } from './schemas'
import type { Papel, PermissaoResumo } from './types'
import Input from '../../../shared/components/ui/Input'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'
import { Table, Thead, Tbody, Th, Td } from '../../../shared/components/ui/Table'

interface PapelFormProps {
  editing: Papel | null
  permissoes: PermissaoResumo[]
  onSubmit: (data: PapelFormData) => void
  onNew: () => void
  isPending: boolean
}

const ACOES = [
  { sufixo: 'criar', label: 'Criar' },
  { sufixo: 'listar', label: 'Listar' },
  { sufixo: 'editar', label: 'Editar' },
  { sufixo: 'deletar', label: 'Excluir' },
]

interface MatrizLinha {
  modulo: string
  label: string
  celulas: (PermissaoResumo | undefined)[]
}

function montarMatriz(permissoes: PermissaoResumo[]): MatrizLinha[] {
  const grupos = new Map<string, PermissaoResumo[]>()
  for (const permissao of permissoes) {
    const [modulo] = permissao.chave.split(':')
    if (!grupos.has(modulo)) grupos.set(modulo, [])
    grupos.get(modulo)!.push(permissao)
  }

  return Array.from(grupos.entries()).map(([modulo, itens]) => ({
    modulo,
    label: itens[0]?.descricao.split(' - ')[1] ?? modulo,
    celulas: ACOES.map(acao => itens.find(p => p.chave === `${modulo}:${acao.sufixo}`)),
  }))
}

export function PapelForm({ editing, permissoes, onSubmit, onNew, isPending }: PapelFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PapelFormData>({
    resolver: zodResolver(papelSchema),
    defaultValues: { nome: '', permissaoIds: [] },
  })

  const linhas = useMemo(() => montarMatriz(permissoes), [permissoes])

  useEffect(() => {
    if (editing) {
      reset({ nome: editing.nome, permissaoIds: editing.permissoes.map(p => p.id) })
    } else {
      reset({ nome: '', permissaoIds: [] })
    }
  }, [editing, reset])

  return (
    <Card title={editing ? `Editando papel #${editing.id}` : 'Novo Papel'}>
      <form
        onSubmit={handleSubmit(data => {
          onSubmit(data)
          if (!editing) reset({ nome: '', permissaoIds: [] })
        })}
        className="space-y-4"
      >
        <Input label="Nome do papel" placeholder="Ex: Vendedor" error={errors.nome?.message} {...register('nome')} />

        <Controller
          name="permissaoIds"
          control={control}
          render={({ field }) => {
            const todosIds = permissoes.map(p => p.id)

            function toggle(id: number, marcado: boolean) {
              field.onChange(marcado ? [...field.value, id] : field.value.filter((v: number) => v !== id))
            }

            function toggleLinha(celulas: (PermissaoResumo | undefined)[], marcado: boolean) {
              const ids = celulas.filter((c): c is PermissaoResumo => !!c).map(c => c.id)
              const semDuplicar = field.value.filter((v: number) => !ids.includes(v))
              field.onChange(marcado ? [...semDuplicar, ...ids] : semDuplicar)
            }

            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Permissões</span>
                  <div className="flex gap-3 text-sm">
                    <button type="button" className="text-blue-600 hover:underline" onClick={() => field.onChange(todosIds)}>
                      Marcar tudo
                    </button>
                    <button type="button" className="text-gray-500 hover:underline" onClick={() => field.onChange([])}>
                      Limpar tudo
                    </button>
                  </div>
                </div>

                <Table>
                  <Thead>
                    <tr>
                      <Th>Módulo</Th>
                      {ACOES.map(acao => (
                        <Th key={acao.sufixo} className="text-center">{acao.label}</Th>
                      ))}
                      <Th className="text-center">Tudo</Th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {linhas.map(linha => {
                      const idsLinha = linha.celulas.filter((c): c is PermissaoResumo => !!c).map(c => c.id)
                      const linhaCompleta = idsLinha.length > 0 && idsLinha.every(id => field.value.includes(id))

                      return (
                        <tr key={linha.modulo} className="hover:bg-gray-50">
                          <Td className="font-medium text-gray-900">{linha.label}</Td>
                          {linha.celulas.map((permissao, i) => (
                            <Td key={ACOES[i].sufixo} className="text-center">
                              {permissao && (
                                <input
                                  type="checkbox"
                                  checked={field.value.includes(permissao.id)}
                                  onChange={e => toggle(permissao.id, e.target.checked)}
                                />
                              )}
                            </Td>
                          ))}
                          <Td className="text-center">
                            <input
                              type="checkbox"
                              checked={linhaCompleta}
                              onChange={e => toggleLinha(linha.celulas, e.target.checked)}
                            />
                          </Td>
                        </tr>
                      )
                    })}
                  </Tbody>
                </Table>

                {errors.permissaoIds && <p className="text-sm text-red-600">{errors.permissaoIds.message}</p>}
              </div>
            )
          }}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : editing ? 'Atualizar' : 'Criar papel'}
          </Button>
          {editing && (
            <Button type="button" variant="secondary" onClick={onNew}>
              Novo
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
