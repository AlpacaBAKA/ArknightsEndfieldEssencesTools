import { useState } from 'react'
import { weapons, locations, AttributeTag } from '../data/data.jsx'

const WeaponSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedWeapon, setSelectedWeapon] = useState(null)
  const [matchingLocations, setMatchingLocations] = useState([])
  const [showOnlyBest, setShowOnlyBest] = useState(false)
  
  // 额外条件武器
  const [extraWeapon1, setExtraWeapon1] = useState('')
  const [extraWeapon2, setExtraWeapon2] = useState('')
  const [extraSuggestions1, setExtraSuggestions1] = useState([])
  const [extraSuggestions2, setExtraSuggestions2] = useState([])
  const [showExtraSuggestions1, setShowExtraSuggestions1] = useState(false)
  const [showExtraSuggestions2, setShowExtraSuggestions2] = useState(false)
  const [selectedExtraWeapon1, setSelectedExtraWeapon1] = useState(null)
  const [selectedExtraWeapon2, setSelectedExtraWeapon2] = useState(null)

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

  // 处理搜索输入
  const handleSearchInput = (value) => {
    setSearchQuery(value)
    
    if (value.trim() === '') {
      setSearchSuggestions([])
      setShowSuggestions(false)
      return
    }

    const matches = weapons.filter(weapon => 
      weapon.name.toLowerCase().includes(value.toLowerCase())
    )

    const sorted = matches.sort((a, b) => {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      const query = value.toLowerCase()

      if (aName === query) return -1
      if (bName === query) return 1
      if (aName.startsWith(query) && !bName.startsWith(query)) return -1
      if (bName.startsWith(query) && !aName.startsWith(query)) return 1
      return aName.localeCompare(bName, 'zh-CN')
    })

    setSearchSuggestions(sorted.slice(0, 3))
    setShowSuggestions(true)
  }

  // 处理额外条件搜索输入
  const handleExtraSearchInput = (value, extraNum) => {
    if (extraNum === 1) {
      setExtraWeapon1(value)
    } else {
      setExtraWeapon2(value)
    }
    
    if (value.trim() === '') {
      if (extraNum === 1) {
        setExtraSuggestions1([])
        setShowExtraSuggestions1(false)
      } else {
        setExtraSuggestions2([])
        setShowExtraSuggestions2(false)
      }
      return
    }

    const matches = weapons.filter(weapon => 
      weapon.name.toLowerCase().includes(value.toLowerCase())
    )

    const sorted = matches.sort((a, b) => {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      const query = value.toLowerCase()

      if (aName === query) return -1
      if (bName === query) return 1
      if (aName.startsWith(query) && !bName.startsWith(query)) return -1
      if (bName.startsWith(query) && !aName.startsWith(query)) return 1
      return aName.localeCompare(bName, 'zh-CN')
    })

    if (extraNum === 1) {
      setExtraSuggestions1(sorted.slice(0, 3))
      setShowExtraSuggestions1(true)
    } else {
      setExtraSuggestions2(sorted.slice(0, 3))
      setShowExtraSuggestions2(true)
    }
  }

  // 选择建议的武器
  const selectSuggestion = (weapon) => {
    setSearchQuery(weapon.name)
    setShowSuggestions(false)
  }

  // 选择额外条件武器
  const selectExtraSuggestion = (weapon, extraNum) => {
    if (extraNum === 1) {
      setExtraWeapon1(weapon.name)
      setSelectedExtraWeapon1(weapon)
      setShowExtraSuggestions1(false)
    } else {
      setExtraWeapon2(weapon.name)
      setSelectedExtraWeapon2(weapon)
      setShowExtraSuggestions2(false)
    }
  }

  // 生成所有可能的 attribute 组合（2个或3个，排除"无基础属性"）
  const generateAttributeCombinations = () => {
    const combinations = []
    const validAttributes = AttributeTag.filter(attr => attr.id !== 0) // 排除id为0的"无基础属性"
    
    // 生成2个attribute的组合
    for (let i = 0; i < validAttributes.length; i++) {
      for (let j = i + 1; j < validAttributes.length; j++) {
        combinations.push([validAttributes[i], validAttributes[j]])
      }
    }
    
    // 生成3个attribute的组合
    for (let i = 0; i < validAttributes.length; i++) {
      for (let j = i + 1; j < validAttributes.length; j++) {
        for (let k = j + 1; k < validAttributes.length; k++) {
          combinations.push([validAttributes[i], validAttributes[j], validAttributes[k]])
        }
      }
    }
    
    return combinations
  }

  // 查找使用特定 attribute 组合 + 副词条能刷取的武器
  const findWeaponsWithConfig = (location, attrCombo, secondaryAttr, fixedType, extraWeapons = []) => {
    const attrIds = new Set(attrCombo.map(a => a.id))
    const matchedWeapons = []
    
    weapons.forEach(weapon => {
      // 武器的 attribute 必须在组合中（或者是"无基础属性"）
      if (weapon.attribute.id !== 0 && !attrIds.has(weapon.attribute.id)) return
      
      if (fixedType === 'skills') {
        // 固定技能属性，检查 secondary 是否在地点中
        if (weapon.skills.id === secondaryAttr.id) {
          const hasSecondaryInLocation = location.secondary.some(sec => sec.id === weapon.secondary.id)
          if (hasSecondaryInLocation) {
            matchedWeapons.push(weapon)
          }
        }
      } else if (fixedType === 'secondary') {
        // 固定附加属性，检查 skills 是否在地点中
        if (weapon.secondary.id === secondaryAttr.id) {
          const hasSkillsInLocation = location.skills.some(skill => skill.id === weapon.skills.id)
          if (hasSkillsInLocation) {
            matchedWeapons.push(weapon)
          }
        }
      }
    })
    
    // 如果有额外条件，检查是否包含所有额外武器
    if (extraWeapons.length > 0) {
      const hasAllExtra = extraWeapons.every(extraWeapon => 
        matchedWeapons.some(w => w.id === extraWeapon.id)
      )
      if (!hasAllExtra) {
        return []
      }
    }
    
    return matchedWeapons
  }

  // 计算策略得分（用于排序）
  const calculateStrategyScore = (matchedWeapons) => {
    const totalCount = matchedWeapons.length
    
    // 计算高星级武器数量
    const rank6Count = matchedWeapons.filter(w => w.rank === 6).length
    const rank5Count = matchedWeapons.filter(w => w.rank === 5).length
    const rank4Count = matchedWeapons.filter(w => w.rank === 4).length
    
    // 得分公式：总数量 * 1000 + 6星*100 + 5星*10 + 4星*1
    return totalCount * 1000 + rank6Count * 100 + rank5Count * 10 + rank4Count * 1
  }

  // 点击搜索按钮
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('请输入武器名称')
      return
    }

    const weapon = weapons.find(w => 
      w.name.toLowerCase() === searchQuery.toLowerCase()
    )

    if (!weapon) {
      alert('未找到该武器，请从建议列表中选择')
      return
    }

    setSelectedWeapon(weapon)

    // 收集额外条件武器
    const extraWeapons = []
    if (selectedExtraWeapon1) extraWeapons.push(selectedExtraWeapon1)
    if (selectedExtraWeapon2) extraWeapons.push(selectedExtraWeapon2)

    // 查找可以刷取该武器的地点及配置策略
    const foundLocations = []
    
    locations.forEach(location => {
      // 检查该地点是否能刷取目标武器
      const hasSkills = location.skills.some(skill => skill.id === weapon.skills.id)
      const hasSecondary = location.secondary.some(sec => sec.id === weapon.secondary.id)
      
      if (!hasSkills || !hasSecondary) return
      
      // 检查额外条件武器是否也能在这个地点刷取
      const canGetExtraWeapons = extraWeapons.every(extraWeapon => {
        const hasExtraSkills = location.skills.some(skill => skill.id === extraWeapon.skills.id)
        const hasExtraSecondary = location.secondary.some(sec => sec.id === extraWeapon.secondary.id)
        return hasExtraSkills && hasExtraSecondary
      })
      
      if (!canGetExtraWeapons) return
      
      const strategies = []
      const allAttrCombos = generateAttributeCombinations()
      
      // 策略1：固定 skills（技能属性）
      allAttrCombos.forEach(attrCombo => {
        const attrIds = attrCombo.map(a => a.id)
        
        // 确保至少有2个attribute
        if (attrCombo.length < 2) return
        
        // 目标武器的 attribute 必须在组合中（除非是"无基础属性"）
        if (weapon.attribute.id !== 0 && !attrIds.includes(weapon.attribute.id)) return
        
        // 检查额外条件武器的 attribute 是否也在组合中
        const extraAttrsValid = extraWeapons.every(extraWeapon => 
          extraWeapon.attribute.id === 0 || attrIds.includes(extraWeapon.attribute.id)
        )
        if (!extraAttrsValid) return
        
        const matchedWeapons = findWeaponsWithConfig(location, attrCombo, weapon.skills, 'skills', extraWeapons)
        
        // 必须包含目标武器和所有额外条件武器
        if (!matchedWeapons.find(w => w.id === weapon.id)) return
        const hasAllExtra = extraWeapons.every(extraWeapon => 
          matchedWeapons.find(w => w.id === extraWeapon.id)
        )
        if (!hasAllExtra) return
        
        // 从匹配武器中移除目标武器和额外条件武器
        const filteredWeapons = matchedWeapons.filter(w => 
          w.id !== weapon.id && !extraWeapons.some(extra => extra.id === w.id)
        )
        
        strategies.push({
          type: 'skills',
          fixedType: 'skills',
          attributeCombo: attrCombo,
          fixedSecondaryAttr: weapon.skills,
          randomSecondaryAttr: 'secondary',
          matchedWeapons: filteredWeapons,
          score: calculateStrategyScore(filteredWeapons)
        })
      })
      
      // 策略2：固定 secondary（附加属性）
      allAttrCombos.forEach(attrCombo => {
        const attrIds = attrCombo.map(a => a.id)
        
        // 确保至少有2个attribute
        if (attrCombo.length < 2) return
        
        // 目标武器的 attribute 必须在组合中（除非是"无基础属性"）
        if (weapon.attribute.id !== 0 && !attrIds.includes(weapon.attribute.id)) return
        
        // 检查额外条件武器的 attribute 是否也在组合中
        const extraAttrsValid = extraWeapons.every(extraWeapon => 
          extraWeapon.attribute.id === 0 || attrIds.includes(extraWeapon.attribute.id)
        )
        if (!extraAttrsValid) return
        
        const matchedWeapons = findWeaponsWithConfig(location, attrCombo, weapon.secondary, 'secondary', extraWeapons)
        
        // 必须包含目标武器和所有额外条件武器
        if (!matchedWeapons.find(w => w.id === weapon.id)) return
        const hasAllExtra = extraWeapons.every(extraWeapon => 
          matchedWeapons.find(w => w.id === extraWeapon.id)
        )
        if (!hasAllExtra) return
        
        // 从匹配武器中移除目标武器和额外条件武器
        const filteredWeapons = matchedWeapons.filter(w => 
          w.id !== weapon.id && !extraWeapons.some(extra => extra.id === w.id)
        )
        
        strategies.push({
          type: 'secondary',
          fixedType: 'secondary',
          attributeCombo: attrCombo,
          fixedSecondaryAttr: weapon.secondary,
          randomSecondaryAttr: 'skills',
          matchedWeapons: filteredWeapons,
          score: calculateStrategyScore(filteredWeapons)
        })
      })
      
      // 按得分排序策略
      strategies.sort((a, b) => b.score - a.score)
      
      if (strategies.length > 0) {
        foundLocations.push({
          ...location,
          strategies: strategies,
          bestScore: strategies[0].score // 最高分
        })
      }
    })

    // 按每个地点的最佳策略得分排序
    foundLocations.sort((a, b) => b.bestScore - a.bestScore)
    
    setMatchingLocations(foundLocations)
  }

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery('')
    setSearchSuggestions([])
    setShowSuggestions(false)
    setSelectedWeapon(null)
    setMatchingLocations([])
    setShowOnlyBest(false)
    setExtraWeapon1('')
    setExtraWeapon2('')
    setSelectedExtraWeapon1(null)
    setSelectedExtraWeapon2(null)
  }

  // 清除额外条件
  const clearExtraWeapon = (extraNum) => {
    if (extraNum === 1) {
      setExtraWeapon1('')
      setSelectedExtraWeapon1(null)
      setExtraSuggestions1([])
      setShowExtraSuggestions1(false)
    } else {
      setExtraWeapon2('')
      setSelectedExtraWeapon2(null)
      setExtraSuggestions2([])
      setShowExtraSuggestions2(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 搜索区域 */}
      <div style={{
        background: 'linear-gradient(to right, #faf5ff, #eff6ff)',
        border: '1px solid #e9d5ff',
        borderRadius: '8px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          🔍 武器刷取策略查询
        </h3>
        
        <div style={{ position: 'relative' }}>
          {/* 主搜索框 */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                placeholder="输入主刷取武器..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
              
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            
            <button
              onClick={handleSearch}
              style={{
                padding: '12px 32px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              查询
            </button>
          </div>

          {/* 额外条件搜索框 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* 额外条件1 */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={extraWeapon1}
                onChange={(e) => handleExtraSearchInput(e.target.value, 1)}
                onFocus={() => extraWeapon1 && setShowExtraSuggestions1(true)}
                placeholder="无额外刷取武器"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  color: extraWeapon1 ? '#1f2937' : '#9ca3af'
                }}
              />
              
              {extraWeapon1 && (
                <button
                  onClick={() => clearExtraWeapon(1)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              )}
              
              {/* 额外条件1建议下拉框 */}
              {showExtraSuggestions1 && extraSuggestions1.length > 0 && (
                <div style={{
                  position: 'absolute',
                  zIndex: 10,
                  width: '100%',
                  marginTop: '4px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {extraSuggestions1.map((weapon) => (
                    <button
                      key={weapon.id}
                      onClick={() => selectExtraSuggestion(weapon, 1)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        textAlign: 'left',
                        backgroundColor: 'white',
                        border: 'none',
                        borderBottom: '1px solid #f3f4f6',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <span style={{ fontWeight: '500', color: '#1f2937' }}>{weapon.name}</span>
                      <span style={{
                        marginLeft: '8px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '500',
                        backgroundColor: getRankColor(weapon.rank)
                      }}>
                        {weapon.rank}星
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 额外条件2 */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={extraWeapon2}
                onChange={(e) => handleExtraSearchInput(e.target.value, 2)}
                onFocus={() => extraWeapon2 && setShowExtraSuggestions2(true)}
                placeholder="无额外刷取武器"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  color: extraWeapon2 ? '#1f2937' : '#9ca3af'
                }}
              />
              
              {extraWeapon2 && (
                <button
                  onClick={() => clearExtraWeapon(2)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              )}
              
              {/* 额外条件2建议下拉框 */}
              {showExtraSuggestions2 && extraSuggestions2.length > 0 && (
                <div style={{
                  position: 'absolute',
                  zIndex: 10,
                  width: '100%',
                  marginTop: '4px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {extraSuggestions2.map((weapon) => (
                    <button
                      key={weapon.id}
                      onClick={() => selectExtraSuggestion(weapon, 2)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        textAlign: 'left',
                        backgroundColor: 'white',
                        border: 'none',
                        borderBottom: '1px solid #f3f4f6',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <span style={{ fontWeight: '500', color: '#1f2937' }}>{weapon.name}</span>
                      <span style={{
                        marginLeft: '8px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '500',
                        backgroundColor: getRankColor(weapon.rank)
                      }}>
                        {weapon.rank}星
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 主搜索建议下拉框 */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              zIndex: 10,
              width: 'calc(100% - 120px)',
              marginTop: '-12px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              {searchSuggestions.map((weapon) => (
                <button
                  key={weapon.id}
                  onClick={() => selectSuggestion(weapon)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    textAlign: 'left',
                    backgroundColor: 'white',
                    border: 'none',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>{weapon.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: getRankColor(weapon.rank)
                      }}>
                        {weapon.rank}星
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{weapon.type}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', fontSize: '12px' }}>
                    <span style={{ padding: '4px 8px', backgroundColor: '#f3e8ff', color: '#7c3aed', borderRadius: '4px' }}>
                      {weapon.attribute.name}
                    </span>
                    <span style={{ padding: '4px 8px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '4px' }}>
                      {weapon.secondary.name}
                    </span>
                    <span style={{ padding: '4px 8px', backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '4px' }}>
                      {weapon.skills.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showSuggestions && searchQuery && searchSuggestions.length === 0 && (
            <div style={{
              position: 'absolute',
              zIndex: 10,
              width: 'calc(100% - 120px)',
              marginTop: '-12px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '16px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              未找到匹配的武器
            </div>
          )}
        </div>
      </div>

      {/* 选中的武器信息 */}
      {selectedWeapon && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
              武器信息
            </h3>
            
            {(selectedExtraWeapon1 || selectedExtraWeapon2) && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>额外条件：</span>
                {selectedExtraWeapon1 && (
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {selectedExtraWeapon1.name}
                  </span>
                )}
                {selectedExtraWeapon2 && (
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {selectedExtraWeapon2.name}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <span style={{ color: '#6b7280' }}>武器名称：</span>
              <span style={{ fontWeight: '600', color: '#1f2937', marginLeft: '8px' }}>
                {selectedWeapon.name}
              </span>
            </div>
            
            <div>
              <span style={{ color: '#6b7280' }}>稀有度：</span>
              <span style={{
                marginLeft: '8px',
                padding: '4px 12px',
                borderRadius: '9999px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: getRankColor(selectedWeapon.rank)
              }}>
                {selectedWeapon.rank}星
              </span>
            </div>
            
            <div>
              <span style={{ color: '#6b7280' }}>武器种类：</span>
              <span style={{ fontWeight: '500', color: '#1f2937', marginLeft: '8px' }}>
                {selectedWeapon.type}
              </span>
            </div>
            
            <div>
              <span style={{ color: '#6b7280' }}>基础属性：</span>
              <span style={{
                marginLeft: '8px',
                padding: '4px 8px',
                backgroundColor: '#f3e8ff',
                color: '#7c3aed',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                {selectedWeapon.attribute.name}
              </span>
            </div>
            
            <div>
              <span style={{ color: '#6b7280' }}>附加属性：</span>
              <span style={{
                marginLeft: '8px',
                padding: '4px 8px',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                {selectedWeapon.secondary.name}
              </span>
            </div>
            
            <div>
              <span style={{ color: '#6b7280' }}>技能属性：</span>
              <span style={{
                marginLeft: '8px',
                padding: '4px 8px',
                backgroundColor: '#dbeafe',
                color: '#2563eb',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                {selectedWeapon.skills.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 可刷取的地点列表 */}
      {selectedWeapon && matchingLocations.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
              可刷取的地点（共 {matchingLocations.length} 个）
            </h3>
            
            <button
              onClick={() => setShowOnlyBest(!showOnlyBest)}
              style={{
                padding: '8px 20px',
                backgroundColor: showOnlyBest ? '#7c3aed' : '#f3f4f6',
                color: showOnlyBest ? 'white' : '#374151',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {showOnlyBest ? '✓ 仅显示最优策略' : '显示所有策略'}
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {matchingLocations.map((location) => (
              <div
                key={location.id}
                style={{
                  border: '1px solid #86efac',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                    {location.name}
                  </h4>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '9999px'
                  }}>
                    可刷取
                  </span>
                </div>
                
                {/* 刷取策略 */}
                {(showOnlyBest ? location.strategies.slice(0, 1) : location.strategies).map((strategy, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: index < (showOnlyBest ? 0 : location.strategies.length - 1) ? '20px' : '0',
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      border: index === 0 ? '2px solid #22c55e' : '1px solid #d1fae5'
                    }}
                  >
                    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: index === 0 ? '#22c55e' : (strategy.type === 'skills' ? '#dbeafe' : '#dcfce7'),
                        color: index === 0 ? 'white' : (strategy.type === 'skills' ? '#2563eb' : '#16a34a'),
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {index === 0 ? '⭐ 最优策略' : `策略 ${index + 1}`}
                      </span>
                      
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        可获得 {strategy.matchedWeapons.length} 个武器
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#6b7280', fontSize: '14px', minWidth: '120px' }}>固定主属性组：</span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {strategy.attributeCombo.map((attr, i) => (
                            <span
                              key={i}
                              style={{
                                padding: '4px 10px',
                                backgroundColor: '#f3e8ff',
                                color: '#7c3aed',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: '500'
                              }}
                            >
                              {attr.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#6b7280', fontSize: '14px', minWidth: '120px' }}>固定副词条：</span>
                        <span style={{
                          padding: '4px 10px',
                          backgroundColor: strategy.fixedType === 'skills' ? '#2563eb' : '#16a34a',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          {strategy.fixedSecondaryAttr.name}
                        </span>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>
                          ({strategy.fixedType === 'skills' ? '技能属性' : '附加属性'})
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#6b7280', fontSize: '14px', minWidth: '120px' }}>随机副词条：</span>
                        <span style={{ color: '#374151', fontSize: '14px' }}>
                          该地点的所有{strategy.randomSecondaryAttr === 'secondary' ? '附加属性' : '技能属性'}（8个）
                        </span>
                      </div>
                    </div>
                    
                    {/* 使用此策略还能刷取的武器 */}
                    {strategy.matchedWeapons.length > 0 && (
                      <div style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid #e5e7eb'
                      }}>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '15px' }}>
                            💡 使用此配置还能刷取：
                          </span>
                          <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '14px' }}>
                            （共 {strategy.matchedWeapons.length} 个武器）
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {strategy.matchedWeapons.map((otherWeapon) => (
                            <div
                              key={otherWeapon.id}
                              style={{
                                padding: '8px 12px',
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <span style={{ fontWeight: '500', color: '#1f2937', fontSize: '14px' }}>
                                {otherWeapon.name}
                              </span>
                              <span style={{
                                padding: '2px 6px',
                                borderRadius: '4px',
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: '500',
                                backgroundColor: getRankColor(otherWeapon.rank)
                              }}>
                                {otherWeapon.rank}星
                              </span>
                              <span style={{
                                padding: '2px 6px',
                                backgroundColor: '#e0e7ff',
                                color: '#4338ca',
                                borderRadius: '3px',
                                fontSize: '11px'
                              }}>
                                {otherWeapon.type}
                              </span>
                              <span style={{
                                padding: '2px 6px',
                                backgroundColor: '#f3e8ff',
                                color: '#7c3aed',
                                borderRadius: '3px',
                                fontSize: '11px'
                              }}>
                                {otherWeapon.attribute.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 无结果提示 */}
      {selectedWeapon && matchingLocations.length === 0 && (
        <div style={{
          backgroundColor: '#fefce8',
          border: '1px solid #fde047',
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#a16207', fontWeight: '500', fontSize: '18px' }}>
            未找到可以刷取该武器的地点
          </p>
          <p style={{ color: '#ca8a04', fontSize: '14px', marginTop: '8px' }}>
            {(selectedExtraWeapon1 || selectedExtraWeapon2) 
              ? '该武器组合无法在同一地点同时刷取'
              : '该武器的属性组合可能无法在现有地点中刷取'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default WeaponSearch