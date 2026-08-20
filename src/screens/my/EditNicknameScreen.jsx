import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import Character from '../../components/ui/Character'
import Button from '../../components/ui/Button'
import { updateProfile } from '../../api/auth'
import { forgetMe, useMe } from '../../api/useMe'
import { useAction } from '../../api/useApi'
import { ERROR } from '../../api/errors'
import './EditNicknameScreen.css'

/** 서버 제약(AuthService.validNickname)은 20자다. 시안 카운터가 10자라 좁은 쪽을 쓴다. */
const MAX = 10

/**
 * 닉네임 수정 — 캐릭터 말풍선 + 밑줄 입력 (NOW-MY-001 · PATCH /me).
 *
 * ⚠️ **게스트는 못 바꾼다** — 서버가 403 GUEST_FORBIDDEN 을 준다.
 *    그때는 막아 놓고 「회원가입하고 바꾸기」로 가입 흐름에 태운다.
 *    눌러도 아무 일이 없으면 고장 난 것으로 보인다.
 *
 * ⚠️ 저장한 뒤 forgetMe() 를 반드시 부른다. 상단바(AppHeader)가 GET /me 를 한 번만
 *    받아 두고 나눠 쓰기 때문에, 안 부르면 화면 곳곳에 옛 이름이 그대로 남는다.
 */
export default function EditNicknameScreen() {
  const navigate = useNavigate()
  const me = useMe()
  const save = useAction(updateProfile)

  /* 지금 쓰는 이름을 미리 채워 둔다. 게스트는 서버가 null 을 주므로 빈 칸으로 시작한다.
     ⚠️ 이름을 상태에 복사해 두고 useEffect 로 맞추면, 서버 응답이 늦게 올 때
        사용자가 이미 고치고 있던 글자를 덮어쓴다. 손대기 전에는 서버 값을 그대로 쓰고,
        한 글자라도 치면 그때부터 친 값을 쓴다. */
  const [typed, setTyped] = useState(null)
  const name = typed ?? me?.name ?? ''

  const isGuest = me?.userType === 'guest'

  const onSave = async () => {
    try {
      await save.run({ nickname: name.trim() })
    } catch {
      // 사유는 버튼 위에 뜬다. 입력은 그대로 두어 고쳐서 다시 누를 수 있게 한다.
      return
    }
    forgetMe()
    navigate(-1)
  }

  /** 게스트가 받는 403 은 「오류」가 아니라 「가입하면 된다」는 안내다. */
  const errorText =
    save.error?.code === ERROR.GUEST_FORBIDDEN
      ? '회원가입을 하면 닉네임을 바꿀 수 있어요'
      : save.errorText

  return (
    <SubPage
      footer={
        <>
          {save.error && (
            <p className="nick__hint" role="alert">
              {errorText}
            </p>
          )}
          {isGuest ? (
            <Button onClick={() => navigate('/auth/email')}>회원가입하고 바꾸기</Button>
          ) : (
            <Button disabled={!name.trim() || save.pending} onClick={onSave}>
              {save.pending ? '저장하는 중…' : '저장하기'}
            </Button>
          )}
        </>
      }
    >
      <div className="nick__talk">
        <Character variant="face" width={92} />
        <p className="nick__bubble">
          {isGuest ? '가입하면 이름을 정할 수 있어요!' : '닉네임을 설정해주세요!'}
        </p>
      </div>

      <div className="nick__field">
        <input
          className="nick__input"
          placeholder={isGuest ? '가입 후에 쓸 수 있어요' : '닉네임을 입력해주세요'}
          maxLength={MAX}
          value={name}
          onChange={(e) => setTyped(e.target.value)}
          disabled={isGuest}
        />
        <span className="nick__count">
          {name.length}/{MAX}
        </span>
      </div>
    </SubPage>
  )
}
