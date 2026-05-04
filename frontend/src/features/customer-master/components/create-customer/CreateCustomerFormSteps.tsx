import { Alert, Card, Col, Descriptions, Form, Input, InputNumber, Radio, Row, Select, Tree } from 'antd'
import {
  accountTypeOptions,
  brandSystems,
  contactRoleOptions,
  groupOptions,
  integrationSystems,
  relationshipTypeOptions,
  statusOptions,
} from '../../../../constants/customerMaster'

export function AccountKindStep() {
  return (
    <Form.Item name="accountKind" noStyle>
      <Radio.Group className="account-kind-grid">
        <Radio.Button value="ORGANIZATION">Business Account</Radio.Button>
        <Radio.Button value="PERSON">Person Account</Radio.Button>
      </Radio.Group>
    </Form.Item>
  )
}

export function BasicInformationStep() {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="Dealer / Customer Code" name="customerCode" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Account Number" name="accountNumber">
          <Input placeholder="Auto if empty" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Account Name" name="accountName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Party Type" name="accountKind" rules={[{ required: true }]}>
          <Select
            options={[
              { label: 'Organization', value: 'ORGANIZATION' },
              { label: 'Person', value: 'PERSON' },
            ]}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Customer Segment" name="customerSegment" rules={[{ required: true }]}>
          <Select
            options={[
              { label: 'B2B', value: 'B2B' },
              { label: 'B2C', value: 'B2C' },
            ]}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Account Type" name="accountType" rules={[{ required: true }]}>
          <Select options={accountTypeOptions} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Status" name="status">
          <Select options={statusOptions} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Group / Level" name="groupCode">
          <Select options={groupOptions} />
        </Form.Item>
      </Col>
      {brandSystems.map((brand) => (
        <Col span={8} key={brand}>
          <Form.Item label={`${brand} Code`} name={`brand${brand}`}>
            <Input />
          </Form.Item>
        </Col>
      ))}
    </Row>
  )
}

export function BusinessProfileStep() {
  return (
    <Row gutter={16}>
      <Col span={12}><Form.Item label="Legal Name" name="legalName"><Input /></Form.Item></Col>
      <Col span={12}><Form.Item label="Tax Code" name="taxCode"><Input /></Form.Item></Col>
      <Col span={12}><Form.Item label="Business Registration Number" name="businessRegistrationNo"><Input /></Form.Item></Col>
      <Col span={12}><Form.Item label="Industry" name="industry"><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="Dealer Tier" name="groupCode"><Select options={groupOptions} /></Form.Item></Col>
      <Col span={8}><Form.Item label="Dealer Type" name="dealerType"><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="Region" name="regionCode"><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="Territory" name="territoryCode"><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="Credit Limit" name="creditLimit"><InputNumber className="full-width" min={0} /></Form.Item></Col>
      <Col span={8}><Form.Item label="Payment Term" name="paymentTerm"><Input /></Form.Item></Col>
    </Row>
  )
}

export function PersonProfileStep() {
  return (
    <Row gutter={16}>
      <Col span={8}><Form.Item label="First Name" name="firstName" rules={[{ required: true }]}><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="Mobile" name="mobile"><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="Email" name="email"><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="Birth Date" name="birthDate"><Input placeholder="YYYY-MM-DD" /></Form.Item></Col>
      <Col span={8}><Form.Item label="Gender" name="gender"><Select allowClear options={['Female', 'Male', 'Other'].map((value) => ({ label: value, value }))} /></Form.Item></Col>
      <Col span={8}><Form.Item label="Loyalty ID" name="loyaltyId"><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="Preferred Channel" name="preferredChannel"><Input /></Form.Item></Col>
    </Row>
  )
}

export function RelationshipStep() {
  return (
    <Row gutter={16}>
      <Col span={12}><Form.Item label="Parent Customer Code" name="parentCustomerCode"><Input /></Form.Item></Col>
      <Col span={12}><Form.Item label="Relationship Type" name="relationshipType"><Select options={relationshipTypeOptions} /></Form.Item></Col>
      <Col span={24}>
        <Card size="small" title="Hierarchy preview">
          <Tree treeData={[{ title: 'Parent account', key: 'parent', children: [{ title: 'New customer account', key: 'new' }] }]} defaultExpandAll />
        </Card>
      </Col>
    </Row>
  )
}

export function ContactAddressStep() {
  return (
    <Row gutter={16}>
      <Col span={8}><Form.Item label="Contact Full Name" name="contactFullName"><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="Role" name="contactRole"><Select allowClear options={contactRoleOptions} /></Form.Item></Col>
      <Col span={8}><Form.Item label="Mobile" name="contactMobile"><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="Email" name="contactEmail"><Input /></Form.Item></Col>
      <Col span={16}><Form.Item label="Billing Address" name="billingLine1"><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="District" name="billingDistrict"><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="Province" name="billingProvince"><Input /></Form.Item></Col>
    </Row>
  )
}

export function ExternalIntegrationStep() {
  return (
    <Row gutter={16}>
      <Col span={8}><Form.Item label="Source System" name="sourceSystem"><Select options={integrationSystems.map((value) => ({ label: value, value }))} /></Form.Item></Col>
      <Col span={8}><Form.Item label="External ID" name="externalId"><Input /></Form.Item></Col>
      <Col span={8}><Form.Item label="External Code" name="externalCode"><Input /></Form.Item></Col>
      <Col span={24}>
        <Alert
          type="info"
          message="External references map directly to BE externalReferences[]. Brand code mapping is stored as sourceSystem + externalId."
        />
      </Col>
    </Row>
  )
}

export function ReviewStep({ form }: { form: ReturnType<typeof Form.useForm>[0] }) {
  return (
    <Row gutter={16}>
      <Col span={15}>
        <Card title="Summary">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Customer Code">{form.getFieldValue('customerCode') ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Account Name">{form.getFieldValue('accountName') ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Type">{form.getFieldValue('accountType') ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Segment">{form.getFieldValue('customerSegment') ?? '-'}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
      <Col span={9}>
        <Alert
          type="warning"
          showIcon
          message="Validation checklist"
          description="Code uniqueness, parent mapping, primary contact and external ID coverage will be validated by the BE service on submit."
        />
      </Col>
    </Row>
  )
}
