import { create } from 'zustand'
import {
  combine,
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware'
import type {
  AccountKind,
  AccountStatus,
  AccountType,
  CustomerSegment,
} from '../api/customerAccounts'

export type MainView = 'master' | 'import' | 'integration'
export type CodeMatchingMode = 'Exact' | 'Contains' | 'Starts with'
export type ParentMappingFilter = 'Any' | 'Has Parent' | 'Missing Parent'
export type ExternalMappingFilter = 'Any' | 'Has External ID' | 'Missing External ID'

export interface DealerFilters {
  search?: string
  codeMatchingMode: CodeMatchingMode
  accountType?: AccountType
  accountKind?: AccountKind
  customerSegment?: CustomerSegment
  status?: AccountStatus
  brand?: string
  group?: string
  region?: string
  parentMapping: ParentMappingFilter
  externalMapping: ExternalMappingFilter
  duplicateDetection: boolean
  missingRequired: boolean
}

export interface DealerUiState {
  activeView: MainView
  selectedAccountId?: string
  filterDrawerOpen: boolean
  createDrawerOpen: boolean
  duplicateModalOpen: boolean
  filters: DealerFilters
}

interface DealerUiActions {
  setActiveView: (activeView: MainView) => void
  selectAccount: (selectedAccountId?: string) => void
  setFilterDrawerOpen: (filterDrawerOpen: boolean) => void
  setCreateDrawerOpen: (createDrawerOpen: boolean) => void
  setDuplicateModalOpen: (duplicateModalOpen: boolean) => void
  setFilters: (filters: Partial<DealerFilters>) => void
  resetFilters: () => void
}

export type DealerUiStore = DealerUiState & DealerUiActions

export const defaultFilters: DealerFilters = {
  codeMatchingMode: 'Contains',
  parentMapping: 'Any',
  externalMapping: 'Any',
  duplicateDetection: false,
  missingRequired: false,
}

const initialState: DealerUiState = {
  activeView: 'master',
  filterDrawerOpen: false,
  createDrawerOpen: false,
  duplicateModalOpen: false,
  filters: defaultFilters,
}

export const useDealerUiStore = create<DealerUiStore>()(
  subscribeWithSelector(
    devtools(
      persist(
        combine(initialState, (set) => ({
          setActiveView: (activeView: MainView) => set({ activeView }),
          selectAccount: (selectedAccountId?: string) => set({ selectedAccountId }),
          setFilterDrawerOpen: (filterDrawerOpen: boolean) => set({ filterDrawerOpen }),
          setCreateDrawerOpen: (createDrawerOpen: boolean) => set({ createDrawerOpen }),
          setDuplicateModalOpen: (duplicateModalOpen: boolean) => set({ duplicateModalOpen }),
          setFilters: (filters: Partial<DealerFilters>) =>
            set((state) => ({ filters: { ...state.filters, ...filters } })),
          resetFilters: () => set({ filters: defaultFilters }),
        })),
        {
          name: 'everon-dealer-ui-store',
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            activeView: state.activeView,
            filters: state.filters,
          }),
        },
      ),
      {
        enabled: import.meta.env.DEV,
        name: 'Dealer UI Store',
      },
    ),
  ),
)
