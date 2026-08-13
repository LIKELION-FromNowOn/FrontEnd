import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import Chip from '../../components/ui/Chip'
import { CONDITIONS, SIGNAL_GROUPS } from '../options'

/** D01_DailyCheck/Condition — 오늘 컨디션 + 신호 선택 */
export default function ConditionScreen() {
  const navigate = useNavigate()
  const [condition, setCondition] = useState(null)
  const [signals, setSignals] = useState(() => new Set())
  const [etc, setEtc] = useState('')

  const toggleSignal = (item) =>
    setSignals((prev) => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })

  return (
    <Screen
      back
      title="오늘 컨디션은 어때요?"
      subtitle="지금 상태를 알려주시면 오늘의 케어를 조절할게요"
      footer={<Button onClick={() => navigate('/check/analyzing')}>오늘의 케어 보기</Button>}
    >
      <section className="screen__group">
        <h2 className="screen__group-title">지금 컨디션</h2>
        <div className="chip-group">
          {CONDITIONS.map((c) => (
            <Chip key={c} selected={condition === c} onClick={() => setCondition(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </section>

      <section className="screen__group">
        <h2 className="screen__group-title">오늘 느껴지는 신호</h2>
        {SIGNAL_GROUPS.map((group) => (
          <div key={group.label} className="screen__sub">
            <p className="screen__sub-label">{group.label}</p>
            <div className="chip-group">
              {group.items.map((item) => (
                <Chip
                  key={item}
                  selected={signals.has(item)}
                  onClick={() => toggleSignal(item)}
                >
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </section>

      <label className="screen__field-label" htmlFor="signal-etc">
        목록에 없는 신호가 있으면 적어주세요
      </label>
      <textarea
        id="signal-etc"
        className="screen__textarea"
        placeholder="직접 입력"
        value={etc}
        onChange={(e) => setEtc(e.target.value)}
      />
    </Screen>
  )
}
