import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
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
import {
  AccountHierarchyNodeDto,
  AccountRelationshipDto,
  BusinessAccountProfileDto,
  CreateCustomerAccountRequest,
  CustomerAccountRecord,
  CustomerAddressDto,
  CustomerClassificationDto,
  CustomerContactDto,
  CustomerExternalReferenceDto,
  ListCustomerAccountsQuery,
  PersonAccountProfileDto,
  UpdateCustomerAccountRequest,
  UpsertCustomerAccountRequest,
} from './customer-account.models';
import { initialCustomerAccounts } from './customer-accounts.seed';

@Injectable()
export class CustomerAccountsService {
  private readonly accounts = new Map<string, CustomerAccountRecord>();
  private accountNumberSequence = 1;

  constructor() {
    this.seedInitialAccounts();
  }

  list(query: ListCustomerAccountsQuery = {}): CustomerAccountRecord[] {
    const search = query.search?.trim().toLowerCase();

    return [...this.accounts.values()]
      .filter((account) => {
        if (query.customerCode && account.customerCode !== query.customerCode) {
          return false;
        }
        if (query.accountType && account.accountType !== query.accountType) {
          return false;
        }
        if (
          query.customerSegment &&
          account.customerSegment !== query.customerSegment
        ) {
          return false;
        }
        if (query.status && account.status !== query.status) {
          return false;
        }
        if (!search) {
          return true;
        }

        return [
          account.accountNumber,
          account.customerCode,
          account.accountName,
          account.email,
          account.phone,
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(search));
      })
      .sort((left, right) =>
        left.accountNumber.localeCompare(right.accountNumber),
      );
  }

  create(request: CreateCustomerAccountRequest): CustomerAccountRecord {
    const input = this.normalizeCreateRequest(request);
    const accountNumber = input.accountNumber ?? this.nextAccountNumber();
    const accountId = randomUUID();
    const now = new Date().toISOString();

    this.assertUniqueAccountNumber(accountNumber);
    this.assertUniqueCustomerCode(input.customerCode);

    const parentAccountId = this.resolveParentAccountId(
      input.parentAccountId,
      input.parentCustomerCode,
    );

    const account: CustomerAccountRecord = {
      id: accountId,
      accountNumber,
      customerCode: input.customerCode,
      accountName: input.accountName,
      accountKind: input.accountKind,
      customerSegment: input.customerSegment,
      accountType: input.accountType,
      status: input.status ?? AccountStatus.PENDING,
      parentAccountId,
      parentCustomerCode: input.parentCustomerCode,
      taxCode: input.taxCode,
      businessRegistrationNo: input.businessRegistrationNo,
      phone: input.phone,
      email: input.email,
      website: input.website,
      industry: input.industry,
      regionCode: input.regionCode,
      territoryCode: input.territoryCode,
      ownerUserId: input.ownerUserId,
      businessProfile: this.normalizeBusinessProfile(
        input.businessProfile,
        accountId,
        now,
      ),
      personProfile: this.normalizePersonProfile(
        input.personProfile,
        accountId,
        now,
      ),
      contacts: [],
      addresses: [],
      externalReferences: [],
      classifications: [],
      relationships: [],
      createdAt: now,
      updatedAt: now,
    };

    account.contacts = this.normalizeContacts(input.contacts, account.id);
    account.addresses = this.normalizeAddresses(input.addresses, account.id);
    account.externalReferences = this.normalizeExternalReferences(
      input.externalReferences,
      account.id,
    );
    account.classifications = this.normalizeClassifications(
      input.classifications,
      account.id,
    );
    account.relationships = this.normalizeRelationships(
      input.relationships,
      account.id,
    );

    this.assertBusinessRules(account);
    this.assertExternalReferencesUnique(account);
    this.accounts.set(account.id, this.withDefaultAddressIds(account));

    return this.findOne(account.id);
  }

  findOne(id: string): CustomerAccountRecord {
    const account = this.accounts.get(id);

    if (!account) {
      throw new NotFoundException(`Customer account ${id} was not found`);
    }

    return structuredClone(account);
  }

