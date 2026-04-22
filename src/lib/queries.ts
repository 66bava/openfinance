import { supabase } from './supabase'
import type { Transacao } from './types'

// Busca transações do mês atual
export async function getTransacoesMes(userId: string) {
  const inicio = new Date()
  inicio.setDate(1)

  const { data, error } = await supabase
    .from('transacoes')
    .select('*, categorias(*)')
    .eq('user_id', userId)
    .gte('data', inicio.toISOString().split('T')[0])
    .order('data', { ascending: false })

  if (error) {
    console.error('Erro ao buscar transações:', error)
    return []
  }

  return data || []
}

// Calcula totais para os cards do dashboard
export async function getTotaisMes(userId: string) {
  const transacoes = await getTransacoesMes(userId)

  const totalGastos = transacoes
    .filter((t: any) => t.tipo === 'despesa')
    .reduce((acc, t: any) => acc + t.valor, 0)

  const totalRenda = transacoes
    .filter((t: any) => t.tipo === 'receita')
    .reduce((acc, t: any) => acc + t.valor, 0)

  return {
    totalGastos,
    totalRenda,
    saldoDisponivel: totalRenda - totalGastos,
    percentualEconomia: totalRenda > 0
      ? ((totalRenda - totalGastos) / totalRenda) * 100
      : 0
  }
}

// Busca gastos agrupados por categoria
export async function getGastosPorCategoria(userId: string) {
  const transacoes = await getTransacoesMes(userId)

  const despesas = transacoes.filter((t: any) => t.tipo === 'despesa')
  const total = despesas.reduce((acc, t: any) => acc + t.valor, 0)

  if (total === 0) return []

  const agrupado = despesas.reduce((acc, t: any) => {
    const nome = t.categorias?.nome || 'Outros'
    acc[nome] = (acc[nome] || 0) + t.valor
    return acc
  }, {} as Record<string, number>)

  return Object.entries(agrupado).map(([nome, valor]) => ({
    name: nome,
    value: valor,
    percent: ((valor / total) * 100).toFixed(1)
  }))
}

// Adiciona nova transação
export async function addTransacao(
  userId: string,
  transacao: Omit<Transacao, 'id' | 'user_id'>
) {
  const { data, error } = await supabase
    .from('transacoes')
    .insert({ ...transacao, user_id: userId })
    .select()
    .single()

  if (error) {
    console.error('Erro ao adicionar transação:', error)
    throw error
  }

  return data
}
