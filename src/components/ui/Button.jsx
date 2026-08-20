import './Button.css'

/**
 * 공용 버튼. 피그마의 알약형(pill) CTA 형태.
 *
 *   variant : 'primary' | 'secondary' | 'outline'
 *   full    : 가로 꽉 채움 (기본 true)
 */
export default function Button({
  children,
  variant = 'primary',
  full = true,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant}${full ? ' btn--full' : ''}`}
      {...rest}
    >
      {children}
    </button>
  )
}