  findByCode(customerCode: string): CustomerAccountRecord {
    const account = [...this.accounts.values()].find(
      (candidate) => candidate.customerCode === customerCode,
    );

    if (!account) {
      throw new NotFoundException(
        `Customer account with code ${customerCode} was not found`,
      );
    }

    return structuredClone(account);
  }

  findByAccountNumber(accountNumber: string): CustomerAccountRecord {
    const account = [...this.accounts.values()].find(
      (candidate) => candidate.accountNumber === accountNumber,
    );

    if (!account) {
      throw new NotFoundException(
        `Customer account with account number ${accountNumber} was not found`,
      );
    }

    return structuredClone(account);
  }

  update(
    id: string,
    request: UpdateCustomerAccountRequest,
  ): CustomerAccountRecord {
    const current = this.accounts.get(id);

    if (!current) {
      throw new NotFoundException(`Customer account ${id} was not found`);
    }

    const normalized = this.normalizeUpdateRequest(request);
    const next: CustomerAccountRecord = {
      ...current,
      updatedAt: new Date().toISOString(),
    };

    if (normalized.accountName !== undefined) {
      next.accountName = normalized.accountName;
    }
    if (normalized.accountKind !== undefined) {
      next.accountKind = normalized.accountKind;
    }
    if (normalized.customerSegment !== undefined) {
      next.customerSegment = normalized.customerSegment;
    }
    if (normalized.accountType !== undefined) {
      next.accountType = normalized.accountType;
    }
    if (normalized.status !== undefined) {
      next.status = normalized.status;
    }

    this.applyNullableStringUpdate(next, normalized, 'taxCode');
    this.applyNullableStringUpdate(next, normalized, 'businessRegistrationNo');
    this.applyNullableStringUpdate(next, normalized, 'phone');
    this.applyNullableStringUpdate(next, normalized, 'email');
    this.applyNullableStringUpdate(next, normalized, 'website');
    this.applyNullableStringUpdate(next, normalized, 'industry');
    this.applyNullableStringUpdate(next, normalized, 'regionCode');
    this.applyNullableStringUpdate(next, normalized, 'territoryCode');
    this.applyNullableStringUpdate(next, normalized, 'ownerUserId');

    if (request.parentAccountId !== undefined) {
      next.parentAccountId = request.parentAccountId
        ? this.resolveParentAccountId(request.parentAccountId)
        : undefined;
      if (request.parentAccountId === null) {
        next.parentCustomerCode = undefined;
      }
    }
    if (request.parentCustomerCode !== undefined) {
      next.parentCustomerCode = request.parentCustomerCode ?? undefined;
      next.parentAccountId = next.parentCustomerCode
        ? this.resolveParentAccountId(undefined, next.parentCustomerCode)
        : undefined;
    }

    if (request.contacts !== undefined) {
      next.contacts = this.normalizeContacts(request.contacts, id);
    }
    if (request.addresses !== undefined) {
      next.addresses = this.normalizeAddresses(request.addresses, id);
    }
    if (request.externalReferences !== undefined) {
      next.externalReferences = this.normalizeExternalReferences(
        request.externalReferences,
        id,
      );
    }
    if (request.classifications !== undefined) {
      next.classifications = this.normalizeClassifications(
        request.classifications,
        id,
      );
    }
    if (request.relationships !== undefined) {
      next.relationships = this.normalizeRelationships(
        request.relationships,
        id,
      );
    }
    if (request.businessProfile !== undefined) {
      next.businessProfile =
        request.businessProfile === null
          ? undefined
          : this.normalizeBusinessProfile(
              request.businessProfile,
              id,
              new Date().toISOString(),
            );
    }
    if (request.personProfile !== undefined) {
      next.personProfile =
        request.personProfile === null
          ? undefined
          : this.normalizePersonProfile(
              request.personProfile,
              id,
              new Date().toISOString(),
            );
    }

    this.assertBusinessRules(next);
    this.assertExternalReferencesUnique(next, id);
    this.accounts.set(id, this.withDefaultAddressIds(next));

    return this.findOne(id);
  }

  updateStatus(id: string, status: AccountStatus): CustomerAccountRecord {
    return this.update(id, { status });
  }

