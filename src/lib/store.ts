import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DegreeId } from './schemas'

interface VantageState {
  selectedDegreeId: DegreeId | null
  setSelectedDegreeId: (id: DegreeId) => void
}

export const useVantageStore = create<VantageState>()(
  persist(
    (set) => ({
      selectedDegreeId: null,
      setSelectedDegreeId: (id) => set({ selectedDegreeId: id }),
    }),
    { name: 'vantage' },
  ),
)
