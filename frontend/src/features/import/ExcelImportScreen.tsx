import { FileExcelOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Flex, Row, Space, Statistic, Steps, Table, Tag, Upload } from 'antd'
import { PageHeader } from '../../components/PageHeader'

const { Dragger } = Upload

const mappingRows = [
  ['EVERON', 'EVR-HN001', 'externalReferences[EVERON].externalId', 'No', 'Trim + uppercase'],
  ['ARTEMIS', 'ART-003', 'externalReferences[ARTEMIS].externalId', 'No', 'Trim + uppercase'],
  ['KINGKOIL', 'KK-HN018', 'externalReferences[KINGKOIL].externalId', 'No', 'Trim + uppercase'],
  ['GROUP', 'A+', 'classifications[].classificationCode', 'No', 'Map to CUSTOMER_TYPE'],
  ['LEVEL', 'Flagship', 'businessProfile.dealerTier', 'No', 'Normalize tier'],
  ['Agent Code', 'DL-HN-0001', 'customerCode', 'Yes', 'Required unique'],
  ['Agent Name', 'Dai ly Everon Hoan Kiem', 'accountName', 'Yes', 'Required text'],
  ['Loai', 'Dealer', 'accountType', 'Yes', 'Enum mapping'],
  ['Parent Code', 'GRP-MIEN-BAC', 'parentCustomerCode', 'No', 'Lookup by code'],
]

export function ExcelImportScreen() {
  return (
    <section>
      <PageHeader
        title="Excel Import Workflow"
        subtitle="Upload, map, validate, and commit Excel dealer/customer code sheets"
        actions={<Button icon={<FileExcelOutlined />}>Download Template</Button>}
      />
      <Card>
        <Steps responsive current={3} items={['Upload Excel', 'Sheet Selection', 'Field Mapping', 'Validation Result', 'Commit'].map((title) => ({ title }))} />
        <Divider />
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={9}>
            <Dragger beforeUpload={() => false} accept=".xlsx">
              <p className="ant-upload-drag-icon"><FileExcelOutlined /></p>
              <p className="ant-upload-text">Drop Excel file here</p>
              <p className="ant-upload-hint">Supported format: .xlsx</p>
            </Dragger>
            <Card size="small" title="Detected sheets" className="stack-card">
              <Space wrap>
                {['CODE', 'DAILY', 'TOTAL', 'Dealer detail', 'Sales', 'Collection'].map((sheet) => (
                  <Tag color={sheet === 'CODE' ? 'blue' : 'default'} key={sheet}>{sheet}</Tag>
                ))}
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={15}>
            <Table
              size="small"
              pagination={false}
              dataSource={mappingRows.map(([excelColumn, sampleValue, targetField, required, transformationRule]) => ({
                excelColumn,
                sampleValue,
                targetField,
                required,
                transformationRule,
              }))}
              rowKey="excelColumn"
              columns={[
                { title: 'Excel Column', dataIndex: 'excelColumn' },
                { title: 'Sample Value', dataIndex: 'sampleValue' },
                { title: 'Target Field', dataIndex: 'targetField' },
                { title: 'Required', dataIndex: 'required' },
                { title: 'Transformation Rule', dataIndex: 'transformationRule' },
              ]}
              scroll={{ x: 820 }}
            />
          </Col>
        </Row>
      </Card>
      <Row gutter={[12, 12]} className="kpi-row">
        {[
          ['Total rows', 1280],
          ['Valid rows', 1168],
          ['Duplicate customer codes', 14],
          ['Duplicate brand codes', 22],
          ['Missing parent account', 41],
          ['Rows with errors', 38],
        ].map(([label, value]) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={label}><Card><Statistic title={label} value={value} /></Card></Col>
        ))}
      </Row>
      <Card title="Validation result">
        <Table
          pagination={false}
          rowKey="row"
          dataSource={[
            { row: 42, code: 'DL-HN-0001', name: 'Dai ly Hoan Kiem', issue: 'Duplicate', severity: 'Error', message: 'Customer code already exists', fix: 'Use existing or merge' },
            { row: 118, code: 'DL-HP-0108', name: 'Everon Hai Phong', issue: 'Missing Parent', severity: 'Warning', message: 'Parent code not found', fix: 'Map to GRP-MIEN-BAC' },
            { row: 230, code: '', name: 'Artemis Thu Duc', issue: 'Required', severity: 'Error', message: 'Missing customer code', fix: 'Generate or enter code' },
          ]}
          columns={[
            { title: 'Row Number', dataIndex: 'row' },
            { title: 'Customer Code', dataIndex: 'code' },
            { title: 'Account Name', dataIndex: 'name' },
            { title: 'Issue Type', dataIndex: 'issue' },
            { title: 'Severity', dataIndex: 'severity', render: (value) => <Tag color={value === 'Error' ? 'red' : 'orange'}>{value}</Tag> },
            { title: 'Message', dataIndex: 'message' },
            { title: 'Suggested Fix', dataIndex: 'fix' },
            { title: 'Action', render: () => <Button size="small">Fix</Button> },
          ]}
          scroll={{ x: 980 }}
        />
        <Flex justify="end" gap={8} wrap className="drawer-footer">
          <Button>Cancel</Button>
          <Button>Download Error Report</Button>
          <Button type="primary">Import Valid Rows</Button>
        </Flex>
      </Card>
    </section>
  )
}
