import type {
  AccountRelationshipType,
  ContactRole,
  CreateCustomerAccountRequest,
  CustomerExternalReferenceDto,
} from '../../../api/customerAccounts'
import { brandSystems } from '../../../constants/customerMaster'

export type CustomerFormValues = Record<string, string | number | undefined>

export function toCreateCustomerAccountRequest(values: CustomerFormValues) {
  const references = buildExternalReferences(values)

  return {
    customerCode: String(values.customerCode),
    accountNumber: values.accountNumber ? String(values.accountNumber) : undefined,
    accountName: String(values.accountName),
    accountKind: values.accountKind as CreateCustomerAccountRequest['accountKind'],
    customerSegment: values.customerSegment as CreateCustomerAccountRequest['customerSegment'],
    accountType: values.accountType as CreateCustomerAccountRequest['accountType'],
    status: values.status as CreateCustomerAccountRequest['status'],
    parentCustomerCode: values.parentCustomerCode ? String(values.parentCustomerCode) : undefined,
    phone: values.mobile ? String(values.mobile) : undefined,
    email: values.email ? String(values.email) : undefined,
    regionCode: values.regionCode ? String(values.regionCode) : undefined,
    territoryCode: values.territoryCode ? String(values.territoryCode) : undefined,
    taxCode: values.taxCode ? String(values.taxCode) : undefined,
    businessRegistrationNo: values.businessRegistrationNo ? String(values.businessRegistrationNo) : undefined,
    businessProfile:
      values.accountKind === 'ORGANIZATION'
        ? {
            legalName: values.legalName ? String(values.legalName) : undefined,
            taxCode: values.taxCode ? String(values.taxCode) : undefined,
            businessRegistrationNo: values.businessRegistrationNo
              ? String(values.businessRegistrationNo)
              : undefined,
            industry: values.industry ? String(values.industry) : undefined,
            dealerTier: values.groupCode ? String(values.groupCode) : undefined,
            dealerType: values.dealerType ? String(values.dealerType) : undefined,
            regionCode: values.regionCode ? String(values.regionCode) : undefined,
            territoryCode: values.territoryCode ? String(values.territoryCode) : undefined,
            creditLimit: values.creditLimit ? Number(values.creditLimit) : undefined,
            paymentTerm: values.paymentTerm ? String(values.paymentTerm) : undefined,
          }
        : undefined,
    personProfile:
      values.accountKind === 'PERSON'
        ? {
            firstName: String(values.firstName),
            lastName: String(values.lastName),
            personalMobile: values.mobile ? String(values.mobile) : undefined,
            personalEmail: values.email ? String(values.email) : undefined,
            birthDate: values.birthDate ? String(values.birthDate) : undefined,
            gender: values.gender ? String(values.gender) : undefined,
            loyaltyId: values.loyaltyId ? String(values.loyaltyId) : undefined,
            preferredChannel: values.preferredChannel ? String(values.preferredChannel) : undefined,
          }
        : undefined,
    contacts: values.contactFullName
      ? [
          {
            fullName: String(values.contactFullName),
            email: values.contactEmail ? String(values.contactEmail) : undefined,
            mobile: values.contactMobile ? String(values.contactMobile) : undefined,
            contactRole: values.contactRole as ContactRole | undefined,
            isPrimary: true,
            status: 'ACTIVE' as const,
          },
        ]
      : [],
    addresses: values.billingLine1
      ? [
          {
            addressType: 'BILLING' as const,
            addressName: 'Billing Address',
            line1: String(values.billingLine1),
            district: values.billingDistrict ? String(values.billingDistrict) : undefined,
            province: values.billingProvince ? String(values.billingProvince) : undefined,
            country: 'Vietnam',
            isDefault: true,
            status: 'ACTIVE' as const,
          },
        ]
      : [],
    externalReferences: references,
    classifications: values.groupCode
      ? [
          {
            classificationType: 'CUSTOMER_TYPE' as const,
            classificationCode: String(values.groupCode),
            classificationName: String(values.groupCode),
            isPrimary: true,
          },
        ]
      : [],
    relationships: values.parentCustomerCode
      ? [
          {
            fromCustomerCode: String(values.customerCode),
            toCustomerCode: String(values.parentCustomerCode),
            relationshipType: values.relationshipType as AccountRelationshipType,
            direction: 'CHILD_TO_PARENT' as const,
            isPrimary: true,
            status: 'ACTIVE' as const,
          },
        ]
      : [],
  } satisfies CreateCustomerAccountRequest
}

function buildExternalReferences(values: CustomerFormValues) {
  const references: CustomerExternalReferenceDto[] = brandSystems
    .map((brand) => ({
      sourceSystem: brand,
      externalId: values[`brand${brand}`] as string | undefined,
    }))
    .filter((item): item is { sourceSystem: string; externalId: string } => Boolean(item.externalId))
    .map((item) => ({
      sourceSystem: item.sourceSystem,
      externalId: item.externalId,
      isPrimary: false,
      status: 'ACTIVE',
    }))

  if (values.externalId) {
    references.push({
      sourceSystem: String(values.sourceSystem),
      externalId: String(values.externalId),
      externalCode: values.externalCode ? String(values.externalCode) : undefined,
      isPrimary: true,
      status: 'ACTIVE',
    })
  }

  return references
}
