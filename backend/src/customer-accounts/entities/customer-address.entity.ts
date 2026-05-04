import { AddressType, RecordStatus } from '../customer-account.enums';

export class CustomerAddressEntity {
  id!: number;
  publicId!: Buffer;
  accountId!: number;
  addressType!: AddressType;
  addressName?: string | null;
  line1!: string;
  line2?: string | null;
  ward?: string | null;
  district?: string | null;
  province?: string | null;
  country!: string;
  postalCode?: string | null;
  countryCode?: string | null;
  stateCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  recipientName?: string | null;
  recipientPhone?: string | null;
  isDefault!: boolean;
  status!: RecordStatus;
  effectiveFrom?: Date | null;
  effectiveTo?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
