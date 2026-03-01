import { useState } from 'react'
import './App.css'
import AttributeFilter from './components/AttributeFilter.jsx'
import WeaponSearch from './components/WeaponSearch.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('filter') // 'filter' 或 'search'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="text-center px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            明日方舟：终末地基质刷取工具
          </h1>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="py-8 px-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 标签页切换 */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('filter')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'filter'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                📋 武器属性筛选
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'search'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                🔍 刷取策略查询
              </button>
            </div>

            {/* 内容区域 */}
            <div className="p-6">
              {activeTab === 'filter' ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
                    武器属性筛选
                  </h2>
                  <AttributeFilter />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
                    刷取策略查询
                  </h2>
                  <WeaponSearch />
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="text-center px-4 py-4 text-gray-500 text-sm">
          明日方舟：终末地 - 基质刷取工具
        </div>
      </footer>
    </div>
  )
}

export default App