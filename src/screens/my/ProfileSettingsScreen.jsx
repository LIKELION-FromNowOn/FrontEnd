import { Link } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import Slot from '../../components/ui/Slot'
import Button from '../../components/ui/Button'
import './ProfileSettingsScreen.css'

/** I02_ProfileSettings — 프로필 정보 + 계정 관리 */
export default function ProfileSettingsScreen() {
  return (
    <SubPage title="프로필 설정" footer={<Button>저장하기</Button>}>
      {/* 프로필 카드 */}
      <section className="profile__card">
        <div className="profile__avatar">
          <Slot label="캐릭터" shape="circle" width={110} />
          <button type="button" className="profile__avatar-edit" aria-label="캐릭터 변경">
            ✎
          </button>
        </div>

        <div>
          <p className="profile__name">
            예니 <span className="profile__pencil" aria-hidden>✎</span>
          </p>
          <p className="profile__desc">내 프로필 정보를 수정하세요</p>
        </div>
      </section>

      <h2 className="subpage__section">프로필 정보</h2>
      <div className="subpage__card">
        <Link to="/my/nickname" className="subpage__row">
          <span className="subpage__row-label">닉네임</span>
          <span className="subpage__row-value">
            예니 <span aria-hidden>✎</span>
          </span>
        </Link>

        <div className="subpage__row">
          <span className="subpage__row-label">이메일</span>
          <span className="subpage__row-value">가입한 이메일</span>
        </div>

        <button type="button" className="subpage__row">
          <span className="subpage__row-label">비밀번호</span>
          <span className="subpage__chevron" aria-hidden>›</span>
        </button>

        <div className="subpage__row">
          <span className="subpage__row-label">연결계정</span>
          <span className="subpage__row-value">Google 계정</span>
        </div>
      </div>

      <h2 className="subpage__section">계정 관리</h2>
      <div className="subpage__card">
        <button type="button" className="subpage__row">
          <span className="subpage__row-label">로그아웃</span>
          <span className="subpage__chevron" aria-hidden>›</span>
        </button>
        <button type="button" className="subpage__row">
          <span className="subpage__row-label">회원탈퇴</span>
          <span className="subpage__chevron" aria-hidden>›</span>
        </button>
      </div>
    </SubPage>
  )
}
