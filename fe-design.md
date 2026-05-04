Design a modern enterprise web application UI for a “Dealer / Customer Code Management” module.

The product is a Salesforce-style Customer Master system for managing dealer/customer codes as the main business key for CRM integration.

Context:
The company currently manages dealer/customer codes in Excel. The Excel file contains sheets such as:

- CODE sheet with columns: EVERON, ARTEMIS, KINGKOIL, GROUP, LEVEL, Agent
- Dealer detail sheet with fields: Agent Code, Agent Name, Loại, Group, Parent Code, Target 2026, % Achievement, Sales, Collection, Actual Balance, Limit Debit, Clear Balance
- Other sheets include sales, collection, invoice, balance, and historical transaction details.

The new system should replace Excel-based code management with a centralized CRM-ready customer master module.

Design style:

- Clean enterprise SaaS style
- Inspired by Salesforce Lightning UI
- Professional, data-heavy, CRM-style layout
- White background, subtle gray borders, blue primary actions
- Use cards, data tables, tabs, filters, side panels, badges, and status indicators
- Desktop-first responsive web app
- Suitable for internal sales, finance, CRM admin, and data management teams

Core concept:
The module must support Salesforce-style Account-based customer management:

- Business Accounts for dealers, distributors, showrooms, branches, partners, B2B customers
- Person Accounts for individual B2C customers
- Dealer/customer code as unique business code
- Account Number as CRM account reference number
- External ID mapping for future system integration
- Parent/child account hierarchy for dealer groups, branches, regions, and head office relationships
- Contact person management under each dealer/customer
- Address management: billing address, shipping address, business location
- Customer classification: dealer, showroom, B2B, B2C, online, partner, inactive customer
- Future integration with sales activities, customer contacts, order history, receivables, service history, marketing activities, KiotViet, E-Invoice, and internal systems

Main screens to design:

1. Dealer / Customer List Screen
   Create a full page with:

- Page title: “Dealer / Customer Master”
- Subtitle: “Centralized customer code management for CRM integration”
- KPI cards at the top:
  - Total Customers
  - Active Dealers
  - Duplicate Code Alerts
  - Pending Imports
  - Missing Parent Mapping
- Search bar: “Search by code, name, phone, tax code, external ID”
- Advanced filters:
  - Account Type: Dealer, Showroom, Distributor, Partner, Online Customer, Individual
  - Account Party Type: Organization, Person
  - Segment: B2B, B2C
  - Status: Active, Inactive, Pending, Suspended
  - Brand: Everon, Artemis, Kingkoil, Edelin, Curtain, Lite
  - Group: A+, A, B+, B, Other
  - Region / Territory
  - Has Parent / Missing Parent
  - Has External ID / Missing External ID
- Data table columns:
  - Dealer/Customer Code
  - Account Number
  - Account Name
  - Account Party Type
  - Segment
  - Account Type
  - Group
  - Parent Code
  - Brand Codes
  - Primary Contact
  - Phone
  - Region
  - Status
  - Last Updated
  - Actions
- Row actions:
  - View
  - Edit
  - Validate Code
  - View Hierarchy
  - Deactivate

2. Search and Filter Experience
   Design an expanded filter drawer or right-side panel with:

- Text search
- Code matching mode: Exact, Contains, Starts with
- Duplicate detection toggle
- Missing required fields toggle
- Parent mapping status
- External system mapping status
- Date range for created/updated date
- Apply / Reset buttons
  Show active filter chips above the table.

3. Create Dealer / Customer Screen
   Design a multi-step create form:
   Step 1: Account Type

- Business Account or Person Account selection cards
- Business Account: Dealer, Showroom, Distributor, Partner, Corporate Customer
- Person Account: Individual, Online Customer, B2C Customer

Step 2: Basic Information
Fields:

- Dealer/Customer Code
- Account Number
- Account Name
- Account Party Type
- Customer Segment
- Account Type
- Status
- Group / Level
- Brand Code Mapping:
  - Everon Code
  - Artemis Code
  - Kingkoil Code
  - Edelin Code
  - Curtain Code
  - Lite Code

Step 3: Business Profile or Person Profile
For Business Account:

- Legal Name
- Tax Code
- Business Registration Number
- Industry
- Dealer Tier
- Dealer Type
- Region
- Territory
- Credit Limit
- Payment Term

For Person Account:

- First Name
- Last Name
- Mobile
- Email
- Birth Date
- Gender
- Loyalty ID
- Preferred Channel

Step 4: Parent / Relationship
Fields:

- Parent Customer Code
- Parent Account Name
- Relationship Type:
  - Parent Child
  - Head Office Branch
  - Group Member
  - Region Member
  - Bill To
  - Ship To
  - Managed By
- Show a small hierarchy preview tree

