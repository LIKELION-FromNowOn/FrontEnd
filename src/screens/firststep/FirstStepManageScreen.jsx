import { Link, useNavigate } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import StreakCard from '../../components/StreakCard'
import './FirstStepManageScreen.css'

/**
 * F_FirstStepManage — 내 첫 발자국 관리하기.
 * 홈 히어로의 «내 첫 발자국 관리하기» 바로가기가 여기로 온다.
 *
 * 이어가는 첫 발자국(진행 중) + 완료한 첫 발자국(목록)으로 나뉜다.
 * ⚠️ 둘 다 서버에 값이 없다. 목으로 채우지 않고 「아직 없어요」로 둔다 —
 *    지어낸 값을 넣으면 모든 사용자에게 같은 루틴이 진행 중인 것처럼 보인다.
 */
export default function FirstStepManageScreen() {
  const navigate = useNavigate()
  /* ⚠️ 「이어가는 첫 발자국」을 채울 값이 **어느 API 에도 없다.**
     GET /home 응답에 streak 이 없다(2026-08-21 실측). 시안 값으로 대신 그리면
     시작한 적 없는 루틴이 모든 사용자에게 「1일차」로 똑같이 뜬다.
     서버가 주기 전까지는 카드를 띄우지 않는다. 필드가 생기면 이 한 줄만 고치면 된다. */
  const streak = null

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

      {/* 완료한 첫 발자국도 주는 API 가 없다. 생기면 여기에 목록을 그린다. */}
      <p className="fsmanage__empty">아직 완료한 첫 발자국이 없어요</p>
    </SubPage>
  )
}
