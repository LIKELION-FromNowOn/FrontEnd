import { useState } from 'react'
import SubPage from '../../components/SubPage'
import Button from '../../components/ui/Button'
import './ContactScreen.css'

/** I05_Contact — 문의하기 */
export default function ContactScreen() {
  const [text, setText] = useState('')

  return (
    <SubPage
      title="문의하기"
      lead="궁금한 점이나 불편한 점이 있다면 편하게 남겨주세요"
      footer={<Button disabled={!text.trim()}>문의 보내기</Button>}
    >
      <textarea
        className="contact__textarea"
        placeholder="문의하실 내용을 자세히 입력해주세요."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="button" className="contact__attach">
        <span className="contact__attach-label">
          <span aria-hidden>🔗</span> 첨부파일 (선택)
        </span>
        <span className="contact__attach-plus" aria-hidden>
          ＋
        </span>
      </button>
    </SubPage>
  )
}
