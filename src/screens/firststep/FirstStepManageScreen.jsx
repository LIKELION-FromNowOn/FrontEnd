import { Link } from 'react-router-dom'
import SubPage from '../../components/SubPage'
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
  return (
    <SubPage title="내 첫 발자국 관리하기">
      <p className="fsmanage__lead">작은 루틴을 천천히 이어 보세요</p>

      {/* ⚠️ 여기 있던 「이어가는 첫 발자국」과 「완료한 첫 발자국」을 뺐다(2026-08-21).
          둘 다 **원래 만들지 않는 것**이다 —
            연속 달성일은 추후 개선사항으로 넘겼고(NOW-LOG-001 이 streak 을 안 준다),
            완료·진행 개념 자체가 없다(NOW-STEP-005 「완료 버튼이 없다. 기록에 쌓지 않는다」).
          「아직 없어요」로 비워 두면 나중에 올 것처럼 보여서 자리째 뺐다. */}
      <div className="fsmanage__head">
        <h2 className="fsmanage__section">첫 발자국 사례</h2>
        <Link to="/first-step" className="fsmanage__more">
          모두 보기
        </Link>
      </div>
      <p className="fsmanage__empty">다른 사람들이 어떻게 시작했는지 읽어보세요</p>
    </SubPage>
  )
}
