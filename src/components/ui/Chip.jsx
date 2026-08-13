import './Chip.css'

/**
 * 칩 선택 버튼. D01(컨디션·신호), 이후 시간·장소 선택 등에서 반복 사용.
 * 선택 상태는 부모가 관리한다.
 */
export default function Chip({ children, selected = false, ...rest }) {
  return (
    <button
      type="button"
      className={`chip${selected ? ' is-selected' : ''}`}
      aria-pressed={selected}
      {...rest}
    >
      {children}
    </button>
  )
}
