import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tree,
  Typography,
} from 'antd'
import {
  CheckCircleOutlined,
  CloudSyncOutlined,
  EditOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import type { CustomerAccountDto } from '../../../api/customerAccounts'
import { BusinessKey } from '../../../components/BusinessKey'
import { IntegrationCards } from '../../../components/IntegrationCards'
import { statusColor } from '../../../constants/customerMaster'
import {
  formatDate,
  getBrandReferences,
  getPrimaryContact,
  money,
} from '../../../utils/customerAccount'

const { Text, Title } = Typography

interface CustomerDetailDrawerProps {
  account?: CustomerAccountDto
  onClose: () => void
}

export function CustomerDetailDrawer({ account, onClose }: CustomerDetailDrawerProps) {
  if (!account) {
    return <Drawer open={false} onClose={onClose} />
  }

  const primaryContact = getPrimaryContact(account)
  const hierarchyData = [
    {
      title: account.parentCustomerCode ?? 'Root account',
      key: 'root',
      children: [{ title: `${account.customerCode} - ${account.accountName}`, key: account.id }],
    },
  ]

  return (
    <Drawer width="min(980px, 100vw)" open={Boolean(account)} onClose={onClose} title="Customer record detail">
      <section className="record-header">
        <div>
          <BusinessKey size="large">{account.customerCode}</BusinessKey>
          <Title level={3}>{account.accountName}</Title>
          <Space wrap>
            <Tag color="blue">{account.accountNumber}</Tag>
            <Badge status={statusColor[account.status]} text={account.status} />
          </Space>
        </div>
        <Space wrap>
          <Button icon={<EditOutlined />}>Edit</Button>
          <Button icon={<CheckCircleOutlined />}>Validate</Button>
          <Button icon={<ImportOutlined />}>Import History</Button>
          <Button type="primary" icon={<CloudSyncOutlined />}>
            Sync to CRM
          </Button>
        </Space>
      </section>
      <Row gutter={[12, 12]} className="highlight-row">
        {[
          ['Customer Code', account.customerCode],
          ['Account Number', account.accountNumber],
          ['Account Type', account.accountType],
          ['Segment', account.customerSegment],
          ['Parent Code', account.parentCustomerCode ?? 'Missing'],
          ['Primary Contact', primaryContact?.fullName ?? '-'],
          ['Region', account.regionCode ?? '-'],
          ['Status', account.status],
        ].map(([label, value]) => (
          <Col xs={24} sm={12} lg={6} key={label}>
            <Card size="small">
              <Text type="secondary">{label}</Text>
              <div className="highlight-value">{value}</div>
            </Card>
          </Col>
        ))}
      </Row>
      <Tabs
        items={[
          {
            key: 'details',
            label: 'Details',
            children: (
              <Row gutter={16}>
                <Col xs={24} lg={15}>
                  <Descriptions bordered size="small" column={1}>
                    <Descriptions.Item label="Legal / Display Name">
                      {account.businessProfile?.legalName ?? account.accountName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tax Code">
                      {account.taxCode ?? account.businessProfile?.taxCode ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Credit Limit">
                      {money(account.businessProfile?.creditLimit)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Term">
                      {account.businessProfile?.paymentTerm ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Last Updated">{formatDate(account.updatedAt)}</Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col xs={24} lg={9}>
                  <Card title="Validation" className="validation-card">
                    <Timeline
                      items={[
                        { color: 'green', children: 'Code uniqueness passed' },
                        {
                          color: account.parentCustomerCode ? 'green' : 'red',
                          children: account.parentCustomerCode
                            ? 'Parent mapping available'
                            : 'Missing parent mapping',
                        },
                        {
                          color: account.externalReferences.length ? 'green' : 'orange',
                          children: `${account.externalReferences.length} external references`,
                        },
                        {
                          color: getBrandReferences(account).length ? 'green' : 'orange',
                          children: `${getBrandReferences(account).length} brand code mappings`,
                        },
                      ]}
                    />
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'contacts',
            label: 'Related Contacts',
            children: (
              <Table
                rowKey={(record) => record.id ?? record.fullName}
                dataSource={account.contacts}
                pagination={false}
                columns={[
                  { title: 'Name', dataIndex: 'fullName' },
                  { title: 'Role', dataIndex: 'contactRole' },
                  { title: 'Mobile', dataIndex: 'mobile' },
                  { title: 'Primary', dataIndex: 'isPrimary', render: (value) => (value ? 'Yes' : 'No') },
                ]}
                scroll={{ x: 560 }}
              />
            ),
          },
          {
            key: 'addresses',
            label: 'Addresses',
            children: (
              <Table
                rowKey={(record) => record.id ?? record.line1}
                dataSource={account.addresses}
                pagination={false}
                columns={[
                  { title: 'Type', dataIndex: 'addressType' },
                  { title: 'Address', dataIndex: 'line1' },
                  { title: 'District', dataIndex: 'district' },
                  { title: 'Province', dataIndex: 'province' },
                ]}
                scroll={{ x: 620 }}
              />
            ),
          },
          {
            key: 'relationships',
            label: 'Relationships',
            children: <Tree defaultExpandAll treeData={hierarchyData} />,
          },
          {
            key: 'external',
            label: 'External System Mapping',
            children: <IntegrationCards account={account} />,
          },
          {
            key: 'audit',
            label: 'Audit Log',
            children: (
              <Timeline
                items={[
                  { children: `Updated ${formatDate(account.updatedAt)}` },
                  { children: `Created ${formatDate(account.createdAt)}` },
                ]}
              />
            ),
          },
        ]}
      />
    </Drawer>
  )
}
