import {
  AccountKind,
  AccountRelationshipType,
  AccountStatus,
  AccountType,
  AddressType,
  ClassificationType,
  ContactRole,
  CustomerSegment,
  RecordStatus,
} from './customer-account.enums';

export interface CustomerContactDto {
  id?: string;
  accountId?: string;
  contactCode?: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  jobTitle?: string;
  department?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  zalo?: string;
  contactRole?: ContactRole;
  isPrimary: boolean;
  isDecisionMaker?: boolean;
  status: RecordStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerAddressDto {
  id?: string;
  accountId?: string;
  addressType: AddressType;
  addressName?: string;
  line1: string;
  line2?: string;
  ward?: string;
  district?: string;
  province?: string;
  country: string;
  postalCode?: string;
  countryCode?: string;
  stateCode?: string;
  latitude?: number;
  longitude?: number;
  recipientName?: string;
  recipientPhone?: string;
  isDefault: boolean;
  status: RecordStatus;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface CustomerExternalReferenceDto {
  id?: string;
  accountId?: string;
  sourceSystem: string;
  externalId: string;
  externalCode?: string;
  isPrimary: boolean;
  status: RecordStatus;
  lastSyncedAt?: string;
}

export interface CustomerClassificationDto {
  id?: string;
  accountId?: string;
  classificationType: ClassificationType;
  classificationCode: string;
  classificationName?: string;
  isPrimary?: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface AccountRelationshipDto {
  id?: string;
  fromAccountId?: string;
  fromCustomerCode?: string;
  toAccountId?: string;
  toCustomerCode?: string;
  relationshipType: AccountRelationshipType;
  direction?: 'CHILD_TO_PARENT' | 'PARENT_TO_CHILD';
  isPrimary?: boolean;
  status: RecordStatus;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface BusinessAccountProfileDto {
  id?: string;
  accountId?: string;
  legalName?: string;
  taxCode?: string;
  businessRegistrationNo?: string;
  industry?: string;
  annualRevenue?: number;
  numberOfEmployees?: number;
  ownershipType?: string;
  paymentTerm?: string;
  creditLimit?: number;
  dealerTier?: string;
  dealerType?: string;
  regionCode?: string;
  territoryCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonAccountProfileDto {
  id?: string;
  accountId?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  salutation?: string;
  birthDate?: string;
  gender?: string;
  personalEmail?: string;
  personalMobile?: string;
  personalIdNumber?: string;
  loyaltyId?: string;
  consentStatus?: string;
  preferredChannel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerAccountDto {
  id?: string;
  accountNumber?: string;
  customerCode: string;
  accountName: string;
  accountKind: AccountKind;
  customerSegment: CustomerSegment;
  accountType: AccountType;
  status: AccountStatus;
  parentAccountId?: string;
  parentCustomerCode?: string;
  taxCode?: string;
  businessRegistrationNo?: string;
  phone?: string;
  email?: string;
  website?: string;
  industry?: string;
  regionCode?: string;
  territoryCode?: string;
  ownerUserId?: string;
  defaultBillingAddressId?: string;
  defaultShippingAddressId?: string;
  defaultBusinessLocationAddressId?: string;
  businessProfile?: BusinessAccountProfileDto;
  personProfile?: PersonAccountProfileDto;
  contacts?: CustomerContactDto[];
  addresses?: CustomerAddressDto[];
  externalReferences?: CustomerExternalReferenceDto[];
  classifications?: CustomerClassificationDto[];
  relationships?: AccountRelationshipDto[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateCustomerAccountRequest {
  accountNumber?: string;
  customerCode: string;
  accountName: string;
  accountKind: AccountKind;
  customerSegment: CustomerSegment;
  accountType: AccountType;
  status?: AccountStatus;
  parentAccountId?: string;
  parentCustomerCode?: string;
  taxCode?: string;
  businessRegistrationNo?: string;
  phone?: string;
  email?: string;
  website?: string;
  industry?: string;
  regionCode?: string;
  territoryCode?: string;
  ownerUserId?: string;
  businessProfile?: BusinessAccountProfileDto;
  personProfile?: PersonAccountProfileDto;
  contacts?: CustomerContactDto[];
  addresses?: CustomerAddressDto[];
  externalReferences?: CustomerExternalReferenceDto[];
  classifications?: CustomerClassificationDto[];
  relationships?: AccountRelationshipDto[];
}

export interface UpdateCustomerAccountRequest {
  accountName?: string;
  accountKind?: AccountKind;
  customerSegment?: CustomerSegment;
  accountType?: AccountType;
  status?: AccountStatus;
  parentAccountId?: string | null;
  parentCustomerCode?: string | null;
  taxCode?: string | null;
  businessRegistrationNo?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  industry?: string | null;
  regionCode?: string | null;
  territoryCode?: string | null;
  ownerUserId?: string | null;
  businessProfile?: BusinessAccountProfileDto | null;
  personProfile?: PersonAccountProfileDto | null;
  contacts?: CustomerContactDto[];
  addresses?: CustomerAddressDto[];
  externalReferences?: CustomerExternalReferenceDto[];
  classifications?: CustomerClassificationDto[];
  relationships?: AccountRelationshipDto[];
}

export interface UpsertCustomerAccountRequest {
  lookup: {
    accountNumber?: string;
    customerCode?: string;
    externalReference?: {
      sourceSystem: string;
      externalId: string;
    };
  };
  data: CreateCustomerAccountRequest | UpdateCustomerAccountRequest;
}

export interface ListCustomerAccountsQuery {
  search?: string;
  customerCode?: string;
  accountType?: AccountType;
  customerSegment?: CustomerSegment;
  status?: AccountStatus;
}

export interface UpdateAccountStatusRequest {
  status: AccountStatus;
}

export interface AccountHierarchyNodeDto {
  accountId: string;
  accountNumber?: string;
  customerCode: string;
  accountName: string;
  accountType: AccountType;
  customerSegment: CustomerSegment;
  status: AccountStatus;
  relationshipType?: AccountRelationshipType;
  level: number;
  path?: string;
  children: AccountHierarchyNodeDto[];
}

export type CustomerAccountRecord = Required<
  Pick<
    CustomerAccountDto,
    | 'id'
    | 'accountNumber'
    | 'customerCode'
    | 'accountName'
    | 'accountKind'
    | 'customerSegment'
    | 'accountType'
    | 'status'
    | 'contacts'
    | 'addresses'
    | 'externalReferences'
    | 'classifications'
    | 'relationships'
    | 'createdAt'
    | 'updatedAt'
  >
> &
  Omit<
    CustomerAccountDto,
    | 'id'
    | 'accountNumber'
    | 'customerCode'
    | 'accountName'
    | 'accountKind'
    | 'customerSegment'
    | 'accountType'
    | 'status'
    | 'contacts'
    | 'addresses'
    | 'externalReferences'
    | 'classifications'
    | 'relationships'
    | 'createdAt'
    | 'updatedAt'
  >;
