import './App.css'
import { AppShell } from './components/AppShell'
import { CustomerMasterScreen } from './features/customer-master/CustomerMasterScreen'
import { ExcelImportScreen } from './features/import/ExcelImportScreen'
import { IntegrationMappingScreen } from './features/integration/IntegrationMappingScreen'
import { useDealerUiStore } from './store/dealerUiStore'

function App() {
  const activeView = useDealerUiStore((state) => state.activeView)

  return (
    <AppShell>
      {activeView === 'master' && <CustomerMasterScreen />}
      {activeView === 'import' && <ExcelImportScreen />}
      {activeView === 'integration' && <IntegrationMappingScreen />}
    </AppShell>
  )
}

export default App
