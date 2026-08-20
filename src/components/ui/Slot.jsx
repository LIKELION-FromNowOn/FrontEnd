import './Slot.css'

/**
 * 아직 에셋이 없는 자리(캐릭터·로고·일러스트·배경)를 잡아두는 플레이스홀더.
 *
 * 크기와 위치만 확정해 두고, 나중에 에셋을 받으면 이 컴포넌트를 이미지로 교체하거나
 * children으로 이미지를 넘기면 된다. 레이아웃은 그대로 유지된다.
 *
 *   shape : 'rect' | 'circle'
 *   label : 무엇이 들어갈 자리인지 표시 (예: '캐릭터')
 *   sm    : 작은 슬롯 — 라벨 글자를 숨긴다
 */
export default function Slot({
  label,
  shape = 'rect',
  width,
  height,
  sm = false,
  children,
}) {
  return (
    <div
      className={`slot slot--${shape}${sm ? ' slot--sm' : ''}`}
      style={{ width, height }}
      role="img"
      aria-label={`${label} 자리`}
    >
      {children ?? <span className="slot__label">{label}</span>}
    </div>
  )
}