  upsert(request: UpsertCustomerAccountRequest): CustomerAccountRecord {
    if (!request?.lookup || !request.data) {
      throw new BadRequestException('lookup and data are required');
    }

    const existing = this.findByLookup(request.lookup);

    if (existing) {
      return this.update(existing.id, request.data);
    }

    return this.create(request.data as CreateCustomerAccountRequest);
  }

  upsertByExternalId(
    sourceSystem: string,
    externalId: string,
    request: CreateCustomerAccountRequest | UpdateCustomerAccountRequest,
  ): CustomerAccountRecord {
    const existing = this.findByExternalReference(sourceSystem, externalId);

    if (existing) {
      return this.update(existing.id, request);
    }

    const createRequest = request as CreateCustomerAccountRequest;
    createRequest.externalReferences = [
      ...(createRequest.externalReferences ?? []),
      {
        sourceSystem,
        externalId,
        isPrimary: true,
        status: RecordStatus.ACTIVE,
      },
    ];

    return this.create(createRequest);
  }

  listContacts(accountId: string): CustomerContactDto[] {
    return this.findOne(accountId).contacts;
  }

  addContact(
    accountId: string,
    contact: CustomerContactDto,
  ): CustomerContactDto {
    const account = this.accounts.get(accountId);

    if (!account) {
      throw new NotFoundException(
        `Customer account ${accountId} was not found`,
      );
    }

    const normalized = this.normalizeContact(contact, accountId);
    const next = {
      ...account,
      contacts: [...account.contacts, normalized],
      updatedAt: new Date().toISOString(),
    };

    this.assertBusinessRules(next);
    this.accounts.set(accountId, next);

    return structuredClone(normalized);
  }

  listAddresses(accountId: string): CustomerAddressDto[] {
    return this.findOne(accountId).addresses;
  }

  addAddress(
    accountId: string,
    address: CustomerAddressDto,
  ): CustomerAddressDto {
    const account = this.accounts.get(accountId);

    if (!account) {
      throw new NotFoundException(
        `Customer account ${accountId} was not found`,
      );
    }

    const normalized = this.normalizeAddress(address, accountId);
    const next = this.withDefaultAddressIds({
      ...account,
      addresses: [...account.addresses, normalized],
      updatedAt: new Date().toISOString(),
    });

    this.assertBusinessRules(next);
    this.accounts.set(accountId, next);

    return structuredClone(normalized);
  }

  getChildren(accountId: string): CustomerAccountRecord[] {
    this.findOne(accountId);

    return [...this.accounts.values()]
      .filter((account) => account.parentAccountId === accountId)
      .map((account) => structuredClone(account));
  }

  getHierarchy(accountId: string): AccountHierarchyNodeDto {
    const account = this.findOne(accountId);

    return this.toHierarchyNode(account, 0, account.accountNumber);
  }

  private toHierarchyNode(
    account: CustomerAccountRecord,
    level: number,
    path: string,
  ): AccountHierarchyNodeDto {
    const children = [...this.accounts.values()]
      .filter((candidate) => candidate.parentAccountId === account.id)
      .sort((left, right) =>
        left.accountNumber.localeCompare(right.accountNumber),
      )
      .map((child) =>
        this.toHierarchyNode(
          child,
          level + 1,
          `${path}/${child.accountNumber}`,
        ),
      );

    return {
      accountId: account.id,
      accountNumber: account.accountNumber,
      customerCode: account.customerCode,
      accountName: account.accountName,
      accountType: account.accountType,
      customerSegment: account.customerSegment,
      status: account.status,
      relationshipType: AccountRelationshipType.PARENT_CHILD,
      level,
      path,
      children,
    };
  }

  private findByLookup(lookup: UpsertCustomerAccountRequest['lookup']) {
    if (lookup.accountNumber) {
      return [...this.accounts.values()].find(
        (account) => account.accountNumber === lookup.accountNumber,
      );
    }
    if (lookup.customerCode) {
      return [...this.accounts.values()].find(
        (account) => account.customerCode === lookup.customerCode,
      );
    }
    if (lookup.externalReference) {
      return this.findByExternalReference(
        lookup.externalReference.sourceSystem,
        lookup.externalReference.externalId,
      );
    }

    throw new BadRequestException(
      'At least one lookup key is required: accountNumber, customerCode, or externalReference',
    );
  }

  private findByExternalReference(sourceSystem: string, externalId: string) {
    return [...this.accounts.values()].find((account) =>
      account.externalReferences.some(
        (reference) =>
          reference.sourceSystem === sourceSystem &&
          reference.externalId === externalId,
      ),
    );
  }

  private normalizeCreateRequest(
    request: CreateCustomerAccountRequest,
  ): CreateCustomerAccountRequest {
    if (!request) {
      throw new BadRequestException('Request body is required');
    }

    return {
      ...request,
      accountNumber: this.cleanOptionalString(request.accountNumber),
      customerCode: this.cleanRequiredString(
        request.customerCode,
        'customerCode',
      ),
      accountName: this.cleanRequiredString(request.accountName, 'accountName'),
      accountKind: this.parseEnum(
        request.accountKind,
        AccountKind,
        'accountKind',
      ),
      customerSegment: this.parseEnum(
        request.customerSegment,
        CustomerSegment,
        'customerSegment',
      ),
      accountType: this.parseEnum(
        request.accountType,
        AccountType,
        'accountType',
      ),
      status: this.parseOptionalEnum(request.status, AccountStatus, 'status'),
      parentAccountId: this.cleanOptionalString(request.parentAccountId),
      parentCustomerCode: this.cleanOptionalString(request.parentCustomerCode),
      taxCode: this.cleanOptionalString(request.taxCode),
      businessRegistrationNo: this.cleanOptionalString(
        request.businessRegistrationNo,
      ),
      phone: this.cleanOptionalString(request.phone),
      email: this.cleanOptionalString(request.email),
      website: this.cleanOptionalString(request.website),
      industry: this.cleanOptionalString(request.industry),
      regionCode: this.cleanOptionalString(request.regionCode),
      territoryCode: this.cleanOptionalString(request.territoryCode),
      ownerUserId: this.cleanOptionalString(request.ownerUserId),
      businessProfile: request.businessProfile,
      personProfile: request.personProfile,
    };
  }

  private normalizeUpdateRequest(
    request: UpdateCustomerAccountRequest,
  ): UpdateCustomerAccountRequest {
    if (!request) {
      throw new BadRequestException('Request body is required');
    }

    const normalized: UpdateCustomerAccountRequest = {};

    if (request.accountName !== undefined) {
      normalized.accountName = this.cleanRequiredString(
        request.accountName,
        'accountName',
      );
    }
    if (request.accountKind !== undefined) {
      normalized.accountKind = this.parseEnum(
        request.accountKind,
        AccountKind,
        'accountKind',
      );
    }
    if (request.customerSegment !== undefined) {
      normalized.customerSegment = this.parseEnum(
        request.customerSegment,
        CustomerSegment,
        'customerSegment',
      );
    }
    if (request.accountType !== undefined) {
      normalized.accountType = this.parseEnum(
        request.accountType,
        AccountType,
        'accountType',
      );
    }
    if (request.status !== undefined) {
      normalized.status = this.parseEnum(
        request.status,
        AccountStatus,
        'status',
      );
    }

    this.copyNullableString(request, normalized, 'taxCode');
    this.copyNullableString(request, normalized, 'businessRegistrationNo');
    this.copyNullableString(request, normalized, 'phone');
    this.copyNullableString(request, normalized, 'email');
    this.copyNullableString(request, normalized, 'website');
    this.copyNullableString(request, normalized, 'industry');
    this.copyNullableString(request, normalized, 'regionCode');
    this.copyNullableString(request, normalized, 'territoryCode');
    this.copyNullableString(request, normalized, 'ownerUserId');

    return normalized;
  }

  private normalizeContacts(
    contacts: CustomerContactDto[] | undefined,
    accountId: string,
  ): CustomerContactDto[] {
    return (contacts ?? []).map((contact) =>
      this.normalizeContact(contact, accountId),
    );
  }

  private normalizeContact(
    contact: CustomerContactDto,
    accountId: string,
  ): CustomerContactDto {
    if (!contact) {
      throw new BadRequestException('contact is required');
    }

    const now = new Date().toISOString();

    return {
      id: contact.id ?? randomUUID(),
      accountId,
      contactCode: this.cleanOptionalString(contact.contactCode),
      firstName: this.cleanOptionalString(contact.firstName),
      lastName: this.cleanOptionalString(contact.lastName),
      fullName: this.cleanRequiredString(contact.fullName, 'contact.fullName'),
      jobTitle: this.cleanOptionalString(contact.jobTitle),
      department: this.cleanOptionalString(contact.department),
      email: this.cleanOptionalString(contact.email),
      phone: this.cleanOptionalString(contact.phone),
      mobile: this.cleanOptionalString(contact.mobile),
      zalo: this.cleanOptionalString(contact.zalo),
      contactRole: this.parseOptionalEnum(
        contact.contactRole,
        ContactRole,
        'contact.contactRole',
      ),
      isPrimary: Boolean(contact.isPrimary),
      isDecisionMaker:
        contact.isDecisionMaker === undefined
          ? undefined
          : Boolean(contact.isDecisionMaker),
      status:
        this.parseOptionalEnum(
          contact.status,
          RecordStatus,
          'contact.status',
        ) ?? RecordStatus.ACTIVE,
      createdAt: contact.createdAt ?? now,
      updatedAt: now,
    };
  }

  private normalizeAddresses(
    addresses: CustomerAddressDto[] | undefined,
    accountId: string,
  ): CustomerAddressDto[] {
    return (addresses ?? []).map((address) =>
      this.normalizeAddress(address, accountId),
    );
  }

  private normalizeAddress(
    address: CustomerAddressDto,
    accountId: string,
  ): CustomerAddressDto {
    if (!address) {
      throw new BadRequestException('address is required');
    }

    return {
      id: address.id ?? randomUUID(),
      accountId,
      addressType: this.parseEnum(
        address.addressType,
        AddressType,
        'address.addressType',
      ),
      addressName: this.cleanOptionalString(address.addressName),
      line1: this.cleanRequiredString(address.line1, 'address.line1'),
      line2: this.cleanOptionalString(address.line2),
      ward: this.cleanOptionalString(address.ward),
      district: this.cleanOptionalString(address.district),
      province: this.cleanOptionalString(address.province),
      country: this.cleanRequiredString(address.country, 'address.country'),
      postalCode: this.cleanOptionalString(address.postalCode),
      countryCode: this.cleanOptionalString(address.countryCode),
      stateCode: this.cleanOptionalString(address.stateCode),
      latitude: this.cleanOptionalNumber(address.latitude, 'address.latitude'),
      longitude: this.cleanOptionalNumber(
        address.longitude,
        'address.longitude',
      ),
      recipientName: this.cleanOptionalString(address.recipientName),
      recipientPhone: this.cleanOptionalString(address.recipientPhone),
      isDefault: Boolean(address.isDefault),
      status:
        this.parseOptionalEnum(
          address.status,
          RecordStatus,
          'address.status',
        ) ?? RecordStatus.ACTIVE,
      effectiveFrom: this.cleanOptionalString(address.effectiveFrom),
      effectiveTo: this.cleanOptionalString(address.effectiveTo),
    };
  }

  private normalizeExternalReferences(
    references: CustomerExternalReferenceDto[] | undefined,
    accountId: string,
  ): CustomerExternalReferenceDto[] {
    return (references ?? []).map((reference) => {
      if (!reference) {
        throw new BadRequestException('externalReference is required');
      }

      return {
        id: reference.id ?? randomUUID(),
        accountId,
        sourceSystem: this.cleanRequiredString(
          reference.sourceSystem,
          'externalReference.sourceSystem',
        ),
        externalId: this.cleanRequiredString(
          reference.externalId,
          'externalReference.externalId',
        ),
        externalCode: this.cleanOptionalString(reference.externalCode),
        isPrimary: Boolean(reference.isPrimary),
        status:
          this.parseOptionalEnum(
            reference.status,
            RecordStatus,
            'externalReference.status',
          ) ?? RecordStatus.ACTIVE,
        lastSyncedAt: this.cleanOptionalString(reference.lastSyncedAt),
      };
    });
  }

