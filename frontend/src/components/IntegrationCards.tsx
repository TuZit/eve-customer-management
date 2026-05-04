import { Badge, Card, Col, Flex, Row, Typography } from 'antd'
import type { CustomerAccountDto } from '../api/customerAccounts'
import { integrationSystems } from '../constants/customerMaster'

const { Text } = Typography

interface IntegrationCardsProps {
  account: CustomerAccountDto
}

export function IntegrationCards({ account }: IntegrationCardsProps) {
  return (
    <Row gutter={[12, 12]}>
      {integrationSystems.map((system) => {
        const reference = account.externalReferences.find((item) => item.sourceSystem === system)
        return (
          <Col span={8} key={system}>
            <Card size="small">
              <Flex justify="space-between">
                <Text strong>{system}</Text>
                <Badge status={reference ? 'success' : 'default'} text={reference ? 'Mapped' : 'Missing'} />
              </Flex>
              <Text type="secondary">External ID: {reference?.externalId ?? '-'}</Text>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}
