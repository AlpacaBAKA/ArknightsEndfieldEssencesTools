import { useState } from 'react'
import { weapons, locations } from '../data/data.jsx'

const WeaponSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedWeapon, setSelectedWeapon] = useState(null)
  const [matchingLocations, setMatchingLocations] = useState([])

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

    // 查找匹配的武器
    const matches = weapons.filter(weapon => 
      weapon.name.toLowerCase().includes(value.toLowerCase())
    )

    // 按相似度排序
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

  // 选择建议的武器
  const selectSuggestion = (weapon) => {
    setSearchQuery(weapon.name)
    setShowSuggestions(false)
  }

  // 点击搜索按钮
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('请输入武器名称')
      return
    }

    // 查找完全匹配的武器
    const weapon = weapons.find(w => 
      w.name.toLowerCase() === searchQuery.toLowerCase()
    )

    if (!weapon) {
      alert('未找到该武器，请从建议列表中选择')
      return
    }

    setSelectedWeapon(weapon)

    // 查找可以刷取该武器的地点
    // 逻辑：地点的 secondary 和 skills 中都包含武器对应的属性
    const foundLocations = locations.filter(location => {
      // 检查是否有匹配的附加属性
      const hasSecondary = location.secondary.some(sec => sec.id === weapon.secondary.id)
      // 检查是否有匹配的技能属性
      const hasSkills = location.skills.some(skill => skill.id === weapon.skills.id)
      
      // 打印调试信息
      console.log(`地点: ${location.name}`)
      console.log(`  武器需要 - 附加: ${weapon.secondary.name}(${weapon.secondary.id}), 技能: ${weapon.skills.name}(${weapon.skills.id})`)
      console.log(`  地点有 - 附加: ${location.secondary.map(s => s.name).join(', ')}`)
      console.log(`  地点有 - 技能: ${location.skills.map(s => s.name).join(', ')}`)
      console.log(`  匹配结果: 附加=${hasSecondary}, 技能=${hasSkills}`)
      
      return hasSecondary && hasSkills
    })

    console.log(`找到 ${foundLocations.length} 个匹配地点`)
    setMatchingLocations(foundLocations)
  }

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery('')
    setSearchSuggestions([])
    setShowSuggestions(false)
    setSelectedWeapon(null)
    setMatchingLocations([])
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
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* 搜索输入框 */}
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                placeholder="输入武器名称..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
              
              {/* 清除按钮 */}
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
            
            {/* 搜索按钮 */}
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

          {/* 搜索建议下拉框 */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              zIndex: 10,
              width: '100%',
              marginTop: '8px',
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

          {/* 无匹配结果 */}
          {showSuggestions && searchQuery && searchSuggestions.length === 0 && (
            <div style={{
              position: 'absolute',
              zIndex: 10,
              width: '100%',
              marginTop: '8px',
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
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            武器信息
          </h3>
          
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
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            可刷取的地点（共 {matchingLocations.length} 个）
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
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
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span style={{ fontWeight: '500', color: '#374151' }}>需要配置的附加属性：</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#dcfce7',
                          color: '#16a34a',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {selectedWeapon.secondary.name}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span style={{ fontWeight: '500', color: '#374151' }}>需要配置的技能属性：</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#dbeafe',
                          color: '#2563eb',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {selectedWeapon.skills.name}
                      </span>
                    </div>
                  </div>
                </div>
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
            该武器的属性组合可能无法在现有地点中刷取
          </p>
        </div>
      )}
    </div>
  )
}

export default WeaponSearch