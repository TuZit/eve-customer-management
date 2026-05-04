import { Space, Typography } from 'antd'
import type { ReactNode } from 'react'

const { Text, Title } = Typography

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <section className="page-header">
      <div className="page-header-copy">
        <Title level={2}>{title}</Title>
        {subtitle && <Text type="secondary">{subtitle}</Text>}
      </div>
      {actions && (
        <Space wrap className="page-header-actions">
          {actions}
        </Space>
      )}
    </section>
  )
}
