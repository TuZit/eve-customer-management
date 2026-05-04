export class PersonAccountProfileEntity {
  id!: number;
  publicId!: Buffer;
  accountId!: number;
  accountKind!: 'PERSON';
  firstName!: string;
  lastName!: string;
  middleName?: string | null;
  salutation?: string | null;
  birthDate?: Date | null;
  gender?: string | null;
  personalEmail?: string | null;
  personalMobile?: string | null;
  personalIdNumber?: string | null;
  loyaltyId?: string | null;
  consentStatus?: string | null;
  preferredChannel?: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
