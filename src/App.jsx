import { useState } from 'react'
import AttributeFilter from './components/AttributeFilter.jsx'
import WeaponSearch from './components/WeaponSearch.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('search')
  const [filterPreset, setFilterPreset] = useState(null)

  const navigateToFilter = (preset) => {
    setFilterPreset({ id: Date.now(), ...preset })
    setActiveTab('filter')
  }

  const tabs = [
    { id: 'search', label: '刷取策略查询' },
    { id: 'filter', label: '武器属性筛选' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface-soft)' }}>
      {/* Sticky nav */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: 'var(--canvas)',
        borderBottom: '1px solid var(--hairline)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--ink)',
              letterSpacing: '-0.5px',
            }}>
              终末地·基质刷取
            </span>
            <span style={{
              padding: '2px 8px',
              backgroundColor: 'var(--tint-lavender)',
              color: 'var(--brand-purple-800)',
              borderRadius: 'var(--r-sm)',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              BETA
            </span>
          </div>

          {/* Pill-tab navigation */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--r-full)',
                  border: activeTab === tab.id
                    ? '1px solid var(--ink-deep)'
                    : '1px solid var(--hairline)',
                  backgroundColor: activeTab === tab.id ? 'var(--ink-deep)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--on-dark)' : 'var(--steel)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  lineHeight: '1.50',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 32px',
      }}>
        {activeTab === 'filter' ? (
          <AttributeFilter filterPreset={filterPreset} />
        ) : (
          <WeaponSearch onNavigateToFilter={navigateToFilter} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--canvas)',
        borderTop: '1px solid var(--hairline)',
        padding: '24px 32px',
        marginTop: '48px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '14px', color: 'var(--steel)' }}>
            明日方舟：终末地 — 基质刷取工具
          </span>
          <span style={{ fontSize: '13px', color: 'var(--stone)' }}>
            数据仅供参考，版本更新后请以游戏内为准
          </span>
        </div>
      </footer>
    </div>
  )
}

export default App
