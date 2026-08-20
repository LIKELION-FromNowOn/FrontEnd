import { useState } from 'react'
import SubPage from '../../components/SubPage'
import Character from '../../components/ui/Character'
import Button from '../../components/ui/Button'
import { ComingSoonBanner } from '../../components/ComingSoon'
import { useComingSoon } from '../../components/useComingSoon'
import './EditNicknameScreen.css'

const MAX = 10

/**
 * 닉네임 수정 — 캐릭터 말풍선 + 밑줄 입력.
 *
 * ⚠️ 지금은 준비 중으로 둔다(2026-08-21).
 *    고칠 API 는 있다(PATCH /me). 다만 게스트로는 403 이라 회원으로 들어와야 쓸 수 있고,
 *    저장 뒤 화면 여기저기의 이름을 어떻게 되돌릴지가 아직 안 정해졌다.
 *    붙일 때는 저장 성공 뒤 api/useMe.js 의 forgetMe() 를 불러야 한다 —
 *    안 부르면 상단바에 옛 이름이 그대로 남는다.
 */
export default function EditNicknameScreen() {
  const [name, setName] = useState('')
  const [comingSoon, notify] = useComingSoon()

  return (
    <SubPage
      footer={
        <Button disabled={!name.trim()} onClick={() => notify('닉네임 변경')}>
          저장하기
        </Button>
      }
    >
      <ComingSoonBanner>닉네임 변경은 다음 단계에서 준비 중이에요</ComingSoonBanner>

      <div className="nick__talk">
        <Character variant="face" width={92} />
        <p className="nick__bubble">닉네임을 설정해주세요!</p>
      </div>

      <div className="nick__field">
        <input
          className="nick__input"
          placeholder="닉네임을 입력해주세요"
          maxLength={MAX}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="nick__count">
          {name.length}/{MAX}
        </span>
      </div>

      {comingSoon}
    </SubPage>
  )
}
