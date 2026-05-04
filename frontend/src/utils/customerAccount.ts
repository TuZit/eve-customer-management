import type { CustomerAccountDto } from '../api/customerAccounts'
import { brandSystems } from '../constants/customerMaster'
import type { DealerFilters } from '../store/dealerUiStore'

export const formatDate = (value?: string) =>
  value ? new Intl.DateTimeFormat('vi-VN').format(new Date(value)) : '-'

export const money = (value?: number) =>
  value
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    : '-'

export const getPrimaryContact = (account: CustomerAccountDto) =>
  account.contacts.find((contact) => contact.isPrimary) ?? account.contacts[0]

export const getGroupCode = (account: CustomerAccountDto) =>
  account.businessProfile?.dealerTier ??
  account.classifications.find((item) => item.classificationType === 'CUSTOMER_TYPE')?.classificationCode ??
  'Other'

export const getBrandReferences = (account: CustomerAccountDto) =>
  account.externalReferences.filter((reference) => brandSystems.includes(reference.sourceSystem))

export const hasMissingRequired = (account: CustomerAccountDto) =>
  !account.accountName ||
  !account.customerCode ||
  (account.customerSegment === 'B2B' && !getPrimaryContact(account)) ||
  (account.accountKind === 'ORGANIZATION' && !account.parentCustomerCode)

export const findDuplicateCodes = (accounts: CustomerAccountDto[]) => {
  const counts = new Map<string, number>()

  accounts.forEach((account) => {
    counts.set(account.customerCode, (counts.get(account.customerCode) ?? 0) + 1)
    getBrandReferences(account).forEach((reference) => {
      counts.set(reference.externalId, (counts.get(reference.externalId) ?? 0) + 1)
    })
  })

  return [...counts.values()].filter((count) => count > 1).length
}

export const applyClientFilters = (accounts: CustomerAccountDto[], filters: DealerFilters) =>
  accounts.filter((account) => {
    if (filters.accountKind && account.accountKind !== filters.accountKind) return false
    if (filters.brand && !getBrandReferences(account).some((ref) => ref.sourceSystem === filters.brand)) return false
    if (filters.group && getGroupCode(account) !== filters.group) return false
    if (filters.region && account.regionCode !== filters.region) return false
    if (filters.parentMapping === 'Has Parent' && !account.parentCustomerCode) return false
    if (filters.parentMapping === 'Missing Parent' && account.parentCustomerCode) return false
    if (filters.externalMapping === 'Has External ID' && account.externalReferences.length === 0) return false
    if (filters.externalMapping === 'Missing External ID' && account.externalReferences.length > 0) return false
    if (filters.missingRequired && !hasMissingRequired(account)) return false
    return true
  })
