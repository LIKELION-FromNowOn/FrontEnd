import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import CheckItem from '../../components/ui/CheckItem'
import { CARE_ITEM_GROUPS, FREQUENCIES, MIN_CARE_ITEMS } from '../options'
import './CareItemsScreen.css'

/**
 * C01_Onboarding/CareItems — 관리 항목 선택 + 빈도 설정 (NOW-ITEM-001, NOW-ITEM-002)
 *
 * 항목을 체크하면 그 줄 아래에 빈도 칩이 펼쳐진다.
 * 빈도에 기본값을 두지 않는다 — load 계산이 한쪽으로 쏠려 판정 전체가 틀어지기 때문.
 * 체크한 항목 중 빈도가 비어 있으면 다음으로 넘어갈 수 없다.
 *
 * 단 freqEditable: false 인 항목(클리닉 안내·처방약·정기 검진)은 빈도를 받지 않으므로
 * 칩도 띄우지 않고 다음 버튼도 막지 않는다.
 */
export default function CareItemsScreen() {
  const navigate = useNavigate()
  // { 항목명: 빈도키 | null }  — 빈도를 받지 않는 항목은 값이 계속 null이다
  const [picked, setPicked] = useState({})
  const [etc, setEtc] = useState('')

  const toggle = (name) =>
    setPicked((prev) => {
      const next = { ...prev }
      if (name in next) delete next[name]
      else next[name] = null
      return next
    })

  const setFreq = (name, freq) => setPicked((prev) => ({ ...prev, [name]: freq }))

  // 빈도가 필요한데 아직 안 고른 항목
  const needsFreq = CARE_ITEM_GROUPS.flatMap((g) => g.items).filter(
    (it) => it.freqEditable && it.name in picked && !picked[it.name],
  )
  // 최소 개수를 채워야 넘어간다. 항목이 적으면 판정할 것이 없어 덜어내기가 빈 화면이 된다.
  const chosenCount = Object.keys(picked).length
  const needsMore = Math.max(0, MIN_CARE_ITEMS - chosenCount)
  const canProceed = needsMore === 0 && needsFreq.length === 0

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
          {needsMore > 0 ? (
            <p className="careitems__hint" role="status">
              {MIN_CARE_ITEMS}개 이상 골라주세요 ({needsMore}개 남음)
            </p>
          ) : (
            needsFreq.length > 0 && (
              <p className="careitems__hint" role="status">
                선택한 항목의 빈도를 골라주세요 ({needsFreq.length}개 남음)
              </p>
            )
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
            {group.items.map((it) => {
              const isPicked = it.name in picked
              const showFreq = isPicked && it.freqEditable

              return (
                <li key={it.name} className="careitems__row">
                  <CheckItem
                    label={it.name}
                    checked={isPicked}
                    onChange={() => toggle(it.name)}
                  />

                  {showFreq && (
                    <div
                      className={`careitems__freq${picked[it.name] ? '' : ' is-missing'}`}
                    >
                      {FREQUENCIES.map((f) => (
                        <button
                          key={f.key}
                          type="button"
                          className={`careitems__freq-chip${
                            picked[it.name] === f.key ? ' is-selected' : ''
                          }`}
                          onClick={() => setFreq(it.name, f.key)}
                          aria-pressed={picked[it.name] === f.key}
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
