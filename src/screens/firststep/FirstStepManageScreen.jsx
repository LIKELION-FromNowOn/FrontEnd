import { Link, useNavigate } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import StreakCard from '../../components/StreakCard'
import { ACTIVE_STREAK, DONE_STREAKS } from '../options'
import './FirstStepManageScreen.css'

/**
 * F_FirstStepManage — 내 첫 발자국 관리하기.
 * 홈 히어로의 «내 첫 발자국 관리하기» 바로가기가 여기로 온다.
 *
 * 이어가는 첫 발자국(진행 중 1건) + 완료한 첫 발자국(목록)으로 나뉜다.
 * 둘 다 서버 연동 전이라 목 데이터를 쓴다.
 */
export default function FirstStepManageScreen() {
  const navigate = useNavigate()
  const streak = ACTIVE_STREAK

  return (
    <SubPage title="내 첫 발자국 관리하기">
      <p className="fsmanage__lead">작은 루틴을 천천히 이어 보세요</p>

      <div className="fsmanage__head">
        <h2 className="fsmanage__section">이어가는 첫 발자국</h2>
        <Link to="/first-step" className="fsmanage__more">
          다른 첫 발자국 보기
        </Link>
      </div>

      {streak ? (
        <StreakCard
          title={streak.title}
          day={streak.day}
          total={streak.total}
          onContinue={() => navigate('/care/start')}
        />
      ) : (
        <p className="fsmanage__empty">아직 이어가는 첫 발자국이 없어요</p>
      )}

      <h2 className="fsmanage__section fsmanage__section--gap">완료한 첫 발자국</h2>

      {DONE_STREAKS.length > 0 ? (
        <ul className="fsmanage__done">
          {DONE_STREAKS.map((s) => (
            <li key={s.id} className="fsmanage__done-row">
              <span className="fsmanage__done-title">{s.title}</span>
              <span className="fsmanage__done-date">{s.finishedAt}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="fsmanage__empty">아직 완료한 첫 발자국이 없어요</p>
      )}
    </SubPage>
  )
}
