import { RecordStatus } from '../customer-account.enums';

export class CustomerExternalReferenceEntity {
  id!: number;
  publicId!: Buffer;
  accountId!: number;
  sourceSystem!: string;
  externalId!: string;
  externalCode?: string | null;
  isPrimary!: boolean;
  status!: RecordStatus;
  lastSyncedAt?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
