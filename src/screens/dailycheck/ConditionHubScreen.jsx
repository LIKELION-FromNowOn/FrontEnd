import { Link } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import Chip from '../../components/ui/Chip'
import WeekConditionChart from '../../components/WeekConditionChart'
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

/* 오늘 답한 컨디션 · 관리 중인 항목 — 서버 연동 시 GET /me, GET /me/items 로 채운다 */
const TODAY = 'normal'
const MY_ITEMS = ['폼 클렌저', '토너·에센스', '크림·로션', '선크림 (야외)']

export default function ConditionHubScreen() {
  return (
    <SubPage title="오늘의 컨디션">
      {/* ── 현재 관리 중인 항목 ── */}
      <div className="chub__head">
        <h2 className="chub__section">현재 관리 중인 항목</h2>
        <Link to="/onboarding/care-items" className="chub__edit">
          수정하기
        </Link>
      </div>

      {MY_ITEMS.length > 0 ? (
        <ul className="chub__items">
          {MY_ITEMS.map((name) => (
            <li key={name} className="chub__item">
              {name}
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

      <div className="chip-group">
        {CONDITIONS.map((c) => (
          /* 고르는 자리가 아니라 오늘 답한 값을 보여주는 자리라 클릭을 막는다 */
          <Chip key={c.key} selected={c.key === TODAY} disabled>
            {c.label}
          </Chip>
        ))}
      </div>

      {/* ── 이번 주 컨디션 ── */}
      <h2 className="chub__section chub__section--gap">이번 주 컨디션</h2>
      <WeekConditionChart />
    </SubPage>
  )
}
