import { Link, useNavigate } from 'react-router-dom'
import { useMe } from '../../api/useMe'
import { logout } from '../../api/auth'
import { useAction } from '../../api/useApi'
import { useComingSoon } from '../../components/useComingSoon'
import SubPage from '../../components/SubPage'
import Character from '../../components/ui/Character'
import Button from '../../components/ui/Button'
import './ProfileSettingsScreen.css'

/** I02_ProfileSettings — 프로필 정보 + 계정 관리 */
export default function ProfileSettingsScreen() {
  const navigate = useNavigate()
  const me = useMe()
  const name = me?.name || '게스트'
  /* 비밀번호·연결계정·회원탈퇴는 붙일 API 를 만들기로 한 적이 없다(범위 밖).
     줄은 남기고 눌렀을 때 준비 중임을 알린다. ComingSoon.jsx 참고. */
  const [comingSoon, notify] = useComingSoon()
  const signingOut = useAction(logout)

  /** 서버 호출이 실패해도 로컬 세션은 지운다 — api/auth.js 가 그렇게 되어 있다 */
  const onLogout = async () => {
    try {
      await signingOut.run()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <SubPage title="프로필 설정" footer={<Button>저장하기</Button>}>
      {/* 프로필 카드 */}
      <section className="profile__card">
        <div className="profile__avatar">
          <Character variant="fullCircle" width={120} />
          <button type="button" className="profile__avatar-edit" aria-label="캐릭터 변경">
            ✎
          </button>
        </div>

        <div>
          <p className="profile__name">
            {name}{' '}
            <span className="profile__pencil" aria-hidden>
              ✎
            </span>
          </p>
          <p className="profile__desc">내 프로필 정보를 수정하세요</p>
        </div>
      </section>

      <h2 className="subpage__section">프로필 정보</h2>
      <div className="subpage__card">
        <Link to="/my/nickname" className="subpage__row">
          <span className="subpage__row-label">닉네임</span>
          <span className="subpage__row-value">
            {name} <span aria-hidden>✎</span>
          </span>
        </Link>

        <div className="subpage__row">
          <span className="subpage__row-label">이메일</span>
          {/* 게스트는 이메일이 없다. 서버가 주는 값만 적는다. */}
          <span className="subpage__row-value">{me?.email || '가입 전이에요'}</span>
        </div>

        {/* 2026-08-21 PATCH /me/password 가 생겨서 준비 중을 걷어냈다. */}
        <button
          type="button"
          className="subpage__row"
          onClick={() => navigate('/my/password')}
        >
          <span className="subpage__row-label">비밀번호</span>
          <span className="subpage__chevron" aria-hidden>
            ›
          </span>
        </button>

        <button type="button" className="subpage__row" onClick={() => notify('연결계정')}>
          <span className="subpage__row-label">연결계정</span>
          <span className="subpage__row-value">Google 계정</span>
        </button>
      </div>

      <h2 className="subpage__section">계정 관리</h2>
      <div className="subpage__card">
        {/* 로그아웃은 API 가 있다(POST /auth/logout). 실제로 부른다. */}
        <button
          type="button"
          className="subpage__row"
          disabled={signingOut.pending}
          onClick={onLogout}
        >
          <span className="subpage__row-label">
            {signingOut.pending ? '나가는 중…' : '로그아웃'}
          </span>
          <span className="subpage__chevron" aria-hidden>
            ›
          </span>
        </button>
        {/* 2026-08-21 DELETE /me 가 생겨서 준비 중을 걷어냈다. */}
        <button
          type="button"
          className="subpage__row"
          onClick={() => navigate('/my/withdraw')}
        >
          <span className="subpage__row-label">회원탈퇴</span>
          <span className="subpage__chevron" aria-hidden>
            ›
          </span>
        </button>
      </div>

      {comingSoon}
    </SubPage>
  )
}
