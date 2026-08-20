import { useEffect, useRef } from 'react'
import './DecorLines.css'

/**
 * 좌우 가로 라인 장식 (IntroDecor_Left/Right.svg).
 *
 * SVG를 그대로 넣지 않고 막대 하나하나를 div로 만든다.
 * 커서에 반응해 개별 막대를 밀어야 하는데, SVG 파일이면 내부 rect에 손댈 수 없기 때문.
 *
 * 인터랙션 — 커서가 가까운 막대일수록 바깥으로 더 밀리고 살짝 길어진다.
 * 리렌더 대신 ref로 transform만 직접 쓰고, rAF로 묶어 프레임당 한 번만 반영한다.
 */

// 시안 SVG의 막대 좌표. 위에서부터 53px 간격, 각 막대의 안쪽 끝 위치(px).
const INSET = [
  534, 475, 418, 377, 309, 272, 210, 149, 62, 23, 0, 0, 0, 23, 62, 149, 210, 272, 309,
  377, 418, 475, 534,
]

// 위 → 아래 색 순서 (오른쪽 장식 기준). 왼쪽 장식은 뒤집어 쓴다.
const COLORS = [
  '#764413',
  '#764413',
  '#764413',
  '#764413',
  '#764413',
  '#764413',
  '#764413',
  '#764413',
  'rgba(118,68,19,.9)',
  'rgba(118,68,19,.9)',
  'rgba(118,68,19,.8)',
  '#916942',
  'linear-gradient(#CAA491,#764413)',
  '#CAA491',
  '#CAA491',
  '#D6BAA2',
  '#D6BAA2',
  '#E7D7BE',
  '#E7D7BE',
  '#E7D7BE',
  '#F3E7D7',
  '#F3E7D7',
  '#F3E7D7',
]

const GAP = 53
const BAR_H = 36
const BAR_W = 885
const REACH = 220 // 이 거리 안에 있는 막대만 반응한다
const PUSH = 34 // 최대로 밀리는 거리

export default function DecorLines({ side = 'right' }) {
  const wrapRef = useRef(null)
  const barsRef = useRef([])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let frame = 0
    let pointer = null

    const apply = () => {
      frame = 0
      barsRef.current.forEach((bar, i) => {
        if (!bar) return
        let shift = 0
        if (pointer) {
          // 막대 중심과 커서의 세로 거리로 반응 세기를 정한다
          const barY = i * GAP + BAR_H / 2
          const dist = Math.abs(pointer.y - barY)
          if (dist < REACH) {
            const strength = 1 - dist / REACH
            // 커서가 안쪽으로 들어올수록 막대가 바깥으로 밀린다
            const dir = side === 'right' ? 1 : -1
            shift = dir * PUSH * strength * (pointer.x / wrap.offsetWidth)
          }
        }
        bar.style.transform = `translateX(${shift.toFixed(1)}px)`
      })
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect()
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top }
      schedule()
    }
    const onLeave = () => {
      pointer = null
      schedule()
    }

    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerleave', onLeave)
    return () => {
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [side])

  const colors = side === 'right' ? COLORS : [...COLORS].reverse()
  const insets = side === 'right' ? INSET : [...INSET].reverse()

  return (
    <div
      ref={wrapRef}
      className={`decor decor--${side}`}
      style={{ height: INSET.length * GAP }}
      aria-hidden
    >
      {insets.map((inset, i) => {
        const color = colors[i]
        const isGradient = color.startsWith('linear-gradient')
        return (
          <span
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            className="decor__bar"
            style={{
              top: i * GAP,
              width: BAR_W,
              height: BAR_H,
              [side === 'right' ? 'left' : 'right']: inset,
              background: isGradient ? color : undefined,
              backgroundColor: isGradient ? undefined : color,
            }}
          />
        )
      })}
    </div>
  )
}
