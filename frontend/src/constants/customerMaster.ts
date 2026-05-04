import type { AccountStatus, AccountType } from '../api/customerAccounts'

export const accountTypeOptions: { label: string; value: AccountType }[] = [
  { label: 'Dealer', value: 'DEALER' },
  { label: 'Showroom', value: 'SHOWROOM' },
  { label: 'Distributor / Company', value: 'COMPANY' },
  { label: 'Partner', value: 'PARTNER' },
  { label: 'Online Customer', value: 'ONLINE_CUSTOMER' },
  { label: 'Individual', value: 'INDIVIDUAL' },
  { label: 'B2B Customer', value: 'B2B_CUSTOMER' },
  { label: 'B2C Customer', value: 'B2C_CUSTOMER' },
]

export const statusOptions: { label: string; value: AccountStatus }[] = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Suspended', value: 'SUSPENDED' },
  { label: 'Archived', value: 'ARCHIVED' },
]

export const brandSystems = ['EVERON', 'ARTEMIS', 'KINGKOIL', 'EDELIN', 'CURTAIN', 'LITE']

export const integrationSystems = ['CRM', 'ERP', 'KIOTVIET', 'E-INVOICE', 'POS', 'DMS', 'LOYALTY']

export const statusColor: Record<AccountStatus, 'success' | 'processing' | 'default' | 'warning'> = {
  ACTIVE: 'success',
  PENDING: 'processing',
  INACTIVE: 'default',
  SUSPENDED: 'warning',
  ARCHIVED: 'default',
}

export const groupOptions = ['A+', 'A', 'B+', 'B', 'Other'].map((value) => ({
  label: value,
  value,
}))

export const regionOptions = ['HN', 'HCM', 'DN', 'CT', 'HP'].map((value) => ({
  label: value,
  value,
}))

export const relationshipTypeOptions = [
  'PARENT_CHILD',
  'HEAD_OFFICE_BRANCH',
  'GROUP_MEMBER',
  'REGION_MEMBER',
  'BILL_TO',
  'SHIP_TO',
  'MANAGED_BY',
].map((value) => ({ label: value, value }))

export const contactRoleOptions = [
  'OWNER',
  'PURCHASING',
  'ACCOUNTING',
  'SALES',
  'WAREHOUSE',
  'OTHER',
].map((value) => ({ label: value, value }))
