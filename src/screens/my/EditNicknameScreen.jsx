import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import Character from '../../components/ui/Character'
import Button from '../../components/ui/Button'
import './EditNicknameScreen.css'

const MAX = 10

/** 닉네임 수정 — 캐릭터 말풍선 + 밑줄 입력 */
export default function EditNicknameScreen() {
  const navigate = useNavigate()
  const [name, setName] = useState('')

  return (
    <SubPage
      footer={
        <Button disabled={!name.trim()} onClick={() => navigate(-1)}>
          저장하기
        </Button>
      }
    >
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
    </SubPage>
  )
}
