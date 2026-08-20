import { useState } from 'react'
import SubPage from '../../components/SubPage'
import Character from '../../components/ui/Character'
import { askCoach } from '../../api/care'
import { useAction } from '../../api/useApi'
import { COACH_LEVEL, COACH_SUGGESTIONS } from '../options'
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
  const coach = useAction(askCoach)

  const ask = async (text) => {
    const q = text.trim()
    if (!q || coach.pending) return

    setThread((t) => [...t, { role: 'me', text: q }])
    setQuestion('')

    try {
      /* 판정은 규칙이 하고 AI는 문장만 만든다. 받은 answer·basis·level을 그대로 옮긴다. */
      const answer = await coach.run(q)
      setThread((t) => [...t, { role: 'coach', ...answer }])
    } catch (e) {
      /* 실패도 대화에 남긴다. 질문만 떠 있고 아무 반응이 없으면 멈춘 것처럼 보인다.
         LLM_UNAVAILABLE 이면 서버가 규칙 기반 문구를 같이 준다. */
      setThread((t) => [...t, { role: 'error', text: coach.errorText || e.message }])
    }
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
          ) : m.role === 'error' ? (
            <p key={i} className="coach__bubble coach__bubble--error" role="alert">
              {m.text}
            </p>
          ) : (
            <div key={i} className="coach__answer">
              {/* 안내문에서 못 찾은 답은 level 이 아예 없이 온다. 그때는 배지를 띄우지 않는다 —
                  없는 값을 표에서 찾으면 화면이 죽고, 아무 배지나 붙이면 서버가 안 한 말이 된다. */}
              {COACH_LEVEL[m.level] && (
                <span
                  className={`coach__level coach__level--${COACH_LEVEL[m.level].tone}`}
                >
                  {COACH_LEVEL[m.level].label}
                </span>
              )}

              <p className="coach__bubble coach__bubble--coach">{m.answer}</p>

              {/* 근거 없이는 답을 띄우지 않는다 (NOW-COACH-003).
                  basis.type 이 'none' 이면 label 자체가 안 온다 — 그때는 이 줄을 통째로 뺀다.
                  답변 문장이 이미 「안내문에 없습니다」라고 말하고 있다. */}
              {m.basis?.label && (
                <p className="coach__basis">
                  <span className="coach__basis-tag">{m.basis.label}</span>
                  {m.basis.sent != null && (
                    <span className="coach__basis-sent">
                      원문 {m.basis.sent}번째 문장
                    </span>
                  )}
                </p>
              )}
            </div>
          ),
        )}

        {coach.pending && <p className="coach__typing">확인하고 있어요…</p>}
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
          disabled={!question.trim() || coach.pending}
        >
          묻기
        </button>
      </form>
    </SubPage>
  )
}
