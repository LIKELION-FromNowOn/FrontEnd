import { useState } from 'react'
import SubPage from '../../components/SubPage'
import Button from '../../components/ui/Button'
import { ComingSoonBanner } from '../../components/ComingSoon'
import { useComingSoon } from '../../components/useComingSoon'
import './ContactScreen.css'

/**
 * I05_Contact — 문의하기.
 *
 * ⚠️ **이번 범위 밖이다.** 문의를 받는 API 도, 첨부파일을 올릴 곳도 없다(명세 36건에 없음).
 *    적은 내용이 아무 데도 안 가므로 **보내기 전에** 그렇다고 알려야 한다 —
 *    다 적고 눌렀을 때 알게 되면 쓴 사람만 손해다. 그래서 배너를 맨 위에 둔다.
 */
export default function ContactScreen() {
  const [text, setText] = useState('')
  const [comingSoon, notify] = useComingSoon()

  return (
    <SubPage
      title="문의하기"
      lead="궁금한 점이나 불편한 점이 있다면 편하게 남겨주세요"
      footer={
        <Button disabled={!text.trim()} onClick={() => notify('문의 보내기')}>
          문의 보내기
        </Button>
      }
    >
      <ComingSoonBanner>
        문의 접수는 다음 단계에서 준비 중이에요. 지금은 전송되지 않습니다
      </ComingSoonBanner>

      <textarea
        className="contact__textarea"
        placeholder="문의하실 내용을 자세히 입력해주세요."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        type="button"
        className="contact__attach"
        onClick={() => notify('첨부파일')}
      >
        <span className="contact__attach-label">
          <span aria-hidden>🔗</span> 첨부파일 (선택)
        </span>
        <span className="contact__attach-plus" aria-hidden>
          ＋
        </span>
      </button>

      {comingSoon}
    </SubPage>
  )
}
