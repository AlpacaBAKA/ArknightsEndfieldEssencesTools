import { useState, useEffect } from 'react'
import { AttributeTag, SecondaryTag, SkillsTag, weapons, locations } from '../data/data.jsx'

const AttributeFilter = ({ filterPreset }) => {
  const [selectedAttributes, setSelectedAttributes] = useState([])
  const [selectedSecondaries, setSelectedSecondaries] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedRanks, setSelectedRanks] = useState([])
  const [filteredWeapons, setFilteredWeapons] = useState(weapons)
  const [checkedWeapons, setCheckedWeapons] = useState([]) // 选中的武器列表
  
  // 排序状态: { field: string, order: 'asc' | 'desc' | null }
  const [sortConfig, setSortConfig] = useState({ field: null, order: null })

  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

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
    
    // 检查是否所有武器有相同的 secondary
    const secondaryIds = weaponsList.map(w => w.secondary.id)
    const hasSameSecondary = new Set(secondaryIds).size === 1
    
    // 检查是否所有武器有相同的 skills
    const skillsIds = weaponsList.map(w => w.skills.id)
    const hasSameSkills = new Set(skillsIds).size === 1
    
    // 检查 attribute 种类数量
    const attributeIds = [...new Set(weaponsList.map(w => w.attribute.id))]
    const attributeCount = attributeIds.length
    
    // 如果不满足基本条件，返回空数组
    if (!hasSameSecondary && !hasSameSkills) {
      return []
    }
    
    if (attributeCount > 3) {
      return []
    }
    
    // 筛选符合条件的地点
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

  // 应用来自策略面板的预设属性
  useEffect(() => {
    if (!filterPreset) return
    setSelectedAttributes(filterPreset.attributes || [])
    setSelectedSecondaries(filterPreset.secondaries || [])
    setSelectedSkills(filterPreset.skills || [])
  }, [filterPreset])

  // 实时筛选
  useEffect(() => {
    let results = weapons

    if (selectedTypes.length > 0) {
      results = results.filter(weapon => selectedTypes.includes(weapon.type))
    }

    if (selectedRanks.length > 0) {
      results = results.filter(weapon => selectedRanks.includes(weapon.rank))
    }

    if (selectedAttributes.length > 0) {
      results = results.filter(weapon => selectedAttributes.includes(weapon.attribute.id))
    }

    if (selectedSecondaries.length > 0) {
      results = results.filter(weapon => selectedSecondaries.includes(weapon.secondary.id))
    }

    if (selectedSkills.length > 0) {
      results = results.filter(weapon => selectedSkills.includes(weapon.skills.id))
    }

    setFilteredWeapons(results)
    
    setCheckedWeapons(prev => prev.filter(id => 
      results.some(weapon => weapon.id === id)
    ))
  }, [selectedTypes, selectedRanks, selectedAttributes, selectedSecondaries, selectedSkills])

  // 获取选择的属性名称
  const getSelectedAttributeNames = () => {
    return AttributeTag.filter(a => selectedAttributes.includes(a.id))
  }

  const getSelectedSecondaryNames = () => {
    return SecondaryTag.filter(s => selectedSecondaries.includes(s.id))
  }

  const getSelectedSkillNames = () => {
    return SkillsTag.filter(s => selectedSkills.includes(s.id))
  }

  // 检查是否有任何筛选条件
  const hasAnyFilter = selectedTypes.length > 0 || selectedRanks.length > 0 || selectedAttributes.length > 0 || selectedSecondaries.length > 0 || selectedSkills.length > 0
  // 标签按钮组件
  const TagButton = ({ isSelected, onClick, children }) => (
    <button
      onClick={onClick}
      style={{
        padding: '6px 16px',
        border: isSelected ? '1px solid var(--ink-deep)' : '1px solid var(--hairline)',
        borderRadius: 'var(--r-full)',
        transition: 'background-color 0.15s, border-color 0.15s, color 0.15s',
        backgroundColor: isSelected ? 'var(--ink-deep)' : 'transparent',
        color: isSelected ? 'var(--on-dark)' : 'var(--steel)',
        fontWeight: '500',
        cursor: 'pointer',
        fontSize: '14px',
        lineHeight: '1.50'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--hairline-strong)'
          e.currentTarget.style.color = 'var(--charcoal)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--hairline)'
          e.currentTarget.style.color = 'var(--steel)'
        }
      }}
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
        style={{
          marginLeft: '8px',
          padding: '3px 10px',
          fontSize: '13px',
          backgroundColor: 'transparent',
          color: 'var(--slate)',
          border: '1px solid var(--hairline-strong)',
          borderRadius: 'var(--r-sm)',
          cursor: 'pointer'
        }}
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
      return <span className="ml-1" style={{ color: 'var(--primary)' }}>↑</span>
    }

    if (sortConfig.order === 'desc') {
      return <span className="ml-1" style={{ color: 'var(--primary)' }}>↓</span>
    }

    return null
  }

  // 表头单元格组件 - 简化版
  const SortableHeader = ({ field, children, className = "" }) => (
    <th
      className={`px-4 py-3 text-sm font-semibold cursor-pointer select-none transition-colors ${className}`}
      style={{ color: 'var(--charcoal)' }}
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

   const handleSearchInput = (value) => {
    setSearchQuery(value)
    
    if (value.trim() === '') {
      setSearchSuggestions([])
      setShowSuggestions(false)
      return
    }

    // 查找匹配的武器
    const matches = weapons.filter(weapon => 
      weapon.name.toLowerCase().includes(value.toLowerCase())
    )

    // 按相似度排序：完全匹配 > 开头匹配 > 包含匹配
    const sorted = matches.sort((a, b) => {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      const query = value.toLowerCase()

      // 完全匹配优先
      if (aName === query) return -1
      if (bName === query) return 1

      // 开头匹配次之
      if (aName.startsWith(query) && !bName.startsWith(query)) return -1
      if (bName.startsWith(query) && !aName.startsWith(query)) return 1

      // 其他按字母顺序
      return aName.localeCompare(bName, 'zh-CN')
    })

    // 只取前3个
    setSearchSuggestions(sorted.slice(0, 3))
    setShowSuggestions(true)
  }

  // 新增：选择建议的武器
  const selectSuggestion = (weapon) => {
    setSearchQuery(weapon.name)
    setShowSuggestions(false)
  }

  // 新增：处理搜索按钮点击（暂时不做操作）
  const handleSearch = () => {
    // 暂时不做任何操作
    console.log('搜索:', searchQuery)
  }

  // 新增：清除搜索
  const clearSearch = () => {
    setSearchQuery('')
    setSearchSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-6 w-full text-left mx-0 self-start">
      {/* 筛选区域 */}
      <div className="space-y-4">
        {/* 查看全部 */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <span className="font-medium text-gray-700 w-20">查看全部</span>
          <TagButton
            isSelected={selectedTypes.length === 0 && selectedRanks.length === 0 && selectedAttributes.length === 0 && selectedSecondaries.length === 0 && selectedSkills.length === 0}
            onClick={() => {
              setSelectedTypes([])
              setSelectedRanks([])
              setSelectedAttributes([])
              setSelectedSecondaries([])
              setSelectedSkills([])
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
              show={selectedRanks.length > 0} 
              onClick={() => setSelectedRanks([])}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {ranks.map(rank => (
              <TagButton
                key={rank}
                isSelected={selectedRanks.includes(rank)}
                onClick={() => setSelectedRanks(prev => 
                  prev.includes(rank)
                    ? prev.filter(r => r !== rank)
                    : [...prev, rank]
                )}
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
              show={selectedTypes.length > 0} 
              onClick={() => setSelectedTypes([])}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {weaponTypes.map(type => (
              <TagButton
                key={type}
                isSelected={selectedTypes.includes(type)}
                onClick={() => setSelectedTypes(prev => 
                  prev.includes(type)
                    ? prev.filter(t => t !== type)
                    : [...prev, type]
                )}
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
              show={selectedAttributes.length > 0} 
              onClick={() => setSelectedAttributes([])}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {AttributeTag.filter(attr => attr.id !== 0).map(attr => (
              <TagButton
                key={attr.id}
                isSelected={selectedAttributes.includes(attr.id)}
                onClick={() => setSelectedAttributes(prev => 
                  prev.includes(attr.id) 
                    ? prev.filter(id => id !== attr.id) 
                    : [...prev, attr.id]
                )}
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
              show={selectedSecondaries.length > 0} 
              onClick={() => setSelectedSecondaries([])}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {SecondaryTag.filter(sec => sec.id !== 0).map(sec => (
              <TagButton
                key={sec.id}
                isSelected={selectedSecondaries.includes(sec.id)}
                onClick={() => setSelectedSecondaries(prev => 
                  prev.includes(sec.id) 
                    ? prev.filter(id => id !== sec.id) 
                    : [...prev, sec.id]
                )}
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
              show={selectedSkills.length > 0} 
              onClick={() => setSelectedSkills([])}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {SkillsTag.filter(skill => skill.id !== 0).map(skill => (
              <TagButton
                key={skill.id}
                isSelected={selectedSkills.includes(skill.id)}
                onClick={() => setSelectedSkills(prev => 
                  prev.includes(skill.id) 
                    ? prev.filter(id => id !== skill.id) 
                    : [...prev, skill.id]
                )}
              >
                {skill.name}
              </TagButton>
            ))}
          </div>
        </div>
      </div>

      {/* 当前筛选条件显示 - 可点击取消 */}
      {hasAnyFilter && (
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)',
          padding: '14px 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontWeight: '500',
              color: 'var(--steel)',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}>
              当前筛选：
            </span>

            {selectedRanks.map(rank => (
              <button
                key={`filter-rank-${rank}`}
                onClick={() => setSelectedRanks(prev => prev.filter(r => r !== rank))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '2px 8px', backgroundColor: 'var(--tint-peach)', color: 'var(--brand-orange-deep)',
                  border: '1px solid var(--tint-peach)', borderRadius: 'var(--r-sm)', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                {rank}星
                <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
              </button>
            ))}
            
            {selectedTypes.map(type => (
              <button
                key={`filter-type-${type}`}
                onClick={() => setSelectedTypes(prev => prev.filter(t => t !== type))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '2px 8px', backgroundColor: 'var(--tint-lavender)', color: 'var(--brand-purple-800)',
                  border: '1px solid var(--tint-lavender)', borderRadius: 'var(--r-sm)', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                {type}
                <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
              </button>
            ))}

            {getSelectedAttributeNames().map(attr => (
              <button
                key={`filter-attr-${attr.id}`}
                onClick={() => setSelectedAttributes(prev => prev.filter(id => id !== attr.id))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '2px 8px', backgroundColor: 'var(--tint-lavender)', color: 'var(--brand-purple-800)',
                  border: '1px solid var(--tint-lavender)', borderRadius: 'var(--r-sm)', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                基础: {attr.name}
                <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
              </button>
            ))}

            {getSelectedSecondaryNames().map(sec => (
              <button
                key={`filter-sec-${sec.id}`}
                onClick={() => setSelectedSecondaries(prev => prev.filter(id => id !== sec.id))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '2px 8px', backgroundColor: 'var(--tint-mint)', color: 'var(--brand-green)',
                  border: '1px solid var(--tint-mint)', borderRadius: 'var(--r-sm)', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                附加: {sec.name}
                <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
              </button>
            ))}

            {getSelectedSkillNames().map(skill => (
              <button
                key={`filter-skill-${skill.id}`}
                onClick={() => setSelectedSkills(prev => prev.filter(id => id !== skill.id))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '2px 8px', backgroundColor: 'var(--tint-sky)', color: 'var(--link-blue)',
                  border: '1px solid var(--tint-sky)', borderRadius: 'var(--r-sm)', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                技能: {skill.name}
                <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
              </button>
            ))}

            {/* 清除全部按钮 */}
            <button
              onClick={() => {
                setSelectedTypes([])
                setSelectedRanks([])
                setSelectedAttributes([])
                setSelectedSecondaries([])
                setSelectedSkills([])
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '2px 8px', backgroundColor: 'transparent',
                color: 'var(--steel)', border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--r-sm)', fontSize: '13px', fontWeight: '500',
                cursor: 'pointer', transition: 'all 0.15s', marginLeft: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface)'
                e.currentTarget.style.color = 'var(--ink)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--steel)'
              }}
            >
              清除全部
            </button>
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
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                backgroundColor: 'var(--surface)',
                color: 'var(--charcoal)',
                border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--r-md)',
                cursor: 'pointer'
              }}
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
          <div className="w-full overflow-x-auto">
            <div className="flex justify-start">
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
                      className="transition-colors"
                      style={{
                        backgroundColor: checkedWeapons.includes(weapon.id) ? 'var(--tint-lavender)' : 'transparent'
                      }}
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
                          className="inline-block text-sm font-semibold whitespace-nowrap"
                          style={{
                            backgroundColor: getRankColor(weapon.rank),
                            color: 'var(--ink-deep)',
                            padding: '2px 8px',
                            borderRadius: 'var(--r-xs)'
                          }}
                        >
                          {weapon.rank}★
                        </span>
                      </td>

                      {/* 武器种类 */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap border-r border-gray-200">
                        {weapon.type}
                      </td>

                      {/* 基础属性 */}
                      <td className="px-4 py-3 border-r border-gray-200">
                        <span
                          className="inline-block text-sm whitespace-nowrap"
                          style={{ padding: '2px 8px', backgroundColor: 'var(--tint-lavender)', color: 'var(--brand-purple-800)', borderRadius: 'var(--r-xs)', fontWeight: '500' }}
                        >
                          {weapon.attribute.name}
                        </span>
                      </td>

                      {/* 附加属性 */}
                      <td className="px-4 py-3 border-r border-gray-200">
                        <span
                          className="inline-block text-sm whitespace-nowrap"
                          style={{ padding: '2px 8px', backgroundColor: 'var(--tint-mint)', color: 'var(--brand-green)', borderRadius: 'var(--r-xs)', fontWeight: '500' }}
                        >
                          {weapon.secondary.name}
                        </span>
                      </td>

                      {/* 技能属性 */}
                      <td className="px-4 py-3">
                        <span
                          className="inline-block text-sm whitespace-nowrap"
                          style={{ padding: '2px 8px', backgroundColor: 'var(--tint-sky)', color: 'var(--link-blue)', borderRadius: 'var(--r-xs)', fontWeight: '500' }}
                        >
                          {weapon.skills.name}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <div style={{ backgroundColor: 'var(--tint-yellow-bold)', borderRadius: 'var(--r-lg)', padding: '24px', textAlign: 'center' }}>
              <p style={{ color: 'var(--brand-orange-deep)', fontWeight: '500' }}>没有地点可以同时刷取所有选中的武器</p>
              <p style={{ color: 'var(--brand-orange)', fontSize: '14px', marginTop: '8px' }}>请尝试减少选择的武器数量，或选择属性更接近的武器</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonLocations.map(location => {
                // 计算需要筛选的词条
                const requiredAttribute = [...new Set(selectedWeaponsData.map(w => w.attribute.id))]
                const attributeToSelect = AttributeTag.filter(attr => 
                  requiredAttribute.includes(attr.id)
                )
                
                // 检查是否所有武器有相同的 secondary
                const secondaryIds = selectedWeaponsData.map(w => w.secondary.id)
                const hasSameSecondary = new Set(secondaryIds).size === 1
                
                // 检查是否所有武器有相同的 skills
                const skillsIds = selectedWeaponsData.map(w => w.skills.id)
                const hasSameSkills = new Set(skillsIds).size === 1
                
                // 只有当所有武器有相同的 secondary 时才显示
                const secondaryToSelect = hasSameSecondary 
                  ? location.secondary.filter(sec => sec.id === secondaryIds[0])
                  : []
                
                // 只有当所有武器有相同的 skills 时才显示
                const skillsToSelect = hasSameSkills 
                  ? location.skills.filter(skill => skill.id === skillsIds[0])
                  : []

                return (
                  <div
                    key={location.id}
                    style={{
                      backgroundColor: 'var(--tint-mint)',
                      border: '1px solid var(--hairline)',
                      borderRadius: 'var(--r-lg)',
                      padding: '20px',
                      transition: 'box-shadow 0.15s'
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-800 text-lg">{location.name}</h4>
                      <span style={{
                        padding: '4px 10px',
                        backgroundColor: 'var(--success)',
                        color: 'var(--on-dark)',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: 'var(--r-full)'
                      }}>
                        可刷取
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {/* 需要筛选的词条 */}
                      <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #bbf7d0' }}>
                        <span className="font-medium text-gray-700">需要筛选的词条：</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {attributeToSelect.map(attr => (
                            <span
                              key={`select-attr-${attr.id}`}
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                backgroundColor: 'var(--tint-lavender)',
                                color: 'var(--brand-purple-800)',
                                borderRadius: 'var(--r-xs)',
                                fontSize: '13px',
                                fontWeight: '600'
                              }}
                            >
                              {attr.name}
                            </span>
                          ))}
                          {secondaryToSelect.map(sec => (
                            <span
                              key={`select-sec-${sec.id}`}
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                backgroundColor: 'var(--tint-mint)',
                                color: 'var(--brand-green)',
                                borderRadius: 'var(--r-xs)',
                                fontSize: '13px',
                                fontWeight: '600'
                              }}
                            >
                              {sec.name}
                            </span>
                          ))}
                          {skillsToSelect.map(skill => (
                            <span
                              key={`select-skill-${skill.id}`}
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                backgroundColor: 'var(--tint-sky)',
                                color: 'var(--link-blue)',
                                borderRadius: 'var(--r-xs)',
                                fontSize: '13px',
                                fontWeight: '600'
                              }}
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AttributeFilter