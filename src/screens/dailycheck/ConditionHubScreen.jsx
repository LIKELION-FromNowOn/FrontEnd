import { Link } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import Chip from '../../components/ui/Chip'
import WeekConditionChart from '../../components/WeekConditionChart'
import { getLatestCheckin, getMyItems } from '../../api/me'
import { ERROR } from '../../api/errors'
import { useApi } from '../../api/useApi'
import { CONDITIONS } from '../options'
import './ConditionHubScreen.css'

/**
 * F_WeeklyCondition — 오늘의 컨디션 (허브).
 * 홈 히어로의 «오늘의 컨디션» 바로가기가 여기로 온다.
 *
 * 읽기 전용 요약 화면이다. 고치는 일은 각 «수정하기»가 원래 화면으로 넘긴다.
 *   현재 관리 중인 항목 → C01 관리 항목 선택
 *   오늘의 컨디션      → D01 오늘 컨디션
 */

export default function ConditionHubScreen() {
  /* 관리 중인 항목은 서버에서 받는다(NOW-ITEM-001).
     직접 입력으로 만든 항목(custom: true)도 같은 목록에 섞여서 온다. */
  const myItems = useApi(getMyItems)
  const items = myItems.data ?? []

  /* 오늘 답한 컨디션은 최근 상태 체크에서 가져온다(NOW-STATE-002).
     GET /me 의 currentState 는 「지금 상태」라 전환까지 반영된 값이고,
     이 화면이 보여주려는 것은 **오늘 사용자가 고른 답**이라 다르다.
     아직 답하지 않았으면 409 NO_CHECKIN 이 온다 — 오류가 아니라 「아직 안 함」이다. */
  const checkin = useApi(getLatestCheckin)
  const today = checkin.data?.state ?? null
  const noCheckin = checkin.error?.code === ERROR.NO_CHECKIN

  return (
    <SubPage title="오늘의 컨디션">
      {/* ── 현재 관리 중인 항목 ── */}
      <div className="chub__head">
        <h2 className="chub__section">현재 관리 중인 항목</h2>
        <Link to="/onboarding/care-items" className="chub__edit">
          수정하기
        </Link>
      </div>

      {myItems.loading ? (
        <p className="chub__empty" role="status">
          불러오는 중…
        </p>
      ) : myItems.error ? (
        <p className="chub__empty" role="alert">
          {myItems.errorText}
        </p>
      ) : items.length > 0 ? (
        <ul className="chub__items">
          {items.map((it) => (
            <li key={it.itemId} className="chub__item">
              {it.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="chub__empty">아직 선택한 관리 항목이 없어요</p>
      )}

      {/* ── 오늘의 컨디션 ── */}
      <div className="chub__head chub__head--gap">
        <h2 className="chub__section">오늘의 컨디션</h2>
        <Link to="/check" className="chub__edit">
          수정하기
        </Link>
      </div>

      {noCheckin ? (
        <p className="chub__empty">오늘은 아직 컨디션을 알려주지 않으셨어요</p>
      ) : (
        <div className="chip-group">
          {CONDITIONS.map((c) => (
            /* 고르는 자리가 아니라 오늘 답한 값을 보여주는 자리라 클릭을 막는다 */
            <Chip key={c.key} selected={c.key === today} disabled>
              {c.label}
            </Chip>
          ))}
        </div>
      )}

      {/* ── 이번 주 컨디션 ── */}
      <h2 className="chub__section chub__section--gap">이번 주 컨디션</h2>
      <WeekConditionChart />
    </SubPage>
  )
}
