import { Link } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import Chip from '../../components/ui/Chip'
import WeekConditionChart from '../../components/WeekConditionChart'
import { getLatestCheckin } from '../../api/me'
import { ERROR } from '../../api/errors'
import { useApi } from '../../api/useApi'
import { CONDITIONS } from '../options'
import './RecordConditionScreen.css'

/**
 * H02_RecordConditionDetail — 기록 탭의 「이번 주 컨디션」.
 *
 * 오늘 답한 값을 보여주고, 고치는 일은 「수정하기」가 원래 화면(D01)으로 넘긴다.
 * 오늘의 컨디션 허브(/condition)와 그래프를 공유한다.
 */

export default function RecordConditionScreen() {
  /* 오늘 답한 컨디션(NOW-STATE-002). 아직 답하지 않았으면 409 NO_CHECKIN 이 온다 —
     오류가 아니라 「아직 안 함」이라 안내 문구로 받는다. */
  const checkin = useApi(getLatestCheckin)
  const today = checkin.data?.state ?? null
  const noCheckin = checkin.error?.code === ERROR.NO_CHECKIN

  return (
    <SubPage title="이번 주 컨디션">
      <div className="rcond__head">
        <h2 className="rcond__section">오늘의 컨디션</h2>
        <Link to="/check" className="rcond__edit">
          수정하기
        </Link>
      </div>

      {noCheckin ? (
        <p className="rcond__empty">오늘은 아직 컨디션을 알려주지 않으셨어요</p>
      ) : (
        <div className="chip-group">
          {CONDITIONS.map((c) => (
            /* 고르는 자리가 아니라 오늘 답한 값을 읽는 자리라 클릭을 막는다 */
            <Chip key={c.key} selected={c.key === today} disabled>
              {c.label}
            </Chip>
          ))}
        </div>
      )}

      <h2 className="rcond__section rcond__section--gap">이번 주 컨디션</h2>
      <WeekConditionChart />
    </SubPage>
  )
}
