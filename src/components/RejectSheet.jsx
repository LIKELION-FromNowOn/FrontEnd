import { useState } from 'react'
import Button from './ui/Button'
import { REJECT_REASONS } from '../screens/options'
import './RejectSheet.css'

/**
 * 오늘은 쉬어갈게요 — 거절 사유 고르기 (NOW-TODAY-005 · POST /today/reject).
 *
 * 「다른 행동 요청」(NOW-TODAY-002)과 다른 점은 이유가 남는다는 것뿐이다.
 * 실패로 저장하지 않는다 — 하지 못한 것은 기록하지 않는 것이 이 서비스의 전제라
 * 화면 문구에도 「괜찮다」는 말을 먼저 둔다.
 *
 * 서버는 reason 을 반드시 받는다(time·fit·none). 그래서 「말하지 않고 쉬어갈게요」도
 * null 이 아니라 `none` 을 보낸다 — null 로 보내면 400 이다.
 */
export default function RejectSheet({ onClose, onSubmit, pending, errorText }) {
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

        {errorText && (
          <p className="rsheet__error" role="alert">
            {errorText}
          </p>
        )}

        <Button disabled={!picked || pending} onClick={() => onSubmit?.(picked)}>
          {pending ? '보내는 중…' : '보내기'}
        </Button>

        {/* 이유를 말하지 않을 자유도 남긴다 — 값은 'none' 으로 보낸다 */}
        <button
          type="button"
          className="rsheet__skip"
          disabled={pending}
          onClick={() => onSubmit?.('none')}
        >
          말하지 않고 쉬어갈게요
        </button>
      </div>
    </div>
  )
}
