import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import CheckItem from '../../components/ui/CheckItem'
import { CARE_ITEM_GROUPS } from '../options'

/** C01_Onboarding/CareItems — 관리 항목 선택 */
export default function CareItemsScreen() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(() => new Set())
  const [etc, setEtc] = useState('')

  const toggle = (item) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })

  return (
    <Screen
      title={
        <>
          지금 관리 중인 항목을
          <br />
          선택해주세요
        </>
      }
      subtitle="평소 관리하는 항목을 알려주시면 오늘 상태에 맞게 케어를 추천해드려요. 이 설정은 언제든 바꿀 수 있어요"
      footer={<Button onClick={() => navigate('/check')}>다음</Button>}
    >
      {CARE_ITEM_GROUPS.map((group) => (
        <section key={group.title} className="screen__group">
          <h2 className="screen__group-title">{group.title}</h2>
          <div className="check-grid">
            {group.items.map((item) => (
              <CheckItem
                key={item}
                label={item}
                checked={selected.has(item)}
                onChange={() => toggle(item)}
              />
            ))}
          </div>
        </section>
      ))}

      <label className="screen__field-label" htmlFor="care-etc">
        목록에 없는 항목이 있으면 적어주세요
      </label>
      <textarea
        id="care-etc"
        className="screen__textarea"
        placeholder="직접 입력"
        value={etc}
        onChange={(e) => setEtc(e.target.value)}
      />
    </Screen>
  )
}