  private normalizeClassifications(
    classifications: CustomerClassificationDto[] | undefined,
    accountId: string,
  ): CustomerClassificationDto[] {
    return (classifications ?? []).map((classification) => {
      if (!classification) {
        throw new BadRequestException('classification is required');
      }

      return {
        id: classification.id ?? randomUUID(),
        accountId,
        classificationType: this.parseEnum(
          classification.classificationType,
          ClassificationType,
          'classification.classificationType',
        ),
        classificationCode: this.cleanRequiredString(
          classification.classificationCode,
          'classification.classificationCode',
        ),
        classificationName: this.cleanOptionalString(
          classification.classificationName,
        ),
        isPrimary:
          classification.isPrimary === undefined
            ? undefined
            : Boolean(classification.isPrimary),
        effectiveFrom: this.cleanOptionalString(classification.effectiveFrom),
        effectiveTo: this.cleanOptionalString(classification.effectiveTo),
      };
    });
  }

  private normalizeRelationships(
    relationships: AccountRelationshipDto[] | undefined,
    accountId: string,
  ): AccountRelationshipDto[] {
    return (relationships ?? []).map((relationship) => {
      if (!relationship) {
        throw new BadRequestException('relationship is required');
      }

      return {
        id: relationship.id ?? randomUUID(),
        fromAccountId:
          this.cleanOptionalString(relationship.fromAccountId) ?? accountId,
        fromCustomerCode: this.cleanOptionalString(
          relationship.fromCustomerCode,
        ),
        toAccountId: this.cleanOptionalString(relationship.toAccountId),
        toCustomerCode: this.cleanOptionalString(relationship.toCustomerCode),
        relationshipType: this.parseEnum(
          relationship.relationshipType,
          AccountRelationshipType,
          'relationship.relationshipType',
        ),
        direction: relationship.direction,
        isPrimary:
          relationship.isPrimary === undefined
            ? undefined
            : Boolean(relationship.isPrimary),
        status:
          this.parseOptionalEnum(
            relationship.status,
            RecordStatus,
            'relationship.status',
          ) ?? RecordStatus.ACTIVE,
        effectiveFrom: this.cleanOptionalString(relationship.effectiveFrom),
        effectiveTo: this.cleanOptionalString(relationship.effectiveTo),
      };
    });
  }

  private normalizeBusinessProfile(
    profile: BusinessAccountProfileDto | undefined,
    accountId: string | undefined,
    now: string,
  ): BusinessAccountProfileDto | undefined {
    if (!profile) {
      return undefined;
    }

    return {
      id: profile.id ?? randomUUID(),
      accountId,
      legalName: this.cleanOptionalString(profile.legalName),
      taxCode: this.cleanOptionalString(profile.taxCode),
      businessRegistrationNo: this.cleanOptionalString(
        profile.businessRegistrationNo,
      ),
      industry: this.cleanOptionalString(profile.industry),
      annualRevenue: this.cleanOptionalNumber(
        profile.annualRevenue,
        'businessProfile.annualRevenue',
      ),
      numberOfEmployees: this.cleanOptionalNumber(
        profile.numberOfEmployees,
        'businessProfile.numberOfEmployees',
      ),
      ownershipType: this.cleanOptionalString(profile.ownershipType),
      paymentTerm: this.cleanOptionalString(profile.paymentTerm),
      creditLimit: this.cleanOptionalNumber(
        profile.creditLimit,
        'businessProfile.creditLimit',
      ),
      dealerTier: this.cleanOptionalString(profile.dealerTier),
      dealerType: this.cleanOptionalString(profile.dealerType),
      regionCode: this.cleanOptionalString(profile.regionCode),
      territoryCode: this.cleanOptionalString(profile.territoryCode),
      createdAt: profile.createdAt ?? now,
      updatedAt: now,
    };
  }

