import { ContactRole, RecordStatus } from '../customer-account.enums';

export class CustomerContactEntity {
  id!: number;
  publicId!: Buffer;
  accountId!: number;
  contactCode?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName!: string;
  jobTitle?: string | null;
  department?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  zalo?: string | null;
  contactRole?: ContactRole | null;
  isPrimary!: boolean;
  isDecisionMaker!: boolean;
  status!: RecordStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
