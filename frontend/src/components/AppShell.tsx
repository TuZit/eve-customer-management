import { ApartmentOutlined, ApiOutlined, DatabaseOutlined, FileExcelOutlined } from '@ant-design/icons'
import { Grid, Layout, Menu, Typography } from 'antd'
import type { ReactNode } from 'react'
import { useDealerUiStore, type MainView } from '../store/dealerUiStore'

const { Content, Sider } = Layout
const { Text } = Typography

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const activeView = useDealerUiStore((state) => state.activeView)
  const setActiveView = useDealerUiStore((state) => state.setActiveView)
  const screens = Grid.useBreakpoint()
  const isCompact = !screens.lg

  return (
    <Layout className="app-shell">
      <Sider width={248} className="app-sider">
        <div className="brand-block">
          <DatabaseOutlined className="brand-icon" />
          <div>
            <Text strong>Everon Dealer</Text>
            <Text type="secondary">Customer Master</Text>
          </div>
        </div>
        <Menu
          mode={isCompact ? 'horizontal' : 'inline'}
          className="app-menu"
          selectedKeys={[activeView]}
          onClick={({ key }) => setActiveView(key as MainView)}
          items={[
            { key: 'master', icon: <ApartmentOutlined />, label: 'Dealer Master' },
            { key: 'import', icon: <FileExcelOutlined />, label: 'Excel Import' },
            { key: 'integration', icon: <ApiOutlined />, label: 'Integration Mapping' },
          ]}
        />
      </Sider>
      <Layout>
        <Content className="app-content">{children}</Content>
      </Layout>
    </Layout>
  )
}
