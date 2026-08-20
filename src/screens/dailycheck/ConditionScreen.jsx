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

  /* 마스터가 붙으면 서버 징후로, 실패하면 시안 문구로 그린다.
     ✅ 2026-08-20 실측 — 서버가 14건을 5그룹(피부·수면·마음·관계·생활)으로 준다.
     그룹 순서도 서버가 `groups` 로 알려주므로 화면에서 다시 정하지 않는다. */
  const serverSignals = master.data?.signals ?? []
  const groups = serverSignals.length
    ? (master.data?.groups ?? [...new Set(serverSignals.map((x) => x.group))]).map(
        (label) => ({
          label,
          items: serverSignals.filter((x) => x.group === label).map((x) => x.name),
        }),
      )
    : SIGNAL_GROUPS

  /**
   * 고른 징후를 서버가 아는 id 와 모르는 문구로 가른다.
   *
   * 이름을 signalIds 로 보내면 서버가 오류 대신 **signalScore 0** 을 돌려준다.
   * 조용히 0 이 되면 전환 제안이 영영 안 떠서, 아는 것만 id 로 보내고
   * 나머지는 직접 입력(customSignals)으로 넘긴다.
   *
   * 직접 입력은 개당 customWeight(2점), customMax(5점)까지만 더해진다 — 서버가 정하는 값이다.
   */
  const splitSignals = () => {
    // ⚠️ 식별자 필드 이름은 `id` 다 (`signalId` 아님 — 2026-08-20 실측)
    const byName = new Map(serverSignals.map((x) => [x.name, x.id]))
    const ids = []
    const custom = []
    for (const name of signals) {
      const id = byName.get(name)
      if (id) ids.push(id)
      else custom.push(name)
    }
    if (etc.trim()) custom.push(etc.trim())
    return { signalIds: ids, customSignals: custom }
  }

  /** 상태·징후 제출 (NOW-STATE-001). 판정 점수의 입력값이라 컨디션은 반드시 하나 골라야 한다. */
  const onSubmit = async () => {
    try {
      await submitting.run({ condition, ...splitSignals() })
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
