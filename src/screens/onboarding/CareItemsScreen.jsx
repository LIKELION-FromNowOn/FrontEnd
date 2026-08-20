import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import CheckItem from '../../components/ui/CheckItem'
import { getCareItems, getCategories } from '../../api/master'
import {
  addCustomItem,
  categoryName,
  deleteMyItem,
  saveMyItems,
  toGroups,
} from '../../api/me'
import { useApi, useAction } from '../../api/useApi'
import { FREQUENCIES, MIN_CARE_ITEMS } from '../options'
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
 *
 * ⚠️ 「직접 입력」은 이 화면의 저장(PUT /me/items)에 실어 보내지 않는다. **400 이 난다.**
 *    적는 즉시 POST /me/items/custom 으로 따로 만들고, 지울 때는 DELETE /me/items/{itemId} 다
 *    (2026-08-20 백엔드 확정). 위기 문구가 들어오면 서버가 AI 를 부르기 전에 400 TEXT_REJECTED 로 막는다.
 */
export default function CareItemsScreen() {
  const navigate = useNavigate()
  /* { itemId: 빈도키 | null } — 빈도를 받지 않는 항목은 값이 계속 null이다.
     ⚠️ 항목명이 아니라 **itemId** 로 들고 있는다. 저장(PUT /me/items)이 id 를 받는다. */
  const [picked, setPicked] = useState({})
  const [etc, setEtc] = useState('')

  /* 마스터에서 항목을 받는다(NOW-MASTER-002 · 실측 32건).
     ⚠️ 실패하면 시안 값으로 대신 그리지 않는다 — 시안 항목에는 서버 id 가 없어서
     다 고르고 「다음」을 누른 뒤에야 400 이 난다. 못 받았으면 못 받았다고 띄운다. */
  const master = useApi(getCareItems)
  const cats = useApi(getCategories)
  const saving = useAction(saveMyItems)
  const groups = toGroups(master.data)

  /* 직접 입력은 목록 저장과 경로가 다르다 — 만들 때 POST, 지울 때 DELETE.
     서버가 만들어 준 항목(itemId 가 cu_ 로 시작)을 그대로 들고 있는다. */
  const [customs, setCustoms] = useState([])
  const adding = useAction(addCustomItem)
  const removing = useAction(deleteMyItem)

  /** 직접 입력 추가 (NOW-ITEM-003). 서버가 이름·분류·하한선을 정해서 돌려준다. */
  const onAddCustom = async () => {
    const text = etc.trim()
    if (!text) return
    try {
      const made = await adding.run(text)
      setCustoms((prev) => [...prev, made])
      setEtc('')
    } catch {
      /* 위기 문구(400 TEXT_REJECTED)면 적은 내용을 지우지 않는다.
         고쳐 쓸 수 있게 그대로 두고 사유만 아래에 띄운다. */
    }
  }

  /** 직접 입력 삭제 (NOW-ITEM-004). 3개 미만이 되면 서버가 400 으로 막는다. */
  const onRemoveCustom = async (itemId) => {
    try {
      await removing.run(itemId)
    } catch {
      return
    }
    setCustoms((prev) => prev.filter((c) => c.itemId !== itemId))
  }

  const toggle = (itemId) =>
    setPicked((prev) => {
      const next = { ...prev }
      if (itemId in next) delete next[itemId]
      else next[itemId] = null
      return next
    })

  const setFreq = (itemId, freq) => setPicked((prev) => ({ ...prev, [itemId]: freq }))

  /* 빈도가 필요한데 아직 안 고른 항목.
     빈도를 받지 않는 항목은 frequency: null 로 보내면 서버가 받아준다(실측). */
  const needsFreq = groups
    .flatMap((g) => g.items)
    .filter((it) => it.freqEditable && it.itemId in picked && !picked[it.itemId])
  // 최소 개수를 채워야 넘어간다. 항목이 적으면 판정할 것이 없어 덜어내기가 빈 화면이 된다.
  const chosenCount = Object.keys(picked).length
  const needsMore = Math.max(0, MIN_CARE_ITEMS - chosenCount)
  const canProceed = needsMore === 0 && needsFreq.length === 0

  /**
   * 고른 항목·빈도를 저장하고 다음으로 (NOW-ITEM-002).
   * 보내는 것은 { itemId, frequency } 다 — 이름으로 보내면 400 VALIDATION_FAILED 다.
   */
  const onNext = async () => {
    try {
      await saving.run(
        Object.entries(picked).map(([itemId, frequency]) => ({ itemId, frequency })),
      )
      navigate('/check')
    } catch {
      // 실패 사유는 버튼 위에 뜬다. 화면은 그대로 두어 다시 누를 수 있게 한다.
    }
  }

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
          {saving.error && (
            <p className="careitems__hint" role="alert">
              {saving.errorText}
            </p>
          )}
          <Button disabled={!canProceed || saving.pending} onClick={onNext}>
            {saving.pending ? '저장하는 중…' : '다음'}
          </Button>
        </>
      }
    >
      {master.loading && (
        <p className="careitems__hint" role="status">
          관리 항목을 불러오는 중…
        </p>
      )}

      {!master.loading && groups.length === 0 && (
        <p className="careitems__hint" role="alert">
          {master.error
            ? master.errorText
            : '관리 항목을 불러오지 못했어요. 잠시 후에 다시 열어주세요'}
        </p>
      )}

      {groups.map((group) => (
        <section key={group.title} className="screen__group">
          <h2 className="screen__group-title">{group.title}</h2>

          <ul className="careitems__list">
            {group.items.map((it) => {
              const isPicked = it.itemId in picked
              const showFreq = isPicked && it.freqEditable

              return (
                <li key={it.itemId} className="careitems__row">
                  <CheckItem
                    label={it.name}
                    checked={isPicked}
                    onChange={() => toggle(it.itemId)}
                  />

                  {showFreq && (
                    <div
                      className={`careitems__freq${
                        picked[it.itemId] ? '' : ' is-missing'
                      }`}
                    >
                      {FREQUENCIES.map((f) => (
                        <button
                          key={f.key}
                          type="button"
                          className={`careitems__freq-chip${
                            picked[it.itemId] === f.key ? ' is-selected' : ''
                          }`}
                          onClick={() => setFreq(it.itemId, f.key)}
                          aria-pressed={picked[it.itemId] === f.key}
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

      <button
        type="button"
        className="careitems__add"
        disabled={!etc.trim() || adding.pending}
        onClick={onAddCustom}
      >
        {adding.pending ? '담는 중…' : '이 항목 추가하기'}
      </button>

      {adding.error && (
        <p className="careitems__hint" role="alert">
          {adding.errorText}
        </p>
      )}

      {customs.length > 0 && (
        <ul className="careitems__customs">
          {customs.map((c) => (
            <li key={c.itemId} className="careitems__custom">
              <span className="careitems__custom-name">{c.name}</span>
              {/* 서버가 정해준 분류를 보여준다. 화면에서 짐작해 붙이지 않는다.
                  ⚠️ c.category 는 코드(care·move…)라 그대로 띄우면 「move」가 나온다. */}
              {categoryName(cats.data, c.category) && (
                <span className="careitems__custom-cat">
                  {categoryName(cats.data, c.category)}
                </span>
              )}
              <button
                type="button"
                className="careitems__custom-del"
                disabled={removing.pending}
                onClick={() => onRemoveCustom(c.itemId)}
                aria-label={`${c.name} 빼기`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {removing.error && (
        <p className="careitems__hint" role="alert">
          {removing.errorText}
        </p>
      )}
    </Screen>
  )
}
