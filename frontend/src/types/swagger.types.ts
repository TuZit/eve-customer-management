/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HealthResponse {
  service?: string;
  status?: string;
}

export interface CustomerAccount {
  /** Internal technical primary key */
  id: string;
  /** CRM account number, e.g. ACC-000001 */
  accountNumber: string;
  /** Unique dealer/customer business code */
  customerCode: string;
  accountName: string;
  accountKind: "ORGANIZATION" | "PERSON";
  customerSegment: "B2B" | "B2C";
  accountType:
    | "DEALER"
    | "SHOWROOM"
    | "B2B_CUSTOMER"
    | "B2C_CUSTOMER"
    | "ONLINE_CUSTOMER"
    | "PARTNER"
    | "INDIVIDUAL"
    | "COMPANY";
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";
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
  businessProfile?: BusinessAccountProfile;
  personProfile?: PersonAccountProfile;
  contacts: CustomerContact[];
  addresses: CustomerAddress[];
  externalReferences: CustomerExternalReference[];
  classifications: CustomerClassification[];
  relationships: AccountRelationship[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerAccountRequest {
  accountNumber?: string;
  customerCode: string;
  accountName: string;
  accountKind: "ORGANIZATION" | "PERSON";
  customerSegment: "B2B" | "B2C";
  accountType:
    | "DEALER"
    | "SHOWROOM"
    | "B2B_CUSTOMER"
    | "B2C_CUSTOMER"
    | "ONLINE_CUSTOMER"
    | "PARTNER"
    | "INDIVIDUAL"
    | "COMPANY";
  status?: "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";
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
  businessProfile?: BusinessAccountProfile;
  personProfile?: PersonAccountProfile;
  contacts?: CustomerContact[];
  addresses?: CustomerAddress[];
  externalReferences?: CustomerExternalReference[];
  classifications?: CustomerClassification[];
  relationships?: AccountRelationship[];
}

export type UpdateCustomerAccountRequest = CustomerAccountInput;

export interface CustomerAccountInput {
  accountNumber?: string;
  customerCode?: string;
  accountName?: string;
  accountKind?: "ORGANIZATION" | "PERSON";
  customerSegment?: "B2B" | "B2C";
  accountType?:
    | "DEALER"
    | "SHOWROOM"
    | "B2B_CUSTOMER"
    | "B2C_CUSTOMER"
    | "ONLINE_CUSTOMER"
    | "PARTNER"
    | "INDIVIDUAL"
    | "COMPANY";
  status?: "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";
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
  businessProfile?: BusinessAccountProfile;
  personProfile?: PersonAccountProfile;
  contacts?: CustomerContact[];
  addresses?: CustomerAddress[];
  externalReferences?: CustomerExternalReference[];
  classifications?: CustomerClassification[];
  relationships?: AccountRelationship[];
}

export interface BusinessAccountProfile {
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
}

export interface PersonAccountProfile {
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
}

export interface CustomerContact {
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
  contactRole?:
    | "OWNER"
    | "PURCHASING"
    | "ACCOUNTING"
    | "TECHNICAL"
    | "SALES"
    | "WAREHOUSE"
    | "OTHER";
  isPrimary?: boolean;
  isDecisionMaker?: boolean;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CustomerAddress {
  id?: string;
  accountId?: string;
  addressType:
    | "BILLING"
    | "SHIPPING"
    | "BUSINESS_LOCATION"
    | "REGISTERED_OFFICE"
    | "WAREHOUSE"
    | "SHOWROOM"
    | "BRANCH"
    | "OTHER";
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
  isDefault?: boolean;
  status?: "ACTIVE" | "INACTIVE";
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface AccountRelationship {
  id?: string;
  fromAccountId?: string;
  fromCustomerCode?: string;
  toAccountId?: string;
  toCustomerCode?: string;
  relationshipType:
    | "PARENT_CHILD"
    | "HEAD_OFFICE_BRANCH"
    | "GROUP_MEMBER"
    | "REGION_MEMBER"
    | "BILL_TO"
    | "SHIP_TO"
    | "MANAGED_BY";
  direction?: "CHILD_TO_PARENT" | "PARENT_TO_CHILD";
  isPrimary?: boolean;
  status?: "ACTIVE" | "INACTIVE";
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface CustomerExternalReference {
  id?: string;
  accountId?: string;
  sourceSystem: string;
  externalId: string;
  externalCode?: string;
  isPrimary?: boolean;
  status?: "ACTIVE" | "INACTIVE";
  lastSyncedAt?: string;
}

export interface CustomerClassification {
  id?: string;
  accountId?: string;
  classificationType:
    | "CUSTOMER_TYPE"
    | "CHANNEL"
    | "SEGMENT"
    | "STATUS_TAG"
    | "PARTNER_TYPE";
  classificationCode: string;
  classificationName?: string;
  isPrimary?: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface UpsertCustomerAccountRequest {
  lookup: {
    accountNumber?: string;
    customerCode?: string;
    externalReference?: {
      sourceSystem?: string;
      externalId?: string;
    };
  };
  data: CustomerAccountInput;
}

export interface UpdateAccountStatusRequest {
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";
}

export interface AccountHierarchyNode {
  accountId?: string;
  accountNumber?: string;
  customerCode?: string;
  accountName?: string;
  accountType?:
    | "DEALER"
    | "SHOWROOM"
    | "B2B_CUSTOMER"
    | "B2C_CUSTOMER"
    | "ONLINE_CUSTOMER"
    | "PARTNER"
    | "INDIVIDUAL"
    | "COMPANY";
  customerSegment?: "B2B" | "B2C";
  status?: "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";
  relationshipType?: string;
  level?: number;
  path?: string;
  children?: AccountHierarchyNode[];
}

export namespace CustomerAccounts {
  /**
   * No description
   * @tags Customer Accounts
   * @name CustomerAccountsList
   * @summary List customer accounts
   * @request GET:/customer-accounts
   */
  export namespace CustomerAccountsList {
    export type RequestParams = {};
    export type RequestQuery = {
      search?: string;
      customerCode?: string;
      accountType?:
        | "DEALER"
        | "SHOWROOM"
        | "B2B_CUSTOMER"
        | "B2C_CUSTOMER"
        | "ONLINE_CUSTOMER"
        | "PARTNER"
        | "INDIVIDUAL"
        | "COMPANY";
      customerSegment?: "B2B" | "B2C";
      status?: "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerAccount[];
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name CustomerAccountsCreate
   * @summary Create a customer account
   * @request POST:/customer-accounts
   */
  export namespace CustomerAccountsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateCustomerAccountRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerAccount;
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name UpsertCreate
   * @summary Upsert by account number, customer code, or external reference
   * @request POST:/customer-accounts/upsert
   */
  export namespace UpsertCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UpsertCustomerAccountRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerAccount;
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name UpsertByExternalIdPartialUpdate
   * @summary Upsert by external system ID
   * @request PATCH:/customer-accounts/upsert/by-external-id/{sourceSystem}/{externalId}
   */
  export namespace UpsertByExternalIdPartialUpdate {
    export type RequestParams = {
      sourceSystem: string;
      externalId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateCustomerAccountRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerAccount;
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name ByCodeDetail
   * @summary Find customer account by business code
   * @request GET:/customer-accounts/by-code/{customerCode}
   */
  export namespace ByCodeDetail {
    export type RequestParams = {
      customerCode: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerAccount;
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name ByAccountNumberDetail
   * @summary Find customer account by CRM account number
   * @request GET:/customer-accounts/by-account-number/{accountNumber}
   */
  export namespace ByAccountNumberDetail {
    export type RequestParams = {
      accountNumber: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerAccount;
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name CustomerAccountsDetail
   * @summary Get customer account detail
   * @request GET:/customer-accounts/{id}
   */
  export namespace CustomerAccountsDetail {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerAccount;
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name CustomerAccountsUpdate
   * @summary Update customer account
   * @request PUT:/customer-accounts/{id}
   */
  export namespace CustomerAccountsUpdate {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateCustomerAccountRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerAccount;
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name StatusPartialUpdate
   * @summary Update account status
   * @request PATCH:/customer-accounts/{id}/status
   */
  export namespace StatusPartialUpdate {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateAccountStatusRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerAccount;
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name ContactsList
   * @summary List contacts under an account
   * @request GET:/customer-accounts/{id}/contacts
   */
  export namespace ContactsList {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerContact[];
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name ContactsCreate
   * @summary Add contact under an account
   * @request POST:/customer-accounts/{id}/contacts
   */
  export namespace ContactsCreate {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CustomerContact;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerContact;
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name AddressesList
   * @summary List addresses under an account
   * @request GET:/customer-accounts/{id}/addresses
   */
  export namespace AddressesList {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerAddress[];
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name AddressesCreate
   * @summary Add address under an account
   * @request POST:/customer-accounts/{id}/addresses
   */
  export namespace AddressesCreate {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CustomerAddress;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerAddress;
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name ChildrenList
   * @summary List direct child accounts
   * @request GET:/customer-accounts/{id}/children
   */
  export namespace ChildrenList {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerAccount[];
  }

  /**
   * No description
   * @tags Customer Accounts
   * @name HierarchyList
   * @summary Get account hierarchy tree
   * @request GET:/customer-accounts/{id}/hierarchy
   */
  export namespace HierarchyList {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AccountHierarchyNode;
  }
}
