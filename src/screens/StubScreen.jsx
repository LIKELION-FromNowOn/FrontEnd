import { Link, useNavigate } from 'react-router-dom'
import { SCREENS } from './registry'
import './StubScreen.css'

/**
 * 디자인/기능 나오기 전 골격용 공용 화면.
 * 헤더(제목 + 뒤로가기) + 플레이스홀더 + 관련 화면 이동 버튼만 제공.
 * 실제 화면이 완성되면 registry의 element를 교체하면서 하나씩 대체.
 */
export default function StubScreen({ meta, showBack = false }) {
  const navigate = useNavigate()
  const linked = (meta.links || [])
    .map((p) => SCREENS.find((s) => s.path === p))
    .filter(Boolean)

  return (
    <div className="stub">
      <header className="stub__top">
        {showBack && (
          <button className="stub__back" onClick={() => navigate(-1)} aria-label="뒤로">
            ‹
          </button>
        )}
        <h1 className="stub__title">{meta.title}</h1>
        <span className="stub__badge">{meta.kind === 'optional' ? '선택' : '필수'}</span>
      </header>

      <div className="stub__placeholder">
        <p className="stub__hint">화면 골격 (디자인 시안 반영 전)</p>
        <code className="stub__path">{meta.path}</code>
      </div>

      {linked.length > 0 && (
        <nav className="stub__links">
          <p className="stub__links-label">이동</p>
          {linked.map((s) => (
            <Link key={s.path} to={s.path} className="stub__link">
              {s.title} <span aria-hidden>›</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