  private normalizePersonProfile(
    profile: PersonAccountProfileDto | undefined,
    accountId: string | undefined,
    now: string,
  ): PersonAccountProfileDto | undefined {
    if (!profile) {
      return undefined;
    }

    return {
      id: profile.id ?? randomUUID(),
      accountId,
      firstName: this.cleanRequiredString(
        profile.firstName,
        'personProfile.firstName',
      ),
      lastName: this.cleanRequiredString(
        profile.lastName,
        'personProfile.lastName',
      ),
      middleName: this.cleanOptionalString(profile.middleName),
      salutation: this.cleanOptionalString(profile.salutation),
      birthDate: this.cleanOptionalString(profile.birthDate),
      gender: this.cleanOptionalString(profile.gender),
      personalEmail: this.cleanOptionalString(profile.personalEmail),
      personalMobile: this.cleanOptionalString(profile.personalMobile),
      personalIdNumber: this.cleanOptionalString(profile.personalIdNumber),
      loyaltyId: this.cleanOptionalString(profile.loyaltyId),
      consentStatus: this.cleanOptionalString(profile.consentStatus),
      preferredChannel: this.cleanOptionalString(profile.preferredChannel),
      createdAt: profile.createdAt ?? now,
      updatedAt: now,
    };
  }

  private assertBusinessRules(account: CustomerAccountRecord): void {
    if (account.parentAccountId === account.id) {
      throw new BadRequestException('An account cannot be its own parent');
    }

    if (
      account.accountKind === AccountKind.ORGANIZATION &&
      account.personProfile
    ) {
      throw new BadRequestException(
        'ORGANIZATION account cannot have a personProfile',
      );
    }

    if (account.accountKind === AccountKind.PERSON && account.businessProfile) {
      throw new BadRequestException(
        'PERSON account cannot have a businessProfile',
      );
    }

    if (account.parentAccountId) {
      this.assertNoHierarchyLoop(account.id, account.parentAccountId);
    }

    const activePrimaryContacts = account.contacts.filter(
      (contact) =>
        contact.status === RecordStatus.ACTIVE && contact.isPrimary === true,
    );

    if (activePrimaryContacts.length > 1) {
      throw new ConflictException(
        'One account can have only one ACTIVE primary contact',
      );
    }

    if (
      account.customerSegment === CustomerSegment.B2B &&
      account.status === AccountStatus.ACTIVE &&
      activePrimaryContacts.length === 0
    ) {
      throw new BadRequestException(
        'B2B ACTIVE account should have at least one primary contact',
      );
    }

    for (const addressType of [AddressType.BILLING, AddressType.SHIPPING]) {
      const activeDefaultAddresses = account.addresses.filter(
        (address) =>
          address.addressType === addressType &&
          address.status === RecordStatus.ACTIVE &&
          address.isDefault === true,
      );

      if (activeDefaultAddresses.length > 1) {
        throw new ConflictException(
          `One account can have only one ACTIVE default ${addressType} address`,
        );
      }
    }

    for (const sourceSystem of new Set(
      account.externalReferences.map((reference) => reference.sourceSystem),
    )) {
      const primaryReferences = account.externalReferences.filter(
        (reference) =>
          reference.sourceSystem === sourceSystem &&
          reference.status === RecordStatus.ACTIVE &&
          reference.isPrimary === true,
      );

      if (primaryReferences.length > 1) {
        throw new ConflictException(
          `One account can have only one ACTIVE primary external reference for ${sourceSystem}`,
        );
      }
    }
  }

  private assertNoHierarchyLoop(
    accountId: string,
    parentAccountId: string,
  ): void {
    let cursor: string | undefined = parentAccountId;

    while (cursor) {
      if (cursor === accountId) {
        throw new ConflictException('Hierarchy loops are not allowed');
      }

      cursor = this.accounts.get(cursor)?.parentAccountId;
    }
  }

  private assertExternalReferencesUnique(
    account: CustomerAccountRecord,
    currentAccountId?: string,
  ): void {
    const localKeys = new Set<string>();

    for (const reference of account.externalReferences) {
      const key = `${reference.sourceSystem}:${reference.externalId}`;

      if (localKeys.has(key)) {
        throw new ConflictException(
          `Duplicate external reference ${reference.sourceSystem}/${reference.externalId}`,
        );
      }

      localKeys.add(key);
    }

    for (const candidate of this.accounts.values()) {
      if (candidate.id === currentAccountId) {
        continue;
      }

      for (const reference of candidate.externalReferences) {
        const key = `${reference.sourceSystem}:${reference.externalId}`;

        if (localKeys.has(key)) {
          throw new ConflictException(
            `External reference ${reference.sourceSystem}/${reference.externalId} already exists`,
          );
        }
      }
    }
  }

