import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import Button from '../../components/ui/Button'
import { withdraw } from '../../api/auth'
import { useMe } from '../../api/useMe'
import { useAction } from '../../api/useApi'
import { ERROR } from '../../api/errors'
import './AccountScreen.css'

/**
 * I02-2_My/Withdraw — 회원 탈퇴 (DELETE /me).
 *
 * ⚠️ 되돌릴 수 없다. **누르기 전에** 그렇다고 적어 둔다. 비밀번호도 같이 받는다.
 *
 * ⚠️ 성공하면 api/auth.js 의 withdraw() 가 세션을 지우고 캐시를 비운다.
 *    서버가 토큰을 무효화하지 않기 때문에(JWT 만 쓴다) 이쪽에서 안 지우면
 *    남은 토큰으로 계속 부르다가 401 을 만난다.
 *
 * 문구는 사실만 적는다 — 계정 정보(이메일·비밀번호)는 지워지고,
 * 항목·판정·기록은 다른 표가 참조해서 DB 에 남는다. 같은 이메일로 다시 가입할 수 있다.
 */
export default function WithdrawScreen() {
  const navigate = useNavigate()
  const me = useMe()
  const isGuest = me?.userType === 'guest'

  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const leaving = useAction(withdraw)

  const errorText =
    leaving.error?.code === ERROR.INVALID_CREDENTIALS
      ? '비밀번호가 올바르지 않습니다'
      : leaving.errorText

  const onWithdraw = async () => {
    try {
      await leaving.run({ password })
    } catch {
      return
    }
    /* 세션은 withdraw() 안에서 이미 지웠다. 처음 화면으로 되돌린다. */
    navigate('/', { replace: true })
  }

  return (
    <SubPage
      title="회원 탈퇴"
      footer={
        <>
          {leaving.error && (
            <p className="acct__hint" role="alert">
              {errorText}
            </p>
          )}
          {isGuest ? (
            <Button onClick={() => navigate(-1)}>돌아가기</Button>
          ) : !confirmed ? (
            <Button onClick={() => setConfirmed(true)}>그래도 탈퇴할게요</Button>
          ) : (
            <Button disabled={!password || leaving.pending} onClick={onWithdraw}>
              {leaving.pending ? '처리하는 중…' : '탈퇴하기'}
            </Button>
          )}
        </>
      }
    >
      <p className="acct__warn">
        탈퇴하면 계정이 사라지고 <strong>되돌릴 수 없습니다.</strong>
      </p>
      <p className="acct__note">
        계정 정보는 삭제됩니다. 같은 이메일로 다시 가입하실 수 있어요.
      </p>

      {isGuest && (
        <p className="acct__note">게스트로 쓰고 계셔서 탈퇴할 계정이 없어요.</p>
      )}

      {/* 확인을 한 번 받은 뒤에야 비밀번호를 묻는다. 실수로 지워지면 안 되는 자리다. */}
      {!isGuest && confirmed && (
        <>
          <label className="acct__label acct__label--gap" htmlFor="withdraw-pw">
            비밀번호 확인
          </label>
          <input
            id="withdraw-pw"
            type="password"
            className="screen__line-input"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </>
      )}
    </SubPage>
  )
}
