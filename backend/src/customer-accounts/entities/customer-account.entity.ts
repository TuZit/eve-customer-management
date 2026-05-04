import {
  AccountKind,
  AccountStatus,
  AccountType,
  CustomerSegment,
} from '../customer-account.enums';
import type { AccountRelationshipEntity } from './account-relationship.entity';
import type { BusinessAccountProfileEntity } from './business-account-profile.entity';
import type { CustomerAddressEntity } from './customer-address.entity';
import type { CustomerClassificationEntity } from './customer-classification.entity';
import type { CustomerContactEntity } from './customer-contact.entity';
import type { CustomerExternalReferenceEntity } from './customer-external-reference.entity';
import type { PersonAccountProfileEntity } from './person-account-profile.entity';

export class CustomerAccountEntity {
  id!: number;
  publicId!: Buffer;
  accountNumber!: string;
  customerCode!: string;
  accountName!: string;
  accountKind!: AccountKind;
  customerSegment!: CustomerSegment;
  accountType!: AccountType;
  status!: AccountStatus;
  parentAccountId?: number | null;
  parentCustomerCode?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  ownerUserId?: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  parentAccount?: CustomerAccountEntity | null;
  businessProfile?: BusinessAccountProfileEntity | null;
  personProfile?: PersonAccountProfileEntity | null;
  contacts?: CustomerContactEntity[];
  addresses?: CustomerAddressEntity[];
  externalReferences?: CustomerExternalReferenceEntity[];
  classifications?: CustomerClassificationEntity[];
  relationshipsFrom?: AccountRelationshipEntity[];
  relationshipsTo?: AccountRelationshipEntity[];
}