  private assertUniqueAccountNumber(accountNumber: string): void {
    if (
      [...this.accounts.values()].some(
        (account) => account.accountNumber === accountNumber,
      )
    ) {
      throw new ConflictException(
        `Account number ${accountNumber} already exists`,
      );
    }
  }

  private assertUniqueCustomerCode(customerCode: string): void {
    if (
      [...this.accounts.values()].some(
        (account) => account.customerCode === customerCode,
      )
    ) {
      throw new ConflictException(
        `Customer code ${customerCode} already exists`,
      );
    }
  }

  private resolveParentAccountId(
    parentAccountId?: string,
    parentCustomerCode?: string | null,
  ): string | undefined {
    if (parentAccountId) {
      this.findOne(parentAccountId);
      return parentAccountId;
    }

    if (!parentCustomerCode) {
      return undefined;
    }

    return this.findByCode(parentCustomerCode).id;
  }

  private withDefaultAddressIds(
    account: CustomerAccountRecord,
  ): CustomerAccountRecord {
    const findDefault = (addressType: AddressType) =>
      account.addresses.find(
        (address) =>
          address.addressType === addressType &&
          address.status === RecordStatus.ACTIVE &&
          address.isDefault,
      )?.id;

    return {
      ...account,
      defaultBillingAddressId: findDefault(AddressType.BILLING),
      defaultShippingAddressId: findDefault(AddressType.SHIPPING),
      defaultBusinessLocationAddressId: findDefault(
        AddressType.BUSINESS_LOCATION,
      ),
    };
  }

  private cleanRequiredString(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new BadRequestException(`${field} is required`);
    }

    return value.trim();
  }

  private cleanOptionalString(value: unknown): string | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('Expected string value');
    }

    return value.trim();
  }

  private cleanOptionalNumber(
    value: unknown,
    field: string,
  ): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      throw new BadRequestException(`${field} must be a number`);
    }

    return parsed;
  }

  private parseEnum<T extends Record<string, string>>(
    value: unknown,
    enumObject: T,
    field: string,
  ): T[keyof T] {
    if (
      typeof value !== 'string' ||
      !Object.values(enumObject).includes(value)
    ) {
      throw new BadRequestException(
        `${field} must be one of: ${Object.values(enumObject).join(', ')}`,
      );
    }

    return value as T[keyof T];
  }

  private parseOptionalEnum<T extends Record<string, string>>(
    value: unknown,
    enumObject: T,
    field: string,
  ): T[keyof T] | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    return this.parseEnum(value, enumObject, field);
  }

  private copyNullableString(
    source: UpdateCustomerAccountRequest,
    target: UpdateCustomerAccountRequest,
    key:
      | 'taxCode'
      | 'businessRegistrationNo'
      | 'phone'
      | 'email'
      | 'website'
      | 'industry'
      | 'regionCode'
      | 'territoryCode'
      | 'ownerUserId',
  ): void {
    if (source[key] === undefined) {
      return;
    }

    target[key] =
      source[key] === null ? null : this.cleanOptionalString(source[key]);
  }

  private applyNullableStringUpdate(
    target: CustomerAccountRecord,
    source: UpdateCustomerAccountRequest,
    key:
      | 'taxCode'
      | 'businessRegistrationNo'
      | 'phone'
      | 'email'
      | 'website'
      | 'industry'
      | 'regionCode'
      | 'territoryCode'
      | 'ownerUserId',
  ): void {
    if (source[key] === undefined) {
      return;
    }

    target[key] = source[key] ?? undefined;
  }

  private nextAccountNumber(): string {
    return `ACC-${String(this.accountNumberSequence++).padStart(6, '0')}`;
  }

  private seedInitialAccounts(): void {
    for (const account of initialCustomerAccounts) {
      this.create(account);
    }

    const highestSeedAccountNumber = this.list()
      .map((account) => account.accountNumber.match(/^ACC-(\d+)$/)?.[1])
      .filter((value): value is string => Boolean(value))
      .map(Number)
      .reduce((highest, value) => Math.max(highest, value), 0);

    this.accountNumberSequence = highestSeedAccountNumber + 1;
  }
}
