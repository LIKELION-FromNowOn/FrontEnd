import './Toggle.css'

/** 알림 설정 등에서 쓰는 on/off 스위치 */
export default function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        className="toggle__input"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-label={label}
      />
      <span className="toggle__track" aria-hidden>
        <span className="toggle__knob" />
      </span>
    </label>
  )
}
