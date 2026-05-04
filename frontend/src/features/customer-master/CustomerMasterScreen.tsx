import {
  CheckCircleOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  ForkOutlined,
  PlusOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  App as AntdApp,
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Input,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'
import { customerAccountsApi, type AccountStatus, type CustomerAccountDto } from '../../api/customerAccounts'
import { BusinessKey } from '../../components/BusinessKey'
import { PageHeader } from '../../components/PageHeader'
import { statusColor } from '../../constants/customerMaster'
import { sampleAccounts } from '../../data/sampleAccounts'
import { useCustomerAccounts } from '../../hooks/useCustomerAccounts'
import { useDealerUiStore } from '../../store/dealerUiStore'
import {
  applyClientFilters,
  findDuplicateCodes,
  formatDate,
  getBrandReferences,
  getGroupCode,
  getPrimaryContact,
} from '../../utils/customerAccount'
import { ActiveFilterChips } from './components/ActiveFilterChips'
import { AdvancedFilterDrawer } from './components/AdvancedFilterDrawer'
import { CreateCustomerDrawer } from './components/CreateCustomerDrawer'
import { CustomerDetailDrawer } from './components/CustomerDetailDrawer'
import { DuplicateCodeModal } from './components/DuplicateCodeModal'

const { Text } = Typography

export function CustomerMasterScreen() {
  const { data = sampleAccounts, isFetching } = useCustomerAccounts()
  const filters = useDealerUiStore((state) => state.filters)
  const accounts = useMemo(() => applyClientFilters(data, filters), [data, filters])
  const selectedAccountId = useDealerUiStore((state) => state.selectedAccountId)
  const selectAccount = useDealerUiStore((state) => state.selectAccount)
  const setFilterDrawerOpen = useDealerUiStore((state) => state.setFilterDrawerOpen)
  const setCreateDrawerOpen = useDealerUiStore((state) => state.setCreateDrawerOpen)
  const setDuplicateModalOpen = useDealerUiStore((state) => state.setDuplicateModalOpen)
  const setFilters = useDealerUiStore((state) => state.setFilters)
  const queryClient = useQueryClient()
  const { message } = AntdApp.useApp()

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AccountStatus }) =>
      customerAccountsApi.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['customer-accounts'] })
      message.success('Account status updated')
    },
    onError: (error) => message.error(error.message),
  })

  const kpis = {
    total: accounts.length,
    activeDealers: accounts.filter((account) => account.accountType === 'DEALER' && account.status === 'ACTIVE').length,
    duplicateAlerts: findDuplicateCodes(accounts),
    pendingImports: accounts.filter((account) => account.status === 'PENDING').length,
    missingParent: accounts.filter((account) => account.accountKind === 'ORGANIZATION' && !account.parentCustomerCode).length,
  }

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId)
  const columns: ColumnsType<CustomerAccountDto> = [
    {
      title: 'Dealer / Customer Code',
      dataIndex: 'customerCode',
      fixed: 'left',
      width: 176,
      render: (code) => <BusinessKey>{code}</BusinessKey>,
    },
    { title: 'Account Number', dataIndex: 'accountNumber', width: 136 },
    {
      title: 'Account Name',
      dataIndex: 'accountName',
      width: 230,
      render: (name, record) => (
        <Button type="link" className="link-button" onClick={() => selectAccount(record.id)}>
          {name}
        </Button>
      ),
    },
    { title: 'Party Type', dataIndex: 'accountKind', width: 124 },
    { title: 'Segment', dataIndex: 'customerSegment', width: 96 },
    { title: 'Account Type', dataIndex: 'accountType', width: 140 },
    { title: 'Group', width: 88, render: (_, record) => <Tag>{getGroupCode(record)}</Tag> },
    {
      title: 'Parent Code',
      dataIndex: 'parentCustomerCode',
      width: 144,
      render: (value) => value ?? <Text type="secondary">Missing</Text>,
    },
    {
      title: 'Brand Codes',
      width: 220,
      render: (_, record) => (
        <Space wrap size={[4, 4]}>
          {getBrandReferences(record).map((reference) => (
            <Tag color="blue" key={`${reference.sourceSystem}-${reference.externalId}`}>
              {reference.sourceSystem}: {reference.externalId}
            </Tag>
          ))}
        </Space>
      ),
    },
    { title: 'Primary Contact', width: 160, render: (_, record) => getPrimaryContact(record)?.fullName ?? '-' },
    { title: 'Phone', dataIndex: 'phone', width: 132 },
    { title: 'Region', dataIndex: 'regionCode', width: 96 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 116,
      render: (status: AccountStatus) => <Badge status={statusColor[status]} text={status} />,
    },
    { title: 'Last Updated', dataIndex: 'updatedAt', width: 122, render: formatDate },
    {
      title: 'Actions',
      fixed: 'right',
      width: 210,
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EyeOutlined />} onClick={() => selectAccount(record.id)} />
          <Button icon={<EditOutlined />} onClick={() => selectAccount(record.id)} />
          <Button icon={<CheckCircleOutlined />} onClick={() => setDuplicateModalOpen(true)} />
          <Button icon={<ForkOutlined />} onClick={() => selectAccount(record.id)} />
          <Button
            icon={<DeleteOutlined />}
            loading={statusMutation.isPending}
            onClick={() => statusMutation.mutate({ id: record.id, status: 'INACTIVE' })}
          />
        </Space>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Dealer / Customer Master"
        subtitle="Centralized customer code management for CRM integration"
        actions={
          <>
            <Button icon={<CheckCircleOutlined />} onClick={() => setDuplicateModalOpen(true)}>
              Validate Code
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateDrawerOpen(true)}>
              New Customer
            </Button>
          </>
        }
      />

      <Row gutter={[12, 12]} className="kpi-row">
        <Col xs={24} md={8} xl={4}>
          <Card><Statistic title="Total Customers" value={kpis.total} prefix={<DatabaseOutlined />} /></Card>
        </Col>
        <Col xs={24} md={8} xl={5}>
          <Card><Statistic title="Active Dealers" value={kpis.activeDealers} valueStyle={{ color: '#1677ff' }} /></Card>
        </Col>
        <Col xs={24} md={8} xl={5}>
          <Card><Statistic title="Duplicate Code Alerts" value={kpis.duplicateAlerts} valueStyle={{ color: '#d46b08' }} /></Card>
        </Col>
        <Col xs={24} md={8} xl={5}>
          <Card><Statistic title="Pending Imports" value={kpis.pendingImports} valueStyle={{ color: '#0958d9' }} /></Card>
        </Col>
        <Col xs={24} md={8} xl={5}>
          <Card><Statistic title="Missing Parent Mapping" value={kpis.missingParent} valueStyle={{ color: '#cf1322' }} /></Card>
        </Col>
      </Row>

      <Card className="table-card">
        <Flex justify="space-between" align="center" gap={12} wrap="wrap" className="toolbar">
          <Input
            className="search-input"
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search by code, name, phone, tax code, external ID"
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
          />
          <Space wrap>
            <Button icon={<FilterOutlined />} onClick={() => setFilterDrawerOpen(true)}>
              Advanced Filters
            </Button>
            <Button icon={<SyncOutlined />}>Sync to CRM</Button>
          </Space>
        </Flex>
        <ActiveFilterChips />
        <Table
          rowKey="id"
          loading={isFetching}
          dataSource={accounts}
          columns={columns}
          scroll={{ x: 1900 }}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          size="middle"
        />
      </Card>

      <AdvancedFilterDrawer />
      <CreateCustomerDrawer />
      <DuplicateCodeModal accounts={accounts} />
      <CustomerDetailDrawer account={selectedAccount} onClose={() => selectAccount(undefined)} />
    </>
  )
}
