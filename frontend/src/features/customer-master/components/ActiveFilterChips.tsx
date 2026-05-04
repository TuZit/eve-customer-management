import { Button, Space, Tag } from 'antd'
import { useDealerUiStore } from '../../../store/dealerUiStore'

export function ActiveFilterChips() {
  const filters = useDealerUiStore((state) => state.filters)
  const resetFilters = useDealerUiStore((state) => state.resetFilters)
  const chips = Object.entries(filters).filter(
    ([, value]) => value && value !== 'Any' && value !== false && value !== 'Contains',
  )

  if (chips.length === 0) return null

  return (
    <Space wrap className="filter-chips">
      {chips.map(([key, value]) => (
        <Tag color="blue" key={key}>
          {key}: {String(value)}
        </Tag>
      ))}
      <Button size="small" onClick={resetFilters}>
        Reset
      </Button>
    </Space>
  )
}
