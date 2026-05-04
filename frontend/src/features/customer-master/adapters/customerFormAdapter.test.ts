import { describe, expect, it } from 'vitest'
import { toCreateCustomerAccountRequestFromForm } from './customerFormAdapter'

describe('toCreateCustomerAccountRequestFromForm', () => {
  it('uses the full preserved form store for the create request payload', async () => {
    const calls: string[] = []
    const form = {
      async validateFields() {
        calls.push('validateFields')
        return {}
      },
      getFieldsValue(includeAll?: true) {
        calls.push(`getFieldsValue:${String(includeAll)}`)
        return {
          accountKind: 'ORGANIZATION',
          customerCode: 'CUS-001',
          accountName: 'Everon Dealer',
          customerSegment: 'B2B',
          accountType: 'DEALER',
          status: 'PENDING',
          mobile: '0909000000',
          email: 'dealer@example.com',
          contactFullName: 'Nguyen Van A',
          billingLine1: '12 Nguyen Trai',
          groupCode: 'A',
          sourceSystem: 'CRM',
          externalId: 'EXT-001',
        }
      },
    }

    const payload = await toCreateCustomerAccountRequestFromForm(form)

    expect(calls).toEqual(['validateFields', 'getFieldsValue:true'])
    expect(payload).toMatchObject({
      customerCode: 'CUS-001',
      accountName: 'Everon Dealer',
      accountKind: 'ORGANIZATION',
      customerSegment: 'B2B',
      accountType: 'DEALER',
      status: 'PENDING',
      phone: '0909000000',
      email: 'dealer@example.com',
      contacts: [{ fullName: 'Nguyen Van A' }],
      addresses: [{ line1: '12 Nguyen Trai' }],
      externalReferences: [{ sourceSystem: 'CRM', externalId: 'EXT-001' }],
    })
  })
})
