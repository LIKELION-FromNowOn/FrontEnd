import { Link } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import Chip from '../../components/ui/Chip'
import WeekConditionChart from '../../components/WeekConditionChart'
import { CONDITIONS } from '../options'
import './RecordConditionScreen.css'

/**
 * H02_RecordConditionDetail — 기록 탭의 「이번 주 컨디션」.
 *
 * 오늘 답한 값을 보여주고, 고치는 일은 「수정하기」가 원래 화면(D01)으로 넘긴다.
 * 오늘의 컨디션 허브(/condition)와 그래프를 공유한다.
 */

/* 오늘 답한 컨디션 — 서버 연동 시 GET /checkins/latest (NOW-STATE-002) 로 채운다 */
const TODAY = 'normal'

export default function RecordConditionScreen() {
  return (
    <SubPage title="이번 주 컨디션">
      <div className="rcond__head">
        <h2 className="rcond__section">오늘의 컨디션</h2>
        <Link to="/check" className="rcond__edit">
          수정하기
        </Link>
      </div>

      <div className="chip-group">
        {CONDITIONS.map((c) => (
          /* 고르는 자리가 아니라 오늘 답한 값을 읽는 자리라 클릭을 막는다 */
          <Chip key={c.key} selected={c.key === TODAY} disabled>
            {c.label}
          </Chip>
        ))}
      </div>

      <h2 className="rcond__section rcond__section--gap">이번 주 컨디션</h2>
      <WeekConditionChart />
    </SubPage>
  )
}
