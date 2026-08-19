import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import Chip from '../../components/ui/Chip'
import { getSignals } from '../../api/master'
import { submitCheckin } from '../../api/me'
import { useApi, useAction } from '../../api/useApi'
import { CONDITIONS, SIGNAL_GROUPS } from '../options'

/** D01_DailyCheck/Condition — 오늘 컨디션 + 신호 선택 */
export default function ConditionScreen() {
  const navigate = useNavigate()
  const [condition, setCondition] = useState(null)
  const [signals, setSignals] = useState(() => new Set())
  const [etc, setEtc] = useState('')

  /* 징후 목록은 마스터에서 받는다(NOW-MASTER-003).
     시드가 비어 있으면 시안 값으로 그린다 — 데이터가 없는 것이지 연동 실패가 아니다. */
  const master = useApi(getSignals)
  const submitting = useAction(submitCheckin)

  const groups = master.data?.signals?.length
    ? [...new Map(master.data.signals.map((s) => [s.group, []])).keys()].map((label) => ({
        label,
        items: master.data.signals.filter((s) => s.group === label).map((s) => s.name),
      }))
    : SIGNAL_GROUPS

  /** 상태·징후 제출 (NOW-STATE-001). 판정 점수의 입력값이라 컨디션은 반드시 하나 골라야 한다. */
  const onSubmit = async () => {
    try {
      await submitting.run({ condition, signals: [...signals], note: etc })
      navigate('/check/analyzing')
    } catch {
      // 실패 사유는 버튼 위에 뜬다. 고른 값은 그대로 두어 다시 누를 수 있게 한다.
    }
  }

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
      /* 컨디션은 판정 입력값이라 반드시 하나 골라야 한다.
         모르는 경우를 위해 「잘 모르겠어요」가 있으므로 못 고를 상황은 없다. */
      footer={
        <>
          {submitting.error && (
            <p className="screen__hint" role="alert">
              {submitting.errorText}
            </p>
          )}
          <Button disabled={!condition || submitting.pending} onClick={onSubmit}>
            {submitting.pending ? '보내는 중…' : '오늘의 케어 보기'}
          </Button>
        </>
      }
    >
      <section className="screen__group">
        <h2 className="screen__group-title">지금 컨디션</h2>
        <div className="chip-group">
          {CONDITIONS.map((c) => (
            <Chip
              key={c.key}
              selected={condition === c.key}
              onClick={() => setCondition(c.key)}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </section>

      <section className="screen__group">
        <h2 className="screen__group-title">오늘 느껴지는 신호</h2>
        {groups.map((group) => (
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
