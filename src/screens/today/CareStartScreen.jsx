import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Character from '../../components/ui/Character'
import { completeToday, getToday, startTimer } from '../../api/today'
import { useApi, useAction } from '../../api/useApi'
import { TODAY_ACTION } from '../options'
import './CareStartScreen.css'

/**
 * 케어 시작 — 타이머 (NOW-TODAY-003 시작 · 004 완료 · 005 진행).
 *
 * 시안이 아직 없어서 기존 색·간격 토큰만으로 짰다.
 *
 * 지켜야 하는 것 두 가지가 있다.
 *   1. 시간을 하드코딩하지 않는다. durationSec은 서버가 매번 다르게 내려준다(4차 확정).
 *   2. 만료 전에도 「했어요」를 누를 수 있다. TIMER_NOT_FINISHED로 막지 않는다(4차 확정).
 *
 * 화면을 계속 보게 만들지 않는 것이 이 화면의 목적이라 숫자 하나만 크게 두고 비워 놓았다.
 */
const mmss = (sec) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function CareStartScreen() {
  const navigate = useNavigate()

  /* 오늘의 행동을 서버에서 받는다(NOW-TODAY-001).
     실패하면 목으로 계속 그린다 — 타이머 화면이 비면 데모가 끊긴다. */
  const today = useApi(getToday)
  const starting = useAction(startTimer)
  const finishing = useAction(completeToday)

  const action = today.data ?? TODAY_ACTION
  const [timerId, setTimerId] = useState(null)

  // 서버가 준 durationSec에서 시작한다. 기본값을 두지 않는다.
  const [left, setLeft] = useState(action.durationSec)
  const [running, setRunning] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!running) return
    timer.current = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          clearInterval(timer.current)
          return 0
        }
        return v - 1
      })
    }, 1000)
    return () => clearInterval(timer.current)
  }, [running])

  /* 시작 전에는 서버가 준 시간을 그대로 보여준다. 응답이 늦게 와도 목 시간이 남지 않는다.
     시작한 뒤에는 카운트다운 값을 쓴다. */
  const shown = running ? left : action.durationSec
  const done = running && left === 0
  const progress = running ? 1 - left / action.durationSec : 0

  /** 타이머 시작 (NOW-TODAY-003). durationSec·endsAt은 서버가 정한다. */
  const onStart = async () => {
    try {
      const t = await starting.run(action.actionId)
      setTimerId(t.timerId)
      setLeft(t.durationSec)
    } catch {
      /* TIMER_ALREADY_RUNNING 등으로 막히면 시작하지 않는다.
         서버가 거절했는데 화면만 흘러가면 완료가 안 붙는다. */
      return
    }
    setRunning(true)
  }

  /** 완료 처리 (NOW-TODAY-004). 타이머 없이 완료하면 timerId는 null이다. */
  const onDone = async () => {
    try {
      await finishing.run({ actionId: action.actionId, timerId })
    } catch {
      return
    }
    navigate('/records')
  }

  return (
    <div className="carestart">
      <button
        type="button"
        className="carestart__back"
        onClick={() => navigate(-1)}
        aria-label="뒤로"
      >
        ←
      </button>

      <div className="carestart__body">
        <p className="carestart__category">{action.categoryName}</p>
        <h1 className="carestart__title">{action.title}</h1>

        <div className="carestart__dial" role="timer" aria-live="off">
          {/* 링에는 마스크가 걸려 있어 안에 글자를 넣으면 같이 지워진다.
              그래서 링은 테두리만 그리고 숫자는 형제로 겹쳐 올린다. */}
          <div
            className="carestart__ring"
            style={{ '--progress': progress }}
            aria-hidden
          />
          <span className="carestart__time">{mmss(shown)}</span>
          <span className="carestart__unit">{done ? '다 됐어요' : '남았어요'}</span>
        </div>

        {!running && (
          <div className="carestart__snail">
            <Character variant="leaf" />
          </div>
        )}

        {(starting.error || finishing.error) && (
          <p className="carestart__error" role="alert">
            {starting.errorText || finishing.errorText}
          </p>
        )}

        <p className="carestart__guide">
          {running
            ? '화면은 그만 보셔도 돼요.\n끝나면 알려드릴게요.'
            : '준비되면 시작을 눌러주세요.\n다 하기 전에 끝내도 괜찮아요.'}
        </p>
      </div>

      <div className="carestart__actions">
        {running ? (
          /* 만료 전에도 완료를 허용한다 — 실제로 끝낸 사람이 기다릴 이유가 없다 */
          <Button disabled={finishing.pending} onClick={onDone}>
            {finishing.pending ? '기록하는 중…' : '했어요'}
          </Button>
        ) : (
          <Button disabled={starting.pending} onClick={onStart}>
            {starting.pending ? '시작하는 중…' : '시작하기'}
          </Button>
        )}

        <button
          type="button"
          className="carestart__cancel"
          onClick={() => navigate('/home')}
        >
          {running ? '그만두기' : '오늘은 쉬어갈게요'}
        </button>
      </div>
    </div>
  )
}
