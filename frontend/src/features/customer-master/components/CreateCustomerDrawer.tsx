import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App as AntdApp, Button, Drawer, Flex, Form, Space, Steps } from 'antd'
import { useState } from 'react'
import { customerAccountsApi, type AccountKind } from '../../../api/customerAccounts'
import { useDealerUiStore } from '../../../store/dealerUiStore'
import { toCreateCustomerAccountRequest } from '../adapters/customerFormAdapter'
import {
  AccountKindStep,
  BasicInformationStep,
  BusinessProfileStep,
  ContactAddressStep,
  ExternalIntegrationStep,
  PersonProfileStep,
  RelationshipStep,
  ReviewStep,
} from './create-customer/CreateCustomerFormSteps'

const wizardSteps = [
  'Account Type',
  'Basic',
  'Profile',
  'Relationship',
  'Contact & Address',
  'External',
  'Review',
]

export function CreateCustomerDrawer() {
  const open = useDealerUiStore((state) => state.createDrawerOpen)
  const setOpen = useDealerUiStore((state) => state.setCreateDrawerOpen)
  const queryClient = useQueryClient()
  const { message } = AntdApp.useApp()
  const [form] = Form.useForm()
  const [step, setStep] = useState(0)
  const accountKind = Form.useWatch('accountKind', form) as AccountKind | undefined

  const mutation = useMutation({
    mutationFn: customerAccountsApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['customer-accounts'] })
      message.success('Customer account created')
      form.resetFields()
      setStep(0)
      setOpen(false)
    },
    onError: (error) => message.error(error.message),
  })

  const handleSubmit = async () => {
    const values = await form.validateFields()
    mutation.mutate(toCreateCustomerAccountRequest(values))
  }

  return (
    <Drawer title="Create Dealer / Customer" width={860} open={open} onClose={() => setOpen(false)}>
      <Steps size="small" current={step} items={wizardSteps.map((title) => ({ title }))} />
      <Form
        className="wizard-form"
        layout="vertical"
        form={form}
        initialValues={{
          accountKind: 'ORGANIZATION',
          customerSegment: 'B2B',
          accountType: 'DEALER',
          status: 'PENDING',
          sourceSystem: 'CRM',
          relationshipType: 'PARENT_CHILD',
          groupCode: 'A',
        }}
      >
        {step === 0 && <AccountKindStep />}
        {step === 1 && <BasicInformationStep />}
        {step === 2 && accountKind !== 'PERSON' && <BusinessProfileStep />}
        {step === 2 && accountKind === 'PERSON' && <PersonProfileStep />}
        {step === 3 && <RelationshipStep />}
        {step === 4 && <ContactAddressStep />}
        {step === 5 && <ExternalIntegrationStep />}
        {step === 6 && <ReviewStep form={form} />}
      </Form>
      <Flex justify="space-between" className="drawer-footer">
        <Button disabled={step === 0} onClick={() => setStep((current) => current - 1)}>
          Back
        </Button>
        <Space>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          {step < wizardSteps.length - 1 ? (
            <Button type="primary" onClick={() => setStep((current) => current + 1)}>
              Next
            </Button>
          ) : (
            <Button type="primary" loading={mutation.isPending} onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Space>
      </Flex>
    </Drawer>
  )
}
