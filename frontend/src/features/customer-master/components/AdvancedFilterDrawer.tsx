import { Button, Checkbox, Col, DatePicker, Drawer, Flex, Form, Input, Radio, Row, Select, Switch } from 'antd'
import {
  accountTypeOptions,
  brandSystems,
  groupOptions,
  regionOptions,
  statusOptions,
} from '../../../constants/customerMaster'
import { useDealerUiStore } from '../../../store/dealerUiStore'

const { RangePicker } = DatePicker

export function AdvancedFilterDrawer() {
  const open = useDealerUiStore((state) => state.filterDrawerOpen)
  const setOpen = useDealerUiStore((state) => state.setFilterDrawerOpen)
  const filters = useDealerUiStore((state) => state.filters)
  const setFilters = useDealerUiStore((state) => state.setFilters)
  const resetFilters = useDealerUiStore((state) => state.resetFilters)
  const [form] = Form.useForm()

  return (
    <Drawer title="Advanced customer filters" width="min(430px, 100vw)" open={open} onClose={() => setOpen(false)}>
      <Form
        layout="vertical"
        form={form}
        initialValues={filters}
        onFinish={(values) => {
          setFilters(values)
          setOpen(false)
        }}
      >
        <Form.Item label="Text search" name="search">
          <Input placeholder="Code, name, phone, tax code, external ID" />
        </Form.Item>
        <Form.Item label="Code matching mode" name="codeMatchingMode">
          <Radio.Group optionType="button" options={['Exact', 'Contains', 'Starts with']} />
        </Form.Item>
        <Form.Item label="Account Type" name="accountType">
          <Select allowClear options={accountTypeOptions} />
        </Form.Item>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item label="Account Party Type" name="accountKind">
              <Select
                allowClear
                options={[
                  { label: 'Organization', value: 'ORGANIZATION' },
                  { label: 'Person', value: 'PERSON' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Segment" name="customerSegment">
              <Select
                allowClear
                options={[
                  { label: 'B2B', value: 'B2B' },
                  { label: 'B2C', value: 'B2C' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Status" name="status">
          <Select allowClear options={statusOptions} />
        </Form.Item>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item label="Brand" name="brand">
              <Select allowClear options={brandSystems.map((brand) => ({ label: brand, value: brand }))} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Group" name="group">
              <Select allowClear options={groupOptions} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Region / Territory" name="region">
          <Select allowClear options={regionOptions} />
        </Form.Item>
        <Form.Item label="Parent mapping status" name="parentMapping">
          <Select options={['Any', 'Has Parent', 'Missing Parent'].map((value) => ({ label: value, value }))} />
        </Form.Item>
        <Form.Item label="External system mapping status" name="externalMapping">
          <Select options={['Any', 'Has External ID', 'Missing External ID'].map((value) => ({ label: value, value }))} />
        </Form.Item>
        <Form.Item label="Created / updated date range">
          <RangePicker className="full-width" />
        </Form.Item>
        <Form.Item name="duplicateDetection" valuePropName="checked">
          <Switch checkedChildren="Duplicate detection" unCheckedChildren="Duplicate detection" />
        </Form.Item>
        <Form.Item name="missingRequired" valuePropName="checked">
          <Checkbox>Only records missing required fields</Checkbox>
        </Form.Item>
        <Flex justify="end" gap={8} wrap>
          <Button
            onClick={() => {
              resetFilters()
              form.resetFields()
            }}
          >
            Reset
          </Button>
          <Button type="primary" htmlType="submit">
            Apply
          </Button>
        </Flex>
      </Form>
    </Drawer>
  )
}
