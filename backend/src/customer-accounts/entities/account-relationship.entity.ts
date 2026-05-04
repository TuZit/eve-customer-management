import {
  AccountRelationshipType,
  RecordStatus,
} from '../customer-account.enums';

export type AccountRelationshipDirection =
  | 'CHILD_TO_PARENT'
  | 'PARENT_TO_CHILD';

export class AccountRelationshipEntity {
  id!: number;
  publicId!: Buffer;
  fromAccountId!: number;
  fromCustomerCode?: string | null;
  toAccountId!: number;
  toCustomerCode?: string | null;
  relationshipType!: AccountRelationshipType;
  direction?: AccountRelationshipDirection | null;
  isPrimary!: boolean;
  status!: RecordStatus;
  effectiveFrom?: Date | null;
  effectiveTo?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
