import { useEffect, useRef, useState } from 'react'
import './ContactModal.css'

/** 문의하기 모달 (ContactModal 시안) */
export default function ContactModal({ onClose }) {
  const [text, setText] = useState('')
  const boxRef = useRef(null)

  // Esc로 닫기 + 열렸을 때 배경 스크롤 잠금
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      className="cmodal"
      role="dialog"
      aria-modal="true"
      aria-label="문의하기"
      onMouseDown={(e) => {
        // 바깥을 눌렀을 때만 닫는다 (안에서 드래그하다 놓은 경우 제외)
        if (!boxRef.current?.contains(e.target)) onClose()
      }}
    >
      <div className="cmodal__box" ref={boxRef}>
        <header className="cmodal__top">
          <button type="button" className="cmodal__cancel" onClick={onClose}>
            취소
          </button>
          <h2 className="cmodal__title">문의하기</h2>
          <button type="button" className="cmodal__send" disabled={!text.trim()}>
            보내기
          </button>
        </header>

        <textarea
          className="cmodal__textarea"
          placeholder="어떤 도움이 필요하신가요?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />

        <div className="cmodal__chips">
          <span className="cmodal__chip">이름</span>
          <span className="cmodal__chip">이메일</span>
          <button type="button" className="cmodal__chip cmodal__chip--add">
            + 연락처
          </button>
          <button type="button" className="cmodal__chip cmodal__chip--add">
            + 첨부파일
          </button>
        </div>

        <p className="cmodal__note">
          개인정보는 안전하게 보호되며, 문의 답변 용도로만 사용됩니다.
        </p>
      </div>
    </div>
  )
}
