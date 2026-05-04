import { BadRequestException, ConflictException } from '@nestjs/common';
import {
  AccountKind,
  AccountStatus,
  AccountType,
  AddressType,
  ContactRole,
  CustomerSegment,
  RecordStatus,
} from './customer-account.enums';
import { CustomerAccountsService } from './customer-accounts.service';

describe('CustomerAccountsService', () => {
  let service: CustomerAccountsService;

  beforeEach(() => {
    service = new CustomerAccountsService();
  });

  it('creates a Salesforce-style customer account with generated account number', () => {
    const account = service.create({
      customerCode: 'DLR-HCM-00001',
      accountName: 'ABC Dealer',
      accountKind: AccountKind.ORGANIZATION,
      customerSegment: CustomerSegment.B2B,
      accountType: AccountType.DEALER,
      status: AccountStatus.ACTIVE,
      contacts: [
        {
          fullName: 'Nguyen Van A',
          contactRole: ContactRole.PURCHASING,
          isPrimary: true,
          status: RecordStatus.ACTIVE,
        },
      ],
      addresses: [
        {
          addressType: AddressType.BILLING,
          line1: '123 Nguyen Van Linh',
          country: 'VN',
          isDefault: true,
          status: RecordStatus.ACTIVE,
        },
      ],
      externalReferences: [
        {
          sourceSystem: 'ERP',
          externalId: 'ERP-CUST-88991',
          isPrimary: true,
          status: RecordStatus.ACTIVE,
        },
      ],
    });

    expect(account.accountNumber).toBe('ACC-000001');
    expect(account.defaultBillingAddressId).toBe(account.addresses[0].id);
  });

  it('rejects duplicate customer code', () => {
    service.create({
      customerCode: 'CUS-000123',
      accountName: 'Nguyen Thi Lan',
      accountKind: AccountKind.PERSON,
      customerSegment: CustomerSegment.B2C,
      accountType: AccountType.ONLINE_CUSTOMER,
    });

    expect(() =>
      service.create({
        customerCode: 'CUS-000123',
        accountName: 'Duplicate',
        accountKind: AccountKind.PERSON,
        customerSegment: CustomerSegment.B2C,
        accountType: AccountType.ONLINE_CUSTOMER,
      }),
    ).toThrow(ConflictException);
  });

  it('attaches a person account profile to a PERSON account', () => {
    const account = service.create({
      customerCode: 'CUS-000124',
      accountName: 'Nguyen Thi Lan',
      accountKind: AccountKind.PERSON,
      customerSegment: CustomerSegment.B2C,
      accountType: AccountType.ONLINE_CUSTOMER,
      personProfile: {
        firstName: 'Lan',
        lastName: 'Nguyen Thi',
        loyaltyId: 'LOY-000124',
      },
    });

    expect(account.personProfile?.accountId).toBe(account.id);
    expect(account.personProfile?.firstName).toBe('Lan');
  });

  it('rejects a person profile on an organization account', () => {
    expect(() =>
      service.create({
        customerCode: 'DLR-HCM-00004',
        accountName: 'ABC Dealer',
        accountKind: AccountKind.ORGANIZATION,
        customerSegment: CustomerSegment.B2B,
        accountType: AccountType.DEALER,
        personProfile: {
          firstName: 'Lan',
          lastName: 'Nguyen Thi',
        },
        contacts: [
          {
            fullName: 'Nguyen Van A',
            isPrimary: true,
            status: RecordStatus.ACTIVE,
          },
        ],
      }),
    ).toThrow(BadRequestException);
  });

  it('requires a primary contact before a B2B account can become active', () => {
    expect(() =>
      service.create({
        customerCode: 'DLR-HCM-00002',
        accountName: 'No Contact Dealer',
        accountKind: AccountKind.ORGANIZATION,
        customerSegment: CustomerSegment.B2B,
        accountType: AccountType.DEALER,
        status: AccountStatus.ACTIVE,
      }),
    ).toThrow(BadRequestException);
  });

  it('builds account hierarchy from parent account relationship', () => {
    const parent = service.create({
      customerCode: 'GRP-ABC',
      accountName: 'ABC Group',
      accountKind: AccountKind.ORGANIZATION,
      customerSegment: CustomerSegment.B2B,
      accountType: AccountType.COMPANY,
      contacts: [
        {
          fullName: 'Group Owner',
          isPrimary: true,
          status: RecordStatus.ACTIVE,
        },
      ],
    });

    service.create({
      customerCode: 'DLR-HCM-00003',
      accountName: 'ABC Branch HCMC',
      accountKind: AccountKind.ORGANIZATION,
      customerSegment: CustomerSegment.B2B,
      accountType: AccountType.SHOWROOM,
      parentCustomerCode: 'GRP-ABC',
      contacts: [
        {
          fullName: 'Branch Owner',
          isPrimary: true,
          status: RecordStatus.ACTIVE,
        },
      ],
    });

    const hierarchy = service.getHierarchy(parent.id);

    expect(hierarchy.children).toHaveLength(1);
    expect(hierarchy.children[0].customerCode).toBe('DLR-HCM-00003');
  });
});
