import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { customerAccountsApi } from '../api/customerAccounts'
import { useDealerUiStore } from '../store/dealerUiStore'

export function useCustomerAccounts() {
  const filters = useDealerUiStore((state) => state.filters)
  const serverQuery = useMemo(
    () => ({
      search: filters.search,
      accountType: filters.accountType,
      customerSegment: filters.customerSegment,
      status: filters.status,
    }),
    [filters.accountType, filters.customerSegment, filters.search, filters.status],
  )

  return useQuery({
    queryKey: ['customer-accounts', serverQuery],
    queryFn: () => customerAccountsApi.list(serverQuery),
  })
}
