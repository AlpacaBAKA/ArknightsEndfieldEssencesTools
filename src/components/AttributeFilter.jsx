import { useState, useEffect } from 'react'
import { AttributeTag, SecondaryTag, SkillsTag, weapons, locations } from '../data/data.jsx'

const AttributeFilter = () => {
  const [selectedAttribute, setSelectedAttribute] = useState(null)
  const [selectedSecondary, setSelectedSecondary] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [selectedRank, setSelectedRank] = useState(null)
  const [filteredWeapons, setFilteredWeapons] = useState(weapons)
  const [checkedWeapons, setCheckedWeapons] = useState([]) // 选中的武器列表
  
  // 排序状态: { field: string, order: 'asc' | 'desc' | null }
  const [sortConfig, setSortConfig] = useState({ field: null, order: null })

  // 武器类型
  const weaponTypes = ['单手剑', '双手剑', '长柄武器', '手铳', '施术单元']
  
  // 稀有度
  const ranks = [6, 5, 4, 3]

  // 根据稀有度返回颜色
  const getRankColor = (rank) => {
    switch(rank) {
      case 3: return '#AACEF7'
      case 4: return '#B07EF2'
      case 5: return '#FAC946'
      case 6: return '#F99446'
      default: return '#gray'
    }
  }

  // 查找可以刷取所有选中武器的地点
  const findCommonLocations = (weaponsList) => {
    if (weaponsList.length === 0) return []
    
    const commonLocations = locations.filter(location => {
      return weaponsList.every(weapon => {
        const hasSecondary = location.secondary.some(sec => sec.id === weapon.secondary.id)
        const hasSkills = location.skills.some(skill => skill.id === weapon.skills.id)
        return hasSecondary && hasSkills
      })
    })
    
    return commonLocations
  }

  // 切换复选框
  const toggleWeaponCheck = (weaponId) => {
    setCheckedWeapons(prev => {
      if (prev.includes(weaponId)) {
        return prev.filter(id => id !== weaponId)
      } else {
        return [...prev, weaponId]
      }
    })
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (checkedWeapons.length === filteredWeapons.length) {
      setCheckedWeapons([])
    } else {
      setCheckedWeapons(filteredWeapons.map(w => w.id))
    }
  }

  // 处理排序
  const handleSort = (field) => {
    setSortConfig(prev => {
      // 如果点击的是同一列
      if (prev.field === field) {
        // null -> asc -> desc -> null (循环)
        if (prev.order === null) {
          return { field, order: 'asc' }
        } else if (prev.order === 'asc') {
          return { field, order: 'desc' }
        } else {
          return { field: null, order: null }
        }
      } else {
        // 点击新列，从 asc 开始
        return { field, order: 'asc' }
      }
    })
  }

  // 排序武器列表
  const sortWeapons = (weaponsList) => {
    if (!sortConfig.field || !sortConfig.order) {
      // 没有排序，按 id 排序
      return [...weaponsList].sort((a, b) => a.id - b.id)
    }

    return [...weaponsList].sort((a, b) => {
      let aValue, bValue

      switch (sortConfig.field) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'rank':
          aValue = a.rank
          bValue = b.rank
          break
        case 'type':
          aValue = a.type
          bValue = b.type
          break
        case 'attribute':
          aValue = a.attribute.name
          bValue = b.attribute.name
          break
        case 'secondary':
          aValue = a.secondary.name
          bValue = b.secondary.name
          break
        case 'skills':
          aValue = a.skills.name
          bValue = b.skills.name
          break
        default:
          return 0
      }

      // 比较逻辑
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue, 'zh-CN')
        return sortConfig.order === 'asc' ? comparison : -comparison
      } else {
        const comparison = aValue - bValue
        return sortConfig.order === 'asc' ? comparison : -comparison
      }
    })
  }

  // 实时筛选
  useEffect(() => {
    let results = weapons

    if (selectedType) {
      results = results.filter(weapon => weapon.type === selectedType)
    }

    if (selectedRank) {
      results = results.filter(weapon => weapon.rank === selectedRank)
    }

    if (selectedAttribute) {
      results = results.filter(weapon => weapon.attribute.id === selectedAttribute)
    }

    if (selectedSecondary) {
      results = results.filter(weapon => weapon.secondary.id === selectedSecondary)
    }

    if (selectedSkill) {
      results = results.filter(weapon => weapon.skills.id === selectedSkill)
    }

    setFilteredWeapons(results)
    
    // 清除不在筛选结果中的选中武器
    setCheckedWeapons(prev => prev.filter(id => 
      results.some(weapon => weapon.id === id)
    ))
  }, [selectedType, selectedRank, selectedAttribute, selectedSecondary, selectedSkill])

  // 获取选择的属性名称
  const getSelectedAttributeName = () => {
    const attr = AttributeTag.find(a => a.id === selectedAttribute)
    return attr ? attr.name : null
  }

  const getSelectedSecondaryName = () => {
    const sec = SecondaryTag.find(s => s.id === selectedSecondary)
    return sec ? sec.name : null
  }

  const getSelectedSkillName = () => {
    const skill = SkillsTag.find(s => s.id === selectedSkill)
    return skill ? skill.name : null
  }

  // 检查是否有任何筛选条件
  const hasAnyFilter = selectedType || selectedRank || selectedAttribute || selectedSecondary || selectedSkill

  // 标签按钮组件
  const TagButton = ({ isSelected, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 border rounded-md transition-all ${
        isSelected
          ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
      }`}
    >
      {children}
    </button>
  )

  // 清除按钮组件
  const ClearButton = ({ onClick, show }) => {
    if (!show) return null
    return (
      <button
        onClick={onClick}
        className="ml-2 px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        清除
      </button>
    )
  }

  // 排序图标组件 - 简化版
  const SortIcon = ({ field }) => {
    if (sortConfig.field !== field) {
      return null // 不显示图标
    }

    if (sortConfig.order === 'asc') {
      return <span className="ml-1 text-blue-600">↑</span>
    }

    if (sortConfig.order === 'desc') {
      return <span className="ml-1 text-blue-600">↓</span>
    }

    return null
  }

  // 表头单元格组件 - 简化版
  const SortableHeader = ({ field, children, className = "" }) => (
    <th 
      className={`px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none ${className}`}
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center">
        {children}
        <SortIcon field={field} />
      </span>
    </th>
  )

  // 获取选中的武器对象
  const selectedWeaponsData = weapons.filter(w => checkedWeapons.includes(w.id))
  const commonLocations = findCommonLocations(selectedWeaponsData)

  // 应用排序
  const sortedWeapons = sortWeapons(filteredWeapons)

  return (
    <div className="space-y-6">
      {/* 筛选区域 */}
      <div className="space-y-4">
        {/* 查看全部 */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <span className="font-medium text-gray-700 w-20">查看全部</span>
          <TagButton
            isSelected={!selectedType && !selectedRank && !selectedAttribute && !selectedSecondary && !selectedSkill}
            onClick={() => {
              setSelectedType(null)
              setSelectedRank(null)
              setSelectedAttribute(null)
              setSelectedSecondary(null)
              setSelectedSkill(null)
            }}
          >
            查看全部
          </TagButton>
        </div>

        {/* 稀有度 */}
        <div className="flex items-start gap-3">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20 pt-2">稀有度</span>
            <ClearButton 
              show={selectedRank !== null} 
              onClick={() => setSelectedRank(null)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {ranks.map(rank => (
              <TagButton
                key={rank}
                isSelected={selectedRank === rank}
                onClick={() => setSelectedRank(selectedRank === rank ? null : rank)}
              >
                {rank}星
              </TagButton>
            ))}
          </div>
        </div>

        {/* 武器种类 */}
        <div className="flex items-start gap-3">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20 pt-2">武器种类</span>
            <ClearButton 
              show={selectedType !== null} 
              onClick={() => setSelectedType(null)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {weaponTypes.map(type => (
              <TagButton
                key={type}
                isSelected={selectedType === type}
                onClick={() => setSelectedType(selectedType === type ? null : type)}
              >
                {type}
              </TagButton>
            ))}
          </div>
        </div>

        {/* 基础属性 */}
        <div className="flex items-start gap-3">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20 pt-2">基础属性</span>
            <ClearButton 
              show={selectedAttribute !== null} 
              onClick={() => setSelectedAttribute(null)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {AttributeTag.filter(attr => attr.id !== 0).map(attr => (
              <TagButton
                key={attr.id}
                isSelected={selectedAttribute === attr.id}
                onClick={() => setSelectedAttribute(selectedAttribute === attr.id ? null : attr.id)}
              >
                {attr.name}
              </TagButton>
            ))}
          </div>
        </div>

        {/* 附加属性 */}
        <div className="flex items-start gap-3">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20 pt-2">附加属性</span>
            <ClearButton 
              show={selectedSecondary !== null} 
              onClick={() => setSelectedSecondary(null)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {SecondaryTag.filter(sec => sec.id !== 0).map(sec => (
              <TagButton
                key={sec.id}
                isSelected={selectedSecondary === sec.id}
                onClick={() => setSelectedSecondary(selectedSecondary === sec.id ? null : sec.id)}
              >
                {sec.name}
              </TagButton>
            ))}
          </div>
        </div>

        {/* 技能属性 */}
        <div className="flex items-start gap-3">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20 pt-2">技能属性</span>
            <ClearButton 
              show={selectedSkill !== null} 
              onClick={() => setSelectedSkill(null)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {SkillsTag.filter(skill => skill.id !== 0).map(skill => (
              <TagButton
                key={skill.id}
                isSelected={selectedSkill === skill.id}
                onClick={() => setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
              >
                {skill.name}
              </TagButton>
            ))}
          </div>
        </div>
      </div>

      {/* 当前筛选条件显示 */}
      {hasAnyFilter && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-blue-800 whitespace-nowrap">当前筛选：</span>
            <div className="flex-1">
              <p className="text-blue-700 leading-relaxed">
                {selectedRank && <span className="font-medium">{selectedRank}星</span>}
                {selectedRank && selectedType && <span> · </span>}
                {selectedType && <span className="font-medium">{selectedType}</span>}
                {(selectedRank || selectedType) && (selectedAttribute || selectedSecondary || selectedSkill) && <span> · </span>}
                {selectedAttribute && <span className="font-medium">基础属性: {getSelectedAttributeName()}</span>}
                {selectedAttribute && selectedSecondary && <span> · </span>}
                {selectedSecondary && <span className="font-medium">附加属性: {getSelectedSecondaryName()}</span>}
                {(selectedAttribute || selectedSecondary) && selectedSkill && <span> · </span>}
                {selectedSkill && <span className="font-medium">技能属性: {getSelectedSkillName()}</span>}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 武器列表区域 */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            共 {filteredWeapons.length} 个武器 {checkedWeapons.length > 0 && `（已选择 ${checkedWeapons.length} 个）`}
          </h3>
          {filteredWeapons.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              {checkedWeapons.length === filteredWeapons.length ? '取消全选' : '全选'}
            </button>
          )}
        </div>
        
        {filteredWeapons.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">未找到符合条件的武器</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto flex justify-center">
            <table className="border-collapse border border-gray-200 rounded-lg">
              {/* 表头 */}
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-16 px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">选择</th>
                  <SortableHeader field="name" className="px-4 py-3 border-r border-gray-200">武器名称</SortableHeader>
                  <SortableHeader field="rank" className="w-24 px-4 py-3 text-center border-r border-gray-200">稀有度</SortableHeader>
                  <SortableHeader field="type" className="px-4 py-3 border-r border-gray-200">武器种类</SortableHeader>
                  <SortableHeader field="attribute" className="px-4 py-3 border-r border-gray-200">基础属性</SortableHeader>
                  <SortableHeader field="secondary" className="px-4 py-3 border-r border-gray-200">附加属性</SortableHeader>
                  <SortableHeader field="skills" className="px-4 py-3">技能属性</SortableHeader>
                </tr>
              </thead>

              {/* 表体 */}
              <tbody className="divide-y divide-gray-200">
                {sortedWeapons.map(weapon => (
                  <tr
                    key={weapon.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      checkedWeapons.includes(weapon.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    {/* 复选框 */}
                    <td className="px-4 py-3 text-center border-r border-gray-200">
                      <input
                        type="checkbox"
                        checked={checkedWeapons.includes(weapon.id)}
                        onChange={() => toggleWeaponCheck(weapon.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

                    {/* 武器名称 */}
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap border-r border-gray-200">
                      {weapon.name}
                    </td>

                    {/* 稀有度 */}
                    <td className="px-4 py-3 text-center border-r border-gray-200">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium whitespace-nowrap"
                        style={{ backgroundColor: getRankColor(weapon.rank) }}
                      >
                        {weapon.rank}星
                      </span>
                    </td>

                    {/* 武器种类 */}
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap border-r border-gray-200">
                      {weapon.type}
                    </td>

                    {/* 基础属性 */}
                    <td className="px-4 py-3 border-r border-gray-200">
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm whitespace-nowrap">
                        {weapon.attribute.name}
                      </span>
                    </td>

                    {/* 附加属性 */}
                    <td className="px-4 py-3 border-r border-gray-200">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-sm whitespace-nowrap">
                        {weapon.secondary.name}
                      </span>
                    </td>

                    {/* 技能属性 */}
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm whitespace-nowrap">
                        {weapon.skills.name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 可刷取地点显示 */}
      {checkedWeapons.length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            可同时刷取所有选中武器的地点
          </h3>
          
          {commonLocations.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-700 font-medium">没有地点可以同时刷取所有选中的武器</p>
              <p className="text-yellow-600 text-sm mt-2">请尝试减少选择的武器数量，或选择属性更接近的武器</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonLocations.map(location => (
                <div
                  key={location.id}
                  className="border border-green-200 bg-green-50 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-800 text-lg">{location.name}</h4>
                    <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      可刷取
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">附加属性：</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {location.secondary.map(sec => (
                          <span
                            key={sec.id}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                          >
                            {sec.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">技能属性：</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {location.skills.map(skill => (
                          <span
                            key={skill.id}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AttributeFilter