import { Typography } from 'antd'

const { Text } = Typography

interface BusinessKeyProps {
  children: string
  size?: 'default' | 'large'
}

export function BusinessKey({ children, size = 'default' }: BusinessKeyProps) {
  return <Text className={size === 'large' ? 'business-key large' : 'business-key'}>{children}</Text>
}
