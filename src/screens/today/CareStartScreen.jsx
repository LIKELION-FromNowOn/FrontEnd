import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Character from '../../components/ui/Character'
import { completeToday, getToday, startTimer } from '../../api/today'
import { ERROR } from '../../api/errors'
import { useApi, useAction } from '../../api/useApi'
import './CareStartScreen.css'

/**
 * 케어 시작 — 타이머 (NOW-TODAY-003 시작 · 004 완료 · 005 진행).
 *
 * 시안이 아직 없어서 기존 색·간격 토큰만으로 짰다.
 *
 * 지켜야 하는 것 세 가지가 있다.
 *   1. 시간을 하드코딩하지 않는다. durationSec은 서버가 매번 다르게 내려준다
 *      (헬스장 3600초 · 물 마시기 420초). 목 값으로 대신 그리지도 않는다 —
 *      그러면 4분짜리 화면을 띄워놓고 서버에는 없는 행동을 시작하게 된다.
 *   2. 만료 전에도 「했어요」를 누를 수 있다. TIMER_NOT_FINISHED로 막지 않는다(4차 확정).
 *   3. 행동이 없는 이유를 구분한다.
 *        409 NO_EVALUATION → 덜어내기를 아직 안 했다 → 덜어내기로 보낸다
 *        200 + data: null  → 남은 항목이 없다        → 첫 발자국 카드로 보낸다
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
     여기서는 목으로 대신 그리지 않는다 — 타이머만 도는 화면이 되고
     시작·완료는 서버에 없는 actionId 로 404 가 난다. */
  const today = useApi(getToday)
  const starting = useAction(startTimer)
  const finishing = useAction(completeToday)

  const action = today.data
  const [timerId, setTimerId] = useState(null)

  // 서버가 준 durationSec에서 시작한다. 기본값을 두지 않는다.
  const [left, setLeft] = useState(0)
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
  const duration = action?.durationSec ?? 0
  const shown = running ? left : duration
  const done = running && left === 0
  // duration 이 0 일 때 나누면 NaN 이 style 로 새어 들어간다
  const progress = running && duration > 0 ? 1 - left / duration : 0

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

  /**
   * 이미 완료한 행동이면 타이머를 다시 띄우지 않는다.
   *
   * ⚠️ 서버는 같은 행동을 두 번 완료해도 막지 않는다 — 200 에 **새 logId** 를 준다
   *    (2026-08-20 실측). 기록이 두 줄 남는다는 뜻이라 화면에서 막아야 한다.
   *    reroll 쪽만 409 ALREADY_COMPLETED 로 걸린다.
   */
  const alreadyDone = action?.status === 'done' && !running

  /* 여기서부터는 훅을 다 부른 뒤라 이르게 끝내도 된다. */
  if (alreadyDone) {
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

        <div className="carestart__body carestart__body--empty">
          <p className="carestart__category">{action.categoryName}</p>
          <h1 className="carestart__title">{action.title}</h1>
          <p className="carestart__guide">
            오늘은 이미 하셨어요.{'\n'}여기까지로 충분해요.
          </p>
          <div className="carestart__snail">
            <Character variant="leaf" />
          </div>
        </div>

        <div className="carestart__actions">
          <Button onClick={() => navigate('/records')}>기록 보러 가기</Button>
          <button
            type="button"
            className="carestart__cancel"
            onClick={() => navigate('/home')}
          >
            홈으로
          </button>
        </div>
      </div>
    )
  }

  if (!action) {
    const needsSubtract = today.error?.code === ERROR.NO_EVALUATION

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

        <div className="carestart__body carestart__body--empty">
          {today.loading ? (
            <p className="carestart__guide" role="status">
              오늘의 케어를 고르고 있어요
            </p>
          ) : needsSubtract ? (
            <>
              <h1 className="carestart__title">먼저 덜어내기를 해주세요</h1>
              <p className="carestart__guide">
                오늘 뭘 덜어낼지 정하고 나면{'\n'}케어 하나를 골라드릴게요
              </p>
              <div className="carestart__snail">
                <Character variant="leaf" />
              </div>
            </>
          ) : today.error ? (
            <>
              <h1 className="carestart__title">잠시 후에 다시 시도해 주세요</h1>
              <p className="carestart__guide">{today.errorText}</p>
            </>
          ) : (
            /* 200 인데 data 가 null — 판정은 했는데 남은 항목이 없는 경우 */
            <>
              <h1 className="carestart__title">오늘 드릴 케어가 없어요</h1>
              <p className="carestart__guide">
                대신 첫 발자국 카드를 한번{'\n'}읽어보셔도 좋아요
              </p>
              <div className="carestart__snail">
                <Character variant="leaf" />
              </div>
            </>
          )}
        </div>

        <div className="carestart__actions">
          {needsSubtract ? (
            <Button onClick={() => navigate('/reduce')}>덜어내기 하러 가기</Button>
          ) : today.error ? (
            <Button onClick={today.reload}>다시 시도하기</Button>
          ) : (
            !today.loading && (
              <Button onClick={() => navigate('/first-step')}>첫 발자국 보러 가기</Button>
            )
          )}

          <button
            type="button"
            className="carestart__cancel"
            onClick={() => navigate('/home')}
          >
            홈으로
          </button>
        </div>
      </div>
    )
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
          {/* 링 위에 겹쳐 올리되, 숫자와 문구는 서로 **흐름대로** 쌓는다.
              둘을 각각 %로 앉히면 글자 크기·화면 크기에 따라 겹친다. */}
          <div className="carestart__readout">
            <span className="carestart__time">{mmss(shown)}</span>
            <span className="carestart__unit">{done ? '다 됐어요' : '남았어요'}</span>
          </div>
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
