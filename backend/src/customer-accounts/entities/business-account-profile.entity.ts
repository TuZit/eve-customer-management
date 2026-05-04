export class BusinessAccountProfileEntity {
  id!: number;
  publicId!: Buffer;
  accountId!: number;
  accountKind!: 'ORGANIZATION';
  legalName?: string | null;
  taxCode?: string | null;
  businessRegistrationNo?: string | null;
  industry?: string | null;
  annualRevenue?: number | null;
  numberOfEmployees?: number | null;
  ownershipType?: string | null;
  paymentTerm?: string | null;
  creditLimit?: number | null;
  dealerTier?: string | null;
  dealerType?: string | null;
  regionCode?: string | null;
  territoryCode?: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
