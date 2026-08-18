import { useState } from 'react'
import SubPage from '../../components/SubPage'
import Character from '../../components/ui/Character'
import { COACH_LEVEL, COACH_MOCK_ANSWER, COACH_SUGGESTIONS } from '../options'
import './CoachScreen.css'

/**
 * 케어 코치 (NOW-COACH-001 POST /coach/ask).
 * 시안이 아직 없어서 기존 색·간격 토큰만으로 짰다.
 *
 * 화면이 지켜야 하는 경계가 세 가지다.
 *   NOW-COACH-003  답변에는 반드시 근거(basis)를 같이 띄운다
 *   NOW-COACH-002  「오늘 해도 되는지」만 답한다. 성분·브랜드·제품명은 다루지 않는다
 *   NOW-SAFE-001   자유 입력이라 서버가 위기 신호를 먼저 검사한다
 *
 * 판정은 규칙 엔진이 하고 AI는 문장만 만든다. 그래서 프론트는 받은 문장과 근거를
 * 그대로 옮기기만 하고, 수위(level)를 임의로 바꾸거나 문장을 다듬지 않는다.
 */
export default function CoachScreen() {
  const [question, setQuestion] = useState('')
  const [thread, setThread] = useState([])
  const [asking, setAsking] = useState(false)

  const ask = (text) => {
    const q = text.trim()
    if (!q || asking) return

    setThread((t) => [...t, { role: 'me', text: q }])
    setQuestion('')
    setAsking(true)

    // 서버가 붙기 전까지의 임시 응답. 연동 시 POST /coach/ask 결과로 갈아끼운다.
    setTimeout(() => {
      setThread((t) => [...t, { role: 'coach', ...COACH_MOCK_ANSWER }])
      setAsking(false)
    }, 600)
  }

  return (
    <SubPage title="케어 코치">
      <p className="coach__lead">
        오늘 이걸 해도 되는지 물어보세요.
        <br />
        오늘 컨디션과 클리닉 안내를 기준으로 답해드려요.
      </p>

      <div className="coach__thread">
        {thread.length === 0 && (
          <div className="coach__intro">
            <div className="coach__intro-char">
              <Character variant="leaf" />
            </div>
            <p className="coach__intro-text">
              성분이나 제품을 설명하지는 않아요.
              <br />
              「오늘 해도 되는지」만 답해드려요.
            </p>
          </div>
        )}

        {thread.map((m, i) =>
          m.role === 'me' ? (
            <p key={i} className="coach__bubble coach__bubble--me">
              {m.text}
            </p>
          ) : (
            <div key={i} className="coach__answer">
              <span className={`coach__level coach__level--${COACH_LEVEL[m.level].tone}`}>
                {COACH_LEVEL[m.level].label}
              </span>

              <p className="coach__bubble coach__bubble--coach">{m.answer}</p>

              {/* 근거 없이는 답을 띄우지 않는다 (NOW-COACH-003) */}
              <p className="coach__basis">
                <span className="coach__basis-tag">{m.basis.label}</span>
                {m.basis.sent != null && (
                  <span className="coach__basis-sent">원문 {m.basis.sent}번째 문장</span>
                )}
              </p>
            </div>
          ),
        )}

        {asking && <p className="coach__typing">확인하고 있어요…</p>}
      </div>

      {thread.length === 0 && (
        <ul className="coach__suggests">
          {COACH_SUGGESTIONS.map((s) => (
            <li key={s}>
              <button type="button" className="coach__suggest" onClick={() => ask(s)}>
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        className="coach__form"
        onSubmit={(e) => {
          e.preventDefault()
          ask(question)
        }}
      >
        <input
          className="coach__input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="오늘 각질 관리 해도 되나요"
          aria-label="질문"
        />
        <button
          type="submit"
          className="coach__send"
          disabled={!question.trim() || asking}
        >
          묻기
        </button>
      </form>
    </SubPage>
  )
}
