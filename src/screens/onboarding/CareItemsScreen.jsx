import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import CheckItem from '../../components/ui/CheckItem'
import { CARE_ITEM_GROUPS, FREQUENCIES } from '../options'
import './CareItemsScreen.css'

/**
 * C01_Onboarding/CareItems — 관리 항목 선택 + 빈도 설정 (NOW-ITEM-001, NOW-ITEM-002)
 *
 * 항목을 체크하면 그 줄 아래에 빈도 칩이 펼쳐진다.
 * 빈도에 기본값을 두지 않는다 — load 계산이 한쪽으로 쏠려 판정 전체가 틀어지기 때문.
 * 체크한 항목 중 빈도가 비어 있으면 다음으로 넘어갈 수 없다.
 */
export default function CareItemsScreen() {
  const navigate = useNavigate()
  // { 항목명: 빈도키 | null }
  const [picked, setPicked] = useState({})
  const [etc, setEtc] = useState('')

  const toggle = (item) =>
    setPicked((prev) => {
      const next = { ...prev }
      if (item in next) delete next[item]
      else next[item] = null
      return next
    })

  const setFreq = (item, freq) => setPicked((prev) => ({ ...prev, [item]: freq }))

  const chosen = Object.keys(picked)
  const missingFreq = chosen.filter((i) => !picked[i])
  const canProceed = chosen.length > 0 && missingFreq.length === 0

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
      footer={
        <>
          {chosen.length > 0 && missingFreq.length > 0 && (
            <p className="careitems__hint" role="status">
              선택한 항목의 빈도를 골라주세요 ({missingFreq.length}개 남음)
            </p>
          )}
          <Button disabled={!canProceed} onClick={() => navigate('/check')}>
            다음
          </Button>
        </>
      }
    >
      {CARE_ITEM_GROUPS.map((group) => (
        <section key={group.title} className="screen__group">
          <h2 className="screen__group-title">{group.title}</h2>

          <ul className="careitems__list">
            {group.items.map((item) => {
              const isPicked = item in picked
              return (
                <li key={item} className="careitems__row">
                  <CheckItem
                    label={item}
                    checked={isPicked}
                    onChange={() => toggle(item)}
                  />

                  {/* 체크한 항목만 빈도 칩을 펼친다 */}
                  {isPicked && (
                    <div
                      className={`careitems__freq${picked[item] ? '' : ' is-missing'}`}
                    >
                      {FREQUENCIES.map((f) => (
                        <button
                          key={f.key}
                          type="button"
                          className={`careitems__freq-chip${
                            picked[item] === f.key ? ' is-selected' : ''
                          }`}
                          onClick={() => setFreq(item, f.key)}
                          aria-pressed={picked[item] === f.key}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
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
