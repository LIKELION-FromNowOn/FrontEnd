import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import Button from '../../components/ui/Button'
import { changePassword } from '../../api/auth'
import { useMe } from '../../api/useMe'
import { useAction } from '../../api/useApi'
import { ERROR } from '../../api/errors'
import './AccountScreen.css'

const MIN = 8
const MAX = 64

/**
 * I02-1_My/ChangePassword — 비밀번호 변경 (PATCH /me/password).
 *
 * ⚠️ **지금 비밀번호 칸이 반드시 있어야 한다.** 토큰만으로 바꾸게 하면 토큰이 한 번
 *    새는 순간 계정을 뺏긴다(토큰이 30일짜리다). 서버도 currentPassword 를 요구한다.
 *
 * ⚠️ 성공해도 세션을 건드리지 않는다. 새 토큰이 오지 않고, 바꿨다고 로그아웃시키면
 *    화면이 끊긴다.
 *
 * 게스트는 403 이라 아예 못 들어오게 하고 가입으로 보낸다.
 */
export default function ChangePasswordScreen() {
  const navigate = useNavigate()
  const me = useMe()
  const isGuest = me?.userType === 'guest'

  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const saving = useAction(changePassword)

  const canSubmit = current.length >= MIN && next.length >= MIN && next.length <= MAX

  /* 여기서의 401 은 「지금 비밀번호가 틀렸다」가 확실하다 — 본인이 자기 것을 친 자리다. */
  const errorText =
    saving.error?.code === ERROR.INVALID_CREDENTIALS
      ? '지금 비밀번호가 올바르지 않습니다'
      : saving.errorText

  const onSave = async () => {
    try {
      await saving.run({ currentPassword: current, newPassword: next })
    } catch {
      return
    }
    navigate(-1)
  }

  return (
    <SubPage
      title="비밀번호 변경"
      lead={isGuest ? '가입하시면 비밀번호를 정할 수 있어요' : undefined}
      footer={
        <>
          {saving.error && (
            <p className="acct__hint" role="alert">
              {errorText}
            </p>
          )}
          {isGuest ? (
            <Button onClick={() => navigate('/auth/email')}>회원가입하고 이용하기</Button>
          ) : (
            <Button disabled={!canSubmit || saving.pending} onClick={onSave}>
              {saving.pending ? '바꾸는 중…' : '비밀번호 바꾸기'}
            </Button>
          )}
        </>
      }
    >
      {!isGuest && (
        <>
          <label className="acct__label" htmlFor="pw-current">
            지금 비밀번호
          </label>
          <input
            id="pw-current"
            type="password"
            className="screen__line-input"
            placeholder="지금 쓰는 비밀번호"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            maxLength={MAX}
          />

          <label className="acct__label acct__label--gap" htmlFor="pw-next">
            새 비밀번호
          </label>
          <input
            id="pw-next"
            type="password"
            className="screen__line-input"
            placeholder={`새 비밀번호 (${MIN}자 이상)`}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            maxLength={MAX}
          />
        </>
      )}
    </SubPage>
  )
}
