import { CloudSyncOutlined } from '@ant-design/icons'
import { Badge, Button, Card, Col, Divider, Flex, Progress, Row, Table, Tag, Typography } from 'antd'
import { PageHeader } from '../../components/PageHeader'
import { integrationSystems } from '../../constants/customerMaster'

const { Text } = Typography

export function IntegrationMappingScreen() {
  return (
    <section>
      <PageHeader
        title="Integration Mapping Readiness"
        subtitle="CRM, ERP, KiotViet, E-Invoice, POS, DMS and Loyalty external reference coverage"
        actions={<Button type="primary" icon={<CloudSyncOutlined />}>Run Sync Check</Button>}
      />
      <Row gutter={[12, 12]}>
        {integrationSystems.map((system, index) => (
          <Col xs={24} sm={12} xl={6} key={system}>
            <Card>
              <Flex justify="space-between" align="center">
                <Text strong>{system}</Text>
                <Badge status={index % 3 === 0 ? 'warning' : 'success'} text={index % 3 === 0 ? 'Attention' : 'Connected'} />
              </Flex>
              <Progress percent={92 - index * 7} size="small" />
              <Text type="secondary">Last sync: {index + 1}h ago</Text>
              <Divider className="tight-divider" />
              <Flex justify="space-between"><Text>Failed records</Text><Text strong>{index * 3}</Text></Flex>
              <Flex justify="space-between"><Text>Direction</Text><Tag>Bidirectional</Tag></Flex>
            </Card>
          </Col>
        ))}
      </Row>
      <Card title="Field mapping" className="table-card">
        <Table
          rowKey={(record) => `${record.internal}-${record.system}`}
          pagination={false}
          dataSource={[
            { internal: 'customerCode', system: 'CRM', external: 'Account.Customer_Code__c', required: 'Yes', transform: 'Uppercase', direction: 'Outbound', status: 'Ready' },
            { internal: 'accountNumber', system: 'CRM', external: 'Account.AccountNumber', required: 'Yes', transform: 'None', direction: 'Bidirectional', status: 'Ready' },
            { internal: 'externalReferences[].externalId', system: 'KIOTVIET', external: 'customer.id', required: 'Yes', transform: 'String', direction: 'Inbound', status: 'Ready' },
            { internal: 'taxCode', system: 'E-INVOICE', external: 'buyerTaxCode', required: 'No', transform: 'Digits only', direction: 'Outbound', status: 'Review' },
            { internal: 'businessProfile.creditLimit', system: 'ERP', external: 'credit_limit', required: 'No', transform: 'VND number', direction: 'Inbound', status: 'Ready' },
          ]}
          columns={[
            { title: 'Internal Field', dataIndex: 'internal' },
            { title: 'External System', dataIndex: 'system' },
            { title: 'External Field', dataIndex: 'external' },
            { title: 'Required', dataIndex: 'required' },
            { title: 'Transformation', dataIndex: 'transform' },
            { title: 'Sync Direction', dataIndex: 'direction' },
            { title: 'Status', dataIndex: 'status', render: (value) => <Tag color={value === 'Ready' ? 'green' : 'orange'}>{value}</Tag> },
          ]}
          scroll={{ x: 980 }}
        />
      </Card>
    </section>
  )
}
