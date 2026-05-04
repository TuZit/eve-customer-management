-- Salesforce-style Customer Master Data schema.
-- Target: MySQL 8.0.16+ / InnoDB / utf8mb4.
-- Use UUID_TO_BIN(uuid, TRUE) / BIN_TO_UUID(public_id, TRUE) at the app boundary.

SET NAMES utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE customer_account (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id BINARY(16) NOT NULL,
  account_number VARCHAR(32) NOT NULL,
  customer_code VARCHAR(64) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_kind VARCHAR(32) NOT NULL,
  customer_segment VARCHAR(16) NOT NULL,
  account_type VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  parent_account_id BIGINT UNSIGNED NULL,
  parent_customer_code VARCHAR(64) NULL,
  phone VARCHAR(50) NULL,
  email VARCHAR(255) NULL,
  website VARCHAR(255) NULL,
  owner_user_id VARCHAR(64) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  created_by VARCHAR(64) NULL,
  updated_by VARCHAR(64) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_account_public_id (public_id),
  UNIQUE KEY uq_customer_account_account_number (account_number),
  UNIQUE KEY uq_customer_account_customer_code (customer_code),
  UNIQUE KEY uq_customer_account_id_kind (id, account_kind),
  KEY idx_customer_account_parent_account_id (parent_account_id),
  KEY idx_customer_account_parent_customer_code (parent_customer_code),
  KEY idx_customer_account_segment_status (customer_segment, status),
  KEY idx_customer_account_type_status (account_type, status),
  KEY idx_customer_account_owner_status (owner_user_id, status),
  CONSTRAINT fk_customer_account_parent
    FOREIGN KEY (parent_account_id) REFERENCES customer_account (id)
    ON DELETE SET NULL,
  CONSTRAINT ck_customer_account_kind
    CHECK (account_kind IN ('ORGANIZATION', 'PERSON')),
  CONSTRAINT ck_customer_account_segment
    CHECK (customer_segment IN ('B2B', 'B2C')),
  CONSTRAINT ck_customer_account_type
    CHECK (account_type IN (
      'DEALER',
      'SHOWROOM',
      'B2B_CUSTOMER',
      'B2C_CUSTOMER',
      'ONLINE_CUSTOMER',
      'PARTNER',
      'INDIVIDUAL',
      'COMPANY'
    )),
  CONSTRAINT ck_customer_account_status
    CHECK (status IN ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE business_account_profile (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id BINARY(16) NOT NULL,
  account_id BIGINT UNSIGNED NOT NULL,
  account_kind VARCHAR(32) NOT NULL DEFAULT 'ORGANIZATION',
  legal_name VARCHAR(255) NULL,
  tax_code VARCHAR(64) NULL,
  business_registration_no VARCHAR(64) NULL,
  industry VARCHAR(128) NULL,
  annual_revenue DECIMAL(18, 2) NULL,
  number_of_employees INT UNSIGNED NULL,
  ownership_type VARCHAR(64) NULL,
  payment_term VARCHAR(64) NULL,
  credit_limit DECIMAL(18, 2) NULL,
  dealer_tier VARCHAR(64) NULL,
  dealer_type VARCHAR(64) NULL,
  region_code VARCHAR(64) NULL,
  territory_code VARCHAR(64) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_business_account_profile_public_id (public_id),
  UNIQUE KEY uq_business_account_profile_account_id (account_id),
  KEY idx_business_account_profile_tax_code (tax_code),
  KEY idx_business_account_profile_region_territory (region_code, territory_code),
  KEY idx_business_account_profile_account_kind (account_id, account_kind),
  CONSTRAINT fk_business_account_profile_account
    FOREIGN KEY (account_id) REFERENCES customer_account (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_business_account_profile_account_kind
    FOREIGN KEY (account_id, account_kind) REFERENCES customer_account (id, account_kind)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE person_account_profile (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id BINARY(16) NOT NULL,
  account_id BIGINT UNSIGNED NOT NULL,
  account_kind VARCHAR(32) NOT NULL DEFAULT 'PERSON',
  first_name VARCHAR(128) NOT NULL,
  last_name VARCHAR(128) NOT NULL,
  middle_name VARCHAR(128) NULL,
  salutation VARCHAR(32) NULL,
  birth_date DATE NULL,
  gender VARCHAR(32) NULL,
  personal_email VARCHAR(255) NULL,
  personal_mobile VARCHAR(50) NULL,
  personal_id_number VARCHAR(64) NULL,
  loyalty_id VARCHAR(64) NULL,
  consent_status VARCHAR(64) NULL,
  preferred_channel VARCHAR(64) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_person_account_profile_public_id (public_id),
  UNIQUE KEY uq_person_account_profile_account_id (account_id),
  UNIQUE KEY uq_person_account_profile_loyalty_id (loyalty_id),
  KEY idx_person_account_profile_mobile (personal_mobile),
  KEY idx_person_account_profile_email (personal_email),
  KEY idx_person_account_profile_account_kind (account_id, account_kind),
  CONSTRAINT fk_person_account_profile_account
    FOREIGN KEY (account_id) REFERENCES customer_account (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_person_account_profile_account_kind
    FOREIGN KEY (account_id, account_kind) REFERENCES customer_account (id, account_kind)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE customer_contact (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id BINARY(16) NOT NULL,
  account_id BIGINT UNSIGNED NOT NULL,
  contact_code VARCHAR(64) NULL,
  first_name VARCHAR(128) NULL,
  last_name VARCHAR(128) NULL,
  full_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(128) NULL,
  department VARCHAR(128) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  mobile VARCHAR(50) NULL,
  zalo VARCHAR(50) NULL,
  contact_role VARCHAR(32) NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  is_decision_maker BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
  active_primary_contact_account_id BIGINT UNSIGNED
    GENERATED ALWAYS AS (
      CASE WHEN status = 'ACTIVE' AND is_primary = TRUE THEN account_id ELSE NULL END
    ) STORED,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_contact_public_id (public_id),
  UNIQUE KEY uq_customer_contact_contact_code (contact_code),
  UNIQUE KEY uq_customer_contact_active_primary (active_primary_contact_account_id),
  KEY idx_customer_contact_account_status (account_id, status),
  KEY idx_customer_contact_email (email),
  KEY idx_customer_contact_mobile (mobile),
  CONSTRAINT fk_customer_contact_account
    FOREIGN KEY (account_id) REFERENCES customer_account (id),
  CONSTRAINT ck_customer_contact_role
    CHECK (contact_role IS NULL OR contact_role IN (
      'OWNER', 'PURCHASING', 'ACCOUNTING', 'TECHNICAL', 'SALES', 'WAREHOUSE', 'OTHER'
    )),
  CONSTRAINT ck_customer_contact_status
    CHECK (status IN ('ACTIVE', 'INACTIVE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE customer_address (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id BINARY(16) NOT NULL,
  account_id BIGINT UNSIGNED NOT NULL,
  address_type VARCHAR(32) NOT NULL,
  address_name VARCHAR(128) NULL,
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255) NULL,
  ward VARCHAR(128) NULL,
  district VARCHAR(128) NULL,
  province VARCHAR(128) NULL,
  country VARCHAR(64) NOT NULL,
  postal_code VARCHAR(32) NULL,
  country_code VARCHAR(8) NULL,
  state_code VARCHAR(32) NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  recipient_name VARCHAR(255) NULL,
  recipient_phone VARCHAR(50) NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
  effective_from DATE NULL,
  effective_to DATE NULL,
  active_default_address_account_id BIGINT UNSIGNED
    GENERATED ALWAYS AS (
      CASE WHEN status = 'ACTIVE' AND is_default = TRUE THEN account_id ELSE NULL END
    ) STORED,
  active_default_address_type VARCHAR(32)
    GENERATED ALWAYS AS (
      CASE WHEN status = 'ACTIVE' AND is_default = TRUE THEN address_type ELSE NULL END
    ) STORED,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_address_public_id (public_id),
  UNIQUE KEY uq_customer_address_id_account_type (id, account_id, address_type),
  UNIQUE KEY uq_customer_address_active_default_type (
    active_default_address_account_id,
    active_default_address_type
  ),
  KEY idx_customer_address_account_type_status (account_id, address_type, status),
  KEY idx_customer_address_province_district (province, district),
  CONSTRAINT fk_customer_address_account
    FOREIGN KEY (account_id) REFERENCES customer_account (id),
  CONSTRAINT ck_customer_address_type
    CHECK (address_type IN (
      'BILLING',
      'SHIPPING',
      'BUSINESS_LOCATION',
      'REGISTERED_OFFICE',
      'WAREHOUSE',
      'SHOWROOM',
      'BRANCH',
      'OTHER'
    )),
  CONSTRAINT ck_customer_address_status
    CHECK (status IN ('ACTIVE', 'INACTIVE')),
  CONSTRAINT ck_customer_address_effective_range
    CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE customer_external_reference (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id BINARY(16) NOT NULL,
  account_id BIGINT UNSIGNED NOT NULL,
  source_system VARCHAR(64) NOT NULL,
  external_id VARCHAR(128) NOT NULL,
  external_code VARCHAR(128) NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
  last_synced_at DATETIME(3) NULL,
  active_primary_reference_account_id BIGINT UNSIGNED
    GENERATED ALWAYS AS (
      CASE WHEN status = 'ACTIVE' AND is_primary = TRUE THEN account_id ELSE NULL END
    ) STORED,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_external_reference_public_id (public_id),
  UNIQUE KEY uq_customer_external_reference_source_external (source_system, external_id),
  UNIQUE KEY uq_customer_external_reference_active_primary_source (
    active_primary_reference_account_id,
    source_system
  ),
  KEY idx_customer_external_reference_account_source (account_id, source_system),
  CONSTRAINT fk_customer_external_reference_account
    FOREIGN KEY (account_id) REFERENCES customer_account (id),
  CONSTRAINT ck_customer_external_reference_status
    CHECK (status IN ('ACTIVE', 'INACTIVE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE customer_classification (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id BINARY(16) NOT NULL,
  account_id BIGINT UNSIGNED NOT NULL,
  classification_type VARCHAR(32) NOT NULL,
  classification_code VARCHAR(64) NOT NULL,
  classification_name VARCHAR(128) NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  effective_from DATE NULL,
  effective_to DATE NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_classification_public_id (public_id),
  UNIQUE KEY uq_customer_classification_account_type_code (
    account_id,
    classification_type,
    classification_code
  ),
  KEY idx_customer_classification_type_code (classification_type, classification_code),
  CONSTRAINT fk_customer_classification_account
    FOREIGN KEY (account_id) REFERENCES customer_account (id)
    ON DELETE CASCADE,
  CONSTRAINT ck_customer_classification_type
    CHECK (classification_type IN (
      'CUSTOMER_TYPE', 'CHANNEL', 'SEGMENT', 'STATUS_TAG', 'PARTNER_TYPE'
    )),
  CONSTRAINT ck_customer_classification_effective_range
    CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE account_relationship (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id BINARY(16) NOT NULL,
  from_account_id BIGINT UNSIGNED NOT NULL,
  from_customer_code VARCHAR(64) NULL,
  to_account_id BIGINT UNSIGNED NOT NULL,
  to_customer_code VARCHAR(64) NULL,
  relationship_type VARCHAR(32) NOT NULL,
  direction VARCHAR(32) NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
  effective_from DATE NULL,
  effective_to DATE NULL,
  effective_from_key DATE
    GENERATED ALWAYS AS (COALESCE(effective_from, '1000-01-01')) STORED,
  active_primary_parent_child_account_id BIGINT UNSIGNED
    GENERATED ALWAYS AS (
      CASE
        WHEN status = 'ACTIVE'
          AND is_primary = TRUE
          AND relationship_type = 'PARENT_CHILD'
          AND direction = 'CHILD_TO_PARENT'
        THEN from_account_id
        ELSE NULL
      END
    ) STORED,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_account_relationship_public_id (public_id),
  UNIQUE KEY uq_account_relationship_pair_type (
    from_account_id,
    to_account_id,
    relationship_type,
    effective_from_key
  ),
  UNIQUE KEY uq_account_relationship_active_primary_parent_child (
    active_primary_parent_child_account_id
  ),
  KEY idx_account_relationship_to_type_status (to_account_id, relationship_type, status),
  KEY idx_account_relationship_from_type_status (from_account_id, relationship_type, status),
  CONSTRAINT fk_account_relationship_from_account
    FOREIGN KEY (from_account_id) REFERENCES customer_account (id),
  CONSTRAINT fk_account_relationship_to_account
    FOREIGN KEY (to_account_id) REFERENCES customer_account (id),
  CONSTRAINT ck_account_relationship_type
    CHECK (relationship_type IN (
      'PARENT_CHILD',
      'HEAD_OFFICE_BRANCH',
      'GROUP_MEMBER',
      'REGION_MEMBER',
      'BILL_TO',
      'SHIP_TO',
      'MANAGED_BY'
    )),
  CONSTRAINT ck_account_relationship_direction
    CHECK (direction IS NULL OR direction IN ('CHILD_TO_PARENT', 'PARENT_TO_CHILD')),
  CONSTRAINT ck_account_relationship_parent_child_direction
    CHECK (relationship_type <> 'PARENT_CHILD' OR direction = 'CHILD_TO_PARENT'),
  CONSTRAINT ck_account_relationship_status
    CHECK (status IN ('ACTIVE', 'INACTIVE')),
  CONSTRAINT ck_account_relationship_effective_range
    CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
