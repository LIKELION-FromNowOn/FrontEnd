import { useState } from 'react'
import Button from './ui/Button'
import { REJECT_REASONS } from '../screens/options'
import './RejectSheet.css'

/**
 * 오늘은 쉬어갈게요 — 거절 사유 고르기 (NOW-TODAY-008 · POST /today/reject).
 *
 * 「다른 행동 요청」(NOW-TODAY-002)과 다른 점은 이유가 남는다는 것뿐이다.
 * 실패로 저장하지 않는다 — 하지 못한 것은 기록하지 않는 것이 이 서비스의 전제라
 * 화면 문구에도 「괜찮다」는 말을 먼저 둔다.
 */
export default function RejectSheet({ onClose, onSubmit }) {
  const [picked, setPicked] = useState(null)

  return (
    <div className="rsheet" role="dialog" aria-modal="true" aria-label="오늘은 쉬어가기">
      <button type="button" className="rsheet__scrim" onClick={onClose} aria-label="닫기" />

      <div className="rsheet__panel">
        <span className="rsheet__handle" aria-hidden />

        <h2 className="rsheet__title">오늘은 쉬어가도 괜찮아요</h2>
        <p className="rsheet__lead">
          이유를 알려주시면 다음 추천에 반영할게요.
          <br />
          기록에는 남지 않아요.
        </p>

        <ul className="rsheet__list">
          {REJECT_REASONS.map((r) => (
            <li key={r.key}>
              <button
                type="button"
                className={`rsheet__reason${picked === r.key ? ' is-selected' : ''}`}
                aria-pressed={picked === r.key}
                onClick={() => setPicked(r.key)}
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>

        <Button disabled={!picked} onClick={() => onSubmit?.(picked)}>
          보내기
        </Button>

        {/* 이유를 말하지 않을 자유도 남긴다 */}
        <button type="button" className="rsheet__skip" onClick={() => onSubmit?.(null)}>
          말하지 않고 쉬어갈게요
        </button>
      </div>
    </div>
  )
}
