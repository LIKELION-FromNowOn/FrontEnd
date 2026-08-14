import AppHeader from './AppHeader'
import './HeroPanel.css'

/**
 * 메인 화면 상단 구조 — 모카색 히어로 + 그 아래 둥근 흰 패널.
 * 홈·덜어내기·첫 발자국 목록이 같은 구조를 쓴다.
 *
 *   hero     : 히어로 영역 내용 (제목·캐릭터·카드 등)
 *   children : 흰 패널 안 내용
 *   flat     : 히어로 없이 헤더만 (흰 배경 화면)
 */
export default function HeroPanel({ hero, children, nickname }) {
  return (
    <div className="hero">
      <div className="hero__top">
        <AppHeader nickname={nickname} onBrand />
        {hero && <div className="hero__content">{hero}</div>}
      </div>

      <div className="hero__panel">{children}</div>
    </div>
  )
}
