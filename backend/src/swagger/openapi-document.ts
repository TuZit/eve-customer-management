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
} from '../customer-accounts/customer-account.enums';

const enumValues = <T extends Record<string, string>>(value: T) =>
  Object.values(value);

const stringProperty = (description?: string, values?: string[]) => ({
  type: 'string',
  ...(description ? { description } : {}),
  ...(values ? { enum: values } : {}),
});

const booleanProperty = () => ({ type: 'boolean' });
const numberProperty = () => ({ type: 'number' });

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string', format: 'uuid' },
};

const jsonResponse = (schema: Record<string, unknown>) => ({
  description: 'Successful response',
  content: {
    'application/json': {
      schema,
    },
  },
});

const requestBody = (schema: Record<string, unknown>) => ({
  required: true,
  content: {
    'application/json': {
      schema,
    },
  },
});

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Dealer Management API',
    version: '1.0.0',
    description:
      'Salesforce-style Customer Master backend based on the Notion customer account data model.',
  },
  servers: [{ url: '/' }],
  tags: [
    {
      name: 'Customer Accounts',
      description:
        'Customer master data, contacts, addresses, references, and hierarchy.',
    },
  ],
  paths: {
    '/': {
      get: {
        tags: ['Health'],
        summary: 'Service health',
        responses: {
          '200': jsonResponse({ $ref: '#/components/schemas/HealthResponse' }),
        },
      },
    },
    '/customer-accounts': {
      get: {
        tags: ['Customer Accounts'],
        summary: 'List customer accounts',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'customerCode', in: 'query', schema: { type: 'string' } },
          {
            name: 'accountType',
            in: 'query',
            schema: { type: 'string', enum: enumValues(AccountType) },
          },
          {
            name: 'customerSegment',
            in: 'query',
            schema: { type: 'string', enum: enumValues(CustomerSegment) },
          },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: enumValues(AccountStatus) },
          },
        ],
        responses: {
          '200': jsonResponse({
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerAccount' },
          }),
        },
      },
      post: {
        tags: ['Customer Accounts'],
        summary: 'Create a customer account',
        requestBody: requestBody({
          $ref: '#/components/schemas/CreateCustomerAccountRequest',
        }),
        responses: {
          '201': jsonResponse({ $ref: '#/components/schemas/CustomerAccount' }),
        },
      },
    },
    '/customer-accounts/upsert': {
      post: {
        tags: ['Customer Accounts'],
        summary:
          'Upsert by account number, customer code, or external reference',
        requestBody: requestBody({
          $ref: '#/components/schemas/UpsertCustomerAccountRequest',
        }),
        responses: {
          '201': jsonResponse({ $ref: '#/components/schemas/CustomerAccount' }),
        },
      },
    },
    '/customer-accounts/upsert/by-external-id/{sourceSystem}/{externalId}': {
      patch: {
        tags: ['Customer Accounts'],
        summary: 'Upsert by external system ID',
        parameters: [
          {
            name: 'sourceSystem',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'externalId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: requestBody({
          $ref: '#/components/schemas/CreateCustomerAccountRequest',
        }),
        responses: {
          '200': jsonResponse({ $ref: '#/components/schemas/CustomerAccount' }),
        },
      },
    },
    '/customer-accounts/by-code/{customerCode}': {
      get: {
        tags: ['Customer Accounts'],
        summary: 'Find customer account by business code',
        parameters: [
          {
            name: 'customerCode',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': jsonResponse({ $ref: '#/components/schemas/CustomerAccount' }),
        },
      },
    },
    '/customer-accounts/by-account-number/{accountNumber}': {
      get: {
        tags: ['Customer Accounts'],
        summary: 'Find customer account by CRM account number',
        parameters: [
          {
            name: 'accountNumber',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': jsonResponse({ $ref: '#/components/schemas/CustomerAccount' }),
        },
      },
    },
    '/customer-accounts/{id}': {
      get: {
        tags: ['Customer Accounts'],
        summary: 'Get customer account detail',
        parameters: [idParameter],
        responses: {
          '200': jsonResponse({ $ref: '#/components/schemas/CustomerAccount' }),
        },
      },
      put: {
        tags: ['Customer Accounts'],
        summary: 'Update customer account',
        parameters: [idParameter],
        requestBody: requestBody({
          $ref: '#/components/schemas/UpdateCustomerAccountRequest',
        }),
        responses: {
          '200': jsonResponse({ $ref: '#/components/schemas/CustomerAccount' }),
        },
      },
    },
    '/customer-accounts/{id}/status': {
      patch: {
        tags: ['Customer Accounts'],
        summary: 'Update account status',
        parameters: [idParameter],
        requestBody: requestBody({
          $ref: '#/components/schemas/UpdateAccountStatusRequest',
        }),
        responses: {
          '200': jsonResponse({ $ref: '#/components/schemas/CustomerAccount' }),
        },
      },
    },
    '/customer-accounts/{id}/contacts': {
      get: {
        tags: ['Customer Accounts'],
        summary: 'List contacts under an account',
        parameters: [idParameter],
        responses: {
          '200': jsonResponse({
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerContact' },
          }),
        },
      },
      post: {
        tags: ['Customer Accounts'],
        summary: 'Add contact under an account',
        parameters: [idParameter],
        requestBody: requestBody({
          $ref: '#/components/schemas/CustomerContact',
        }),
        responses: {
          '201': jsonResponse({ $ref: '#/components/schemas/CustomerContact' }),
        },
      },
    },
    '/customer-accounts/{id}/addresses': {
      get: {
        tags: ['Customer Accounts'],
        summary: 'List addresses under an account',
        parameters: [idParameter],
        responses: {
          '200': jsonResponse({
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerAddress' },
          }),
        },
      },
      post: {
        tags: ['Customer Accounts'],
        summary: 'Add address under an account',
        parameters: [idParameter],
        requestBody: requestBody({
          $ref: '#/components/schemas/CustomerAddress',
        }),
        responses: {
          '201': jsonResponse({ $ref: '#/components/schemas/CustomerAddress' }),
        },
      },
    },
    '/customer-accounts/{id}/children': {
      get: {
        tags: ['Customer Accounts'],
        summary: 'List direct child accounts',
        parameters: [idParameter],
        responses: {
          '200': jsonResponse({
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerAccount' },
          }),
        },
      },
    },
    '/customer-accounts/{id}/hierarchy': {
      get: {
        tags: ['Customer Accounts'],
        summary: 'Get account hierarchy tree',
        parameters: [idParameter],
        responses: {
          '200': jsonResponse({
            $ref: '#/components/schemas/AccountHierarchyNode',
          }),
        },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          service: stringProperty(),
          status: stringProperty(),
        },
      },
      CustomerAccount: {
        type: 'object',
        required: [
          'id',
          'accountNumber',
          'customerCode',
          'accountName',
          'accountKind',
          'customerSegment',
          'accountType',
          'status',
        ],
        properties: {
          id: stringProperty('Internal technical primary key'),
          accountNumber: stringProperty('CRM account number, e.g. ACC-000001'),
          customerCode: stringProperty('Unique dealer/customer business code'),
          accountName: stringProperty(),
          accountKind: stringProperty(undefined, enumValues(AccountKind)),
          customerSegment: stringProperty(
            undefined,
            enumValues(CustomerSegment),
          ),
          accountType: stringProperty(undefined, enumValues(AccountType)),
          status: stringProperty(undefined, enumValues(AccountStatus)),
          parentAccountId: stringProperty(),
          parentCustomerCode: stringProperty(),
          taxCode: stringProperty(),
          businessRegistrationNo: stringProperty(),
          phone: stringProperty(),
          email: stringProperty(),
          website: stringProperty(),
          industry: stringProperty(),
          regionCode: stringProperty(),
          territoryCode: stringProperty(),
          ownerUserId: stringProperty(),
          defaultBillingAddressId: stringProperty(),
          defaultShippingAddressId: stringProperty(),
          defaultBusinessLocationAddressId: stringProperty(),
          businessProfile: {
            $ref: '#/components/schemas/BusinessAccountProfile',
          },
          personProfile: {
            $ref: '#/components/schemas/PersonAccountProfile',
          },
          contacts: {
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerContact' },
          },
          addresses: {
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerAddress' },
          },
          externalReferences: {
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerExternalReference' },
          },
          classifications: {
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerClassification' },
          },
          relationships: {
            type: 'array',
            items: { $ref: '#/components/schemas/AccountRelationship' },
          },
          createdAt: stringProperty(),
          updatedAt: stringProperty(),
        },
      },
      CreateCustomerAccountRequest: {
        allOf: [
          { $ref: '#/components/schemas/CustomerAccountInput' },
          {
            type: 'object',
            required: [
              'customerCode',
              'accountName',
              'accountKind',
              'customerSegment',
              'accountType',
            ],
          },
        ],
      },
      UpdateCustomerAccountRequest: {
        $ref: '#/components/schemas/CustomerAccountInput',
      },
      CustomerAccountInput: {
        type: 'object',
        properties: {
          accountNumber: stringProperty(),
          customerCode: stringProperty(),
          accountName: stringProperty(),
          accountKind: stringProperty(undefined, enumValues(AccountKind)),
          customerSegment: stringProperty(
            undefined,
            enumValues(CustomerSegment),
          ),
          accountType: stringProperty(undefined, enumValues(AccountType)),
          status: stringProperty(undefined, enumValues(AccountStatus)),
          parentAccountId: stringProperty(),
          parentCustomerCode: stringProperty(),
          taxCode: stringProperty(),
          businessRegistrationNo: stringProperty(),
          phone: stringProperty(),
          email: stringProperty(),
          website: stringProperty(),
          industry: stringProperty(),
          regionCode: stringProperty(),
          territoryCode: stringProperty(),
          ownerUserId: stringProperty(),
          businessProfile: {
            $ref: '#/components/schemas/BusinessAccountProfile',
          },
          personProfile: {
            $ref: '#/components/schemas/PersonAccountProfile',
          },
          contacts: {
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerContact' },
          },
          addresses: {
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerAddress' },
          },
          externalReferences: {
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerExternalReference' },
          },
          classifications: {
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerClassification' },
          },
          relationships: {
            type: 'array',
            items: { $ref: '#/components/schemas/AccountRelationship' },
          },
        },
      },
      BusinessAccountProfile: {
        type: 'object',
        properties: {
          id: stringProperty(),
          accountId: stringProperty(),
          legalName: stringProperty(),
          taxCode: stringProperty(),
          businessRegistrationNo: stringProperty(),
          industry: stringProperty(),
          annualRevenue: numberProperty(),
          numberOfEmployees: { type: 'integer' },
          ownershipType: stringProperty(),
          paymentTerm: stringProperty(),
          creditLimit: numberProperty(),
          dealerTier: stringProperty(),
          dealerType: stringProperty(),
          regionCode: stringProperty(),
          territoryCode: stringProperty(),
        },
      },
      PersonAccountProfile: {
        type: 'object',
        required: ['firstName', 'lastName'],
        properties: {
          id: stringProperty(),
          accountId: stringProperty(),
          firstName: stringProperty(),
          lastName: stringProperty(),
          middleName: stringProperty(),
          salutation: stringProperty(),
          birthDate: stringProperty(),
          gender: stringProperty(),
          personalEmail: stringProperty(),
          personalMobile: stringProperty(),
          personalIdNumber: stringProperty(),
          loyaltyId: stringProperty(),
          consentStatus: stringProperty(),
          preferredChannel: stringProperty(),
        },
      },
      CustomerContact: {
        type: 'object',
        required: ['fullName'],
        properties: {
          id: stringProperty(),
          accountId: stringProperty(),
          contactCode: stringProperty(),
          firstName: stringProperty(),
          lastName: stringProperty(),
          fullName: stringProperty(),
          jobTitle: stringProperty(),
          department: stringProperty(),
          email: stringProperty(),
          phone: stringProperty(),
          mobile: stringProperty(),
          zalo: stringProperty(),
          contactRole: stringProperty(undefined, enumValues(ContactRole)),
          isPrimary: booleanProperty(),
          isDecisionMaker: booleanProperty(),
          status: stringProperty(undefined, enumValues(RecordStatus)),
        },
      },
      CustomerAddress: {
        type: 'object',
        required: ['addressType', 'line1', 'country'],
        properties: {
          id: stringProperty(),
          accountId: stringProperty(),
          addressType: stringProperty(undefined, enumValues(AddressType)),
          addressName: stringProperty(),
          line1: stringProperty(),
          line2: stringProperty(),
          ward: stringProperty(),
          district: stringProperty(),
          province: stringProperty(),
          country: stringProperty(),
          postalCode: stringProperty(),
          countryCode: stringProperty(),
          stateCode: stringProperty(),
          latitude: numberProperty(),
          longitude: numberProperty(),
          recipientName: stringProperty(),
          recipientPhone: stringProperty(),
          isDefault: booleanProperty(),
          status: stringProperty(undefined, enumValues(RecordStatus)),
          effectiveFrom: stringProperty(),
          effectiveTo: stringProperty(),
        },
      },
      AccountRelationship: {
        type: 'object',
        required: ['relationshipType'],
        properties: {
          id: stringProperty(),
          fromAccountId: stringProperty(),
          fromCustomerCode: stringProperty(),
          toAccountId: stringProperty(),
          toCustomerCode: stringProperty(),
          relationshipType: stringProperty(
            undefined,
            enumValues(AccountRelationshipType),
          ),
          direction: stringProperty(undefined, [
            'CHILD_TO_PARENT',
            'PARENT_TO_CHILD',
          ]),
          isPrimary: booleanProperty(),
          status: stringProperty(undefined, enumValues(RecordStatus)),
          effectiveFrom: stringProperty(),
          effectiveTo: stringProperty(),
        },
      },
      CustomerExternalReference: {
        type: 'object',
        required: ['sourceSystem', 'externalId'],
        properties: {
          id: stringProperty(),
          accountId: stringProperty(),
          sourceSystem: stringProperty(),
          externalId: stringProperty(),
          externalCode: stringProperty(),
          isPrimary: booleanProperty(),
          status: stringProperty(undefined, enumValues(RecordStatus)),
          lastSyncedAt: stringProperty(),
        },
      },
      CustomerClassification: {
        type: 'object',
        required: ['classificationType', 'classificationCode'],
        properties: {
          id: stringProperty(),
          accountId: stringProperty(),
          classificationType: stringProperty(
            undefined,
            enumValues(ClassificationType),
          ),
          classificationCode: stringProperty(),
          classificationName: stringProperty(),
          isPrimary: booleanProperty(),
          effectiveFrom: stringProperty(),
          effectiveTo: stringProperty(),
        },
      },
      UpsertCustomerAccountRequest: {
        type: 'object',
        required: ['lookup', 'data'],
        properties: {
          lookup: {
            type: 'object',
            properties: {
              accountNumber: stringProperty(),
              customerCode: stringProperty(),
              externalReference: {
                type: 'object',
                properties: {
                  sourceSystem: stringProperty(),
                  externalId: stringProperty(),
                },
              },
            },
          },
          data: { $ref: '#/components/schemas/CustomerAccountInput' },
        },
      },
      UpdateAccountStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: stringProperty(undefined, enumValues(AccountStatus)),
        },
      },
      AccountHierarchyNode: {
        type: 'object',
        properties: {
          accountId: stringProperty(),
          accountNumber: stringProperty(),
          customerCode: stringProperty(),
          accountName: stringProperty(),
          accountType: stringProperty(undefined, enumValues(AccountType)),
          customerSegment: stringProperty(
            undefined,
            enumValues(CustomerSegment),
          ),
          status: stringProperty(undefined, enumValues(AccountStatus)),
          relationshipType: stringProperty(),
          level: { type: 'integer' },
          path: stringProperty(),
          children: {
            type: 'array',
            items: { $ref: '#/components/schemas/AccountHierarchyNode' },
          },
        },
      },
    },
  },
} as const;
