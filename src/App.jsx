import './App.css'
import AttributeFilter from './components/AttributeFilter.jsx'

function App() {
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">武器属性筛选</h2>
            
            {/* 属性筛选组件 */}
            <AttributeFilter />
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