import { Alert, Button, Input, Modal, Select, Space, Table } from 'antd'
import { useState } from 'react'
import type { CustomerAccountDto } from '../../../api/customerAccounts'
import { useDealerUiStore } from '../../../store/dealerUiStore'
import { formatDate } from '../../../utils/customerAccount'

interface DuplicateCodeModalProps {
  accounts: CustomerAccountDto[]
}

export function DuplicateCodeModal({ accounts }: DuplicateCodeModalProps) {
  const open = useDealerUiStore((state) => state.duplicateModalOpen)
  const setOpen = useDealerUiStore((state) => state.setDuplicateModalOpen)
  const [code, setCode] = useState('')
  const [codeType, setCodeType] = useState('Customer Code')
  const matches = accounts.filter((account) => {
    const values = [
      account.customerCode,
      account.accountNumber,
      ...account.externalReferences.map((reference) => reference.externalId),
    ]
    return code && values.some((value) => value.toLowerCase().includes(code.toLowerCase()))
  })
  const state = !code ? 'Enter a code to validate' : matches.length ? 'Duplicate Found' : 'Available'

  return (
    <Modal
      title="Duplicate Code Validation"
      open={open}
      width="min(760px, calc(100vw - 24px))"
      onCancel={() => setOpen(false)}
      footer={<Button onClick={() => setOpen(false)}>Close</Button>}
    >
      <Space.Compact className="full-width">
        <Select
          value={codeType}
          onChange={setCodeType}
          options={[
            'Customer Code',
            'Account Number',
            'Everon Code',
            'Artemis Code',
            'Kingkoil Code',
            'External ID',
          ].map((value) => ({ label: value, value }))}
        />
        <Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Search code" />
      </Space.Compact>
      <Alert
        className="modal-state"
        type={matches.length ? 'warning' : code ? 'success' : 'info'}
        showIcon
        message={`${codeType}: ${state}`}
      />
      <Table
        rowKey="id"
        dataSource={matches}
        pagination={false}
        columns={[
          { title: 'Customer Code', dataIndex: 'customerCode' },
          { title: 'Account Name', dataIndex: 'accountName' },
          { title: 'Account Number', dataIndex: 'accountNumber' },
          { title: 'Status', dataIndex: 'status' },
          { title: 'Parent Code', dataIndex: 'parentCustomerCode' },
          { title: 'Source System', render: (_, record) => record.externalReferences[0]?.sourceSystem ?? '-' },
          { title: 'Last Updated', dataIndex: 'updatedAt', render: formatDate },
          {
            title: 'Action',
            render: () => (
              <Space>
                <Button size="small">View</Button>
                <Button size="small">Merge</Button>
                <Button size="small">Use Existing</Button>
              </Space>
            ),
          },
        ]}
        scroll={{ x: 980 }}
      />
    </Modal>
  )
}
