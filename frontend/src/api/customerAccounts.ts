export type AccountKind = 'ORGANIZATION' | 'PERSON'
export type CustomerSegment = 'B2B' | 'B2C'
export type AccountType =
  | 'DEALER'
  | 'SHOWROOM'
  | 'B2B_CUSTOMER'
  | 'B2C_CUSTOMER'
  | 'ONLINE_CUSTOMER'
  | 'PARTNER'
  | 'INDIVIDUAL'
  | 'COMPANY'
export type AccountStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ARCHIVED'
export type RecordStatus = 'ACTIVE' | 'INACTIVE'
export type AddressType =
  | 'BILLING'
  | 'SHIPPING'
  | 'BUSINESS_LOCATION'
  | 'REGISTERED_OFFICE'
  | 'WAREHOUSE'
  | 'SHOWROOM'
  | 'BRANCH'
  | 'OTHER'
export type ContactRole =
  | 'OWNER'
  | 'PURCHASING'
  | 'ACCOUNTING'
  | 'TECHNICAL'
  | 'SALES'
  | 'WAREHOUSE'
  | 'OTHER'
export type ClassificationType =
  | 'CUSTOMER_TYPE'
  | 'CHANNEL'
  | 'SEGMENT'
  | 'STATUS_TAG'
  | 'PARTNER_TYPE'
export type AccountRelationshipType =
  | 'PARENT_CHILD'
  | 'HEAD_OFFICE_BRANCH'
  | 'GROUP_MEMBER'
  | 'REGION_MEMBER'
  | 'BILL_TO'
  | 'SHIP_TO'
  | 'MANAGED_BY'

export interface CustomerContactDto {
  id?: string
  accountId?: string
  contactCode?: string
  firstName?: string
  lastName?: string
  fullName: string
  jobTitle?: string
  department?: string
  email?: string
  phone?: string
  mobile?: string
  zalo?: string
  contactRole?: ContactRole
  isPrimary: boolean
  isDecisionMaker?: boolean
  status: RecordStatus
  createdAt?: string
  updatedAt?: string
}

export interface CustomerAddressDto {
  id?: string
  accountId?: string
  addressType: AddressType
  addressName?: string
  line1: string
  line2?: string
  ward?: string
  district?: string
  province?: string
  country: string
  postalCode?: string
  countryCode?: string
  stateCode?: string
  latitude?: number
  longitude?: number
  recipientName?: string
  recipientPhone?: string
  isDefault: boolean
  status: RecordStatus
  effectiveFrom?: string
  effectiveTo?: string
}

export interface CustomerExternalReferenceDto {
  id?: string
  accountId?: string
  sourceSystem: string
  externalId: string
  externalCode?: string
  isPrimary: boolean
  status: RecordStatus
  lastSyncedAt?: string
}

export interface CustomerClassificationDto {
  id?: string
  accountId?: string
  classificationType: ClassificationType
  classificationCode: string
  classificationName?: string
  isPrimary?: boolean
  effectiveFrom?: string
  effectiveTo?: string
}

export interface AccountRelationshipDto {
  id?: string
  fromAccountId?: string
  fromCustomerCode?: string
  toAccountId?: string
  toCustomerCode?: string
  relationshipType: AccountRelationshipType
  direction?: 'CHILD_TO_PARENT' | 'PARENT_TO_CHILD'
  isPrimary?: boolean
  status: RecordStatus
  effectiveFrom?: string
  effectiveTo?: string
}

export interface BusinessAccountProfileDto {
  id?: string
  accountId?: string
  legalName?: string
  taxCode?: string
  businessRegistrationNo?: string
  industry?: string
  annualRevenue?: number
  numberOfEmployees?: number
  ownershipType?: string
  paymentTerm?: string
  creditLimit?: number
  dealerTier?: string
  dealerType?: string
  regionCode?: string
  territoryCode?: string
  createdAt?: string
  updatedAt?: string
}

export interface PersonAccountProfileDto {
  id?: string
  accountId?: string
  firstName: string
  lastName: string
  middleName?: string
  salutation?: string
  birthDate?: string
  gender?: string
  personalEmail?: string
  personalMobile?: string
  personalIdNumber?: string
  loyaltyId?: string
  consentStatus?: string
  preferredChannel?: string
  createdAt?: string
  updatedAt?: string
}

export interface CustomerAccountDto {
  id: string
  accountNumber: string
  customerCode: string
  accountName: string
  accountKind: AccountKind
  customerSegment: CustomerSegment
  accountType: AccountType
  status: AccountStatus
  parentAccountId?: string
  parentCustomerCode?: string
  taxCode?: string
  businessRegistrationNo?: string
  phone?: string
  email?: string
  website?: string
  industry?: string
  regionCode?: string
  territoryCode?: string
  ownerUserId?: string
  defaultBillingAddressId?: string
  defaultShippingAddressId?: string
  defaultBusinessLocationAddressId?: string
  businessProfile?: BusinessAccountProfileDto
  personProfile?: PersonAccountProfileDto
  contacts: CustomerContactDto[]
  addresses: CustomerAddressDto[]
  externalReferences: CustomerExternalReferenceDto[]
  classifications: CustomerClassificationDto[]
  relationships: AccountRelationshipDto[]
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

export interface AccountHierarchyNodeDto {
  accountId: string
  accountNumber?: string
  customerCode: string
  accountName: string
  accountType: AccountType
  customerSegment: CustomerSegment
  status: AccountStatus
  relationshipType?: AccountRelationshipType
  level: number
  path?: string
  children: AccountHierarchyNodeDto[]
}

export interface ListCustomerAccountsQuery {
  search?: string
  customerCode?: string
  accountType?: AccountType
  customerSegment?: CustomerSegment
  status?: AccountStatus
}

export type CreateCustomerAccountRequest = Omit<
  Partial<CustomerAccountDto>,
  'id' | 'createdAt' | 'updatedAt'
> &
  Pick<
    CustomerAccountDto,
    'customerCode' | 'accountName' | 'accountKind' | 'customerSegment' | 'accountType'
  >

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `API request failed with ${response.status}`)
  }

  return response.json() as Promise<T>
}

function toSearchParams(query: ListCustomerAccountsQuery) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    }
  })
  return params.toString()
}

export const customerAccountsApi = {
  list(query: ListCustomerAccountsQuery) {
    const search = toSearchParams(query)
    return request<CustomerAccountDto[]>(`/customer-accounts${search ? `?${search}` : ''}`)
  },
  create(body: CreateCustomerAccountRequest) {
    return request<CustomerAccountDto>('/customer-accounts', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },
  update(id: string, body: Partial<CreateCustomerAccountRequest>) {
    return request<CustomerAccountDto>(`/customer-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },
  updateStatus(id: string, status: AccountStatus) {
    return request<CustomerAccountDto>(`/customer-accounts/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
  findByCode(customerCode: string) {
    return request<CustomerAccountDto>(`/customer-accounts/by-code/${customerCode}`)
  },
  hierarchy(id: string) {
    return request<AccountHierarchyNodeDto>(`/customer-accounts/${id}/hierarchy`)
  },
}
