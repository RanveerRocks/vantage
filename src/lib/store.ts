import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency } from './currency'
import { FACTOR_IDS, type DegreeId, type FactorId } from './schemas'

export const DEFAULT_WEIGHT = 3

export type FactorWeights = Record<FactorId, number>

function defaultWeights(): FactorWeights {
  return Object.fromEntries(FACTOR_IDS.map((id) => [id, DEFAULT_WEIGHT])) as FactorWeights
}

interface VantageState {
  selectedDegreeId: DegreeId | null
  setSelectedDegreeId: (id: DegreeId) => void
  currency: Currency
  setCurrency: (currency: Currency) => void
  weights: FactorWeights
  setWeight: (id: FactorId, value: number) => void
  resetWeights: () => void
}

export const useVantageStore = create<VantageState>()(
  persist(
    (set) => ({
      selectedDegreeId: null,
      setSelectedDegreeId: (id) => set({ selectedDegreeId: id }),
      currency: 'inr',
      setCurrency: (currency) => set({ currency }),
      weights: defaultWeights(),
      setWeight: (id, value) =>
        set((state) => ({
          weights: { ...state.weights, [id]: Math.min(5, Math.max(0, Math.round(value))) },
        })),
      resetWeights: () => set({ weights: defaultWeights() }),
    }),
    { name: 'vantage' },
  ),
)