Step 5: Contact and Address
Contact fields:

- Full Name
- Role
- Email
- Mobile
- Is Primary Contact

Address cards:

- Billing Address
- Shipping Address
- Business Location
- Showroom / Warehouse / Branch

Step 6: External Integration
External references:

- Source System: CRM, ERP, KiotViet, E-Invoice, POS, DMS, Loyalty
- External ID
- External Code
- Is Primary
- Last Synced At

Step 7: Review and Submit

- Summary card
- Validation checklist
- Duplicate code warning
- Missing required field warning
- Submit button

4. Edit Dealer / Customer Screen
   Use tabbed layout:

- Overview
- Codes & Classifications
- Business / Person Profile
- Contacts
- Addresses
- Parent & Relationships
- External IDs
- Audit History

Include a sticky right-side validation panel:

- Code uniqueness
- Missing required fields
- Parent mapping status
- External ID status
- Duplicate brand code alerts

5. Detail View Screen
   Design a Salesforce-style record detail page:

- Header with account name, customer code, account number, status badge
- Quick actions: Edit, Deactivate, Validate, Import History, Sync to CRM
- Highlight panel:
  - Customer Code
  - Account Number
  - Account Type
  - Segment
  - Parent Code
  - Primary Contact
  - Region
  - Status
- Tabs:
  - Details
  - Related Contacts
  - Addresses
  - Relationships
  - Sales Activities
  - Order History
  - Receivables
  - Service History
  - Marketing Activities
  - External System Mapping
  - Audit Log
- Include a hierarchy tree component showing parent and child accounts
- Include integration status cards for KiotViet, E-Invoice, ERP, CRM

6. Excel Import Screen
   Design an import workflow:
   Step 1: Upload Excel

- Drag-and-drop area
- Supported format: .xlsx
- Template download button

Step 2: Sheet Selection

- Show detected sheets:
  - CODE
  - DAILY
  - TOTAL
  - Dealer detail sheets
- Allow user to select the target sheet for dealer/customer code import

Step 3: Field Mapping
Show mapping table:

- Excel Column
- Sample Value
- Target Field
- Required
- Transformation Rule
  Example mappings:
- EVERON -> brandCodes.everonCode
- ARTEMIS -> brandCodes.artemisCode
- KINGKOIL -> brandCodes.kingkoilCode
- GROUP -> groupCode
- LEVEL -> levelCode
- Agent -> accountName or businessLocationName
- Agent Code -> customerCode
- Agent Name -> accountName
- Loại -> accountType
- Parent Code -> parentCustomerCode

Step 4: Validation Result
Show validation summary:

- Total rows
- Valid rows
- Duplicate customer codes
- Duplicate brand codes
- Missing account name
- Missing customer code
- Missing parent account
- Invalid status
- Invalid account type
- Rows with warnings
- Rows with errors

Create a validation table with:

- Row Number
- Customer Code
- Account Name
- Issue Type
- Severity
- Message
- Suggested Fix
- Action

Step 5: Import Preview and Commit

- Show preview of records to create/update/skip
- Buttons: Import Valid Rows, Download Error Report, Cancel

7. Duplicate Code Validation Screen / Modal
   Design a modal or dedicated screen:

- Search code input
- Code type selector:
  - Customer Code
  - Account Number
  - Everon Code
  - Artemis Code
  - Kingkoil Code
  - External ID
- Validation result states:
  - Available
  - Duplicate Found
  - Similar Codes Found
  - Existing Inactive Account
  - Exists in External System
- If duplicate is found, show matching records table:
  - Customer Code
  - Account Name
  - Account Number
  - Status
  - Parent Code
  - Source System
  - Last Updated
  - Action: View / Merge / Use Existing

8. Integration Mapping Screen
   Design a screen for CRM integration readiness:

- External System cards:
  - CRM
  - ERP
  - KiotViet
  - E-Invoice
  - POS
  - DMS
  - Loyalty
- For each system show:
  - Connection Status
  - External ID Coverage
  - Last Sync
  - Failed Records
  - Sync Direction
- Mapping table:
  - Internal Field
  - External System
  - External Field
  - Required
  - Transformation
  - Sync Direction
  - Status

Important UX requirements:

- Make dealer/customer code visually prominent because it is the main business key.
- Show validation warnings clearly.
- Make duplicate detection easy to understand.
- Support Excel import as a first-class workflow.
- Make parent-child hierarchy visible.
- Separate Business Account and Person Account fields.
- Use Salesforce-inspired layout but do not copy Salesforce branding.
- Use consistent enterprise UI components.

Deliverables:
Generate a high-fidelity desktop web UI with multiple screens and components. Use clear labels, realistic sample data from Vietnamese dealer/customer context, and CRM-style terminology.
