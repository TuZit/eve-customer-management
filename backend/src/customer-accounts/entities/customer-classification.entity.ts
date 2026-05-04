import { ClassificationType } from '../customer-account.enums';

export class CustomerClassificationEntity {
  id!: number;
  publicId!: Buffer;
  accountId!: number;
  classificationType!: ClassificationType;
  classificationCode!: string;
  classificationName?: string | null;
  isPrimary!: boolean;
  effectiveFrom?: Date | null;
  effectiveTo?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
