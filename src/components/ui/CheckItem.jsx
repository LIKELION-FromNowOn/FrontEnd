import './CheckItem.css'

/**
 * 체크박스 항목. C01(관리 항목 선택)의 2열 그리드에서 사용.
 */
export default function CheckItem({ label, checked = false, onChange }) {
  return (
    <label className="check">
      <input
        type="checkbox"
        className="check__input"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="check__box" aria-hidden />
      <span className="check__label">{label}</span>
    </label>
  )
}
