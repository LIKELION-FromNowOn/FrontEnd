import { useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import Character from '../../components/ui/Character'
import { CHARACTER_TRAITS } from '../options'
import './CharacterIntroScreen.css'

/**
 * F_CharacterIntro — 달팽이 캐릭터 소개.
 *
 * 화면 전체가 모카색이고 흰 패널이 없어서 HeroPanel을 쓰지 않는다.
 * 말풍선 6개는 크기·위치가 제각각이라 CSS에서 시안 좌표(402px 기준 %)로 하나씩 잡는다.
 */
export default function CharacterIntroScreen() {
  const navigate = useNavigate()

  return (
    <div className="charintro">
      <AppHeader nickname="예니" onBrand />

      <button
        type="button"
        className="charintro__back"
        onClick={() => navigate(-1)}
        aria-label="뒤로"
      >
        ←
      </button>

      <h1 className="charintro__title">
        서두르지 않고, 나만의 속도로
        <br />
        작은 한 걸음을 이어가는 달팽이
      </h1>

      <div className="charintro__stage">
        {/* 말풍선 — 위치는 CSS에서 --{key} 클래스로 잡는다 */}
        {CHARACTER_TRAITS.map((t) => (
          <div key={t.key} className={`charintro__bubble charintro__bubble--${t.key}`}>
            <span className="charintro__bubble-label">{t.label}</span>
            {t.desc && <span className="charintro__bubble-desc">{t.desc}</span>}
          </div>
        ))}

        {/* 잎 장식 */}
        <div className="charintro__leaf charintro__leaf--1">
          <Character variant="leafGreen" />
        </div>
        <div className="charintro__leaf charintro__leaf--2">
          <Character variant="leafGreen" />
        </div>
        <div className="charintro__leaf charintro__leaf--3">
          <Character variant="leafPale" />
        </div>
        <div className="charintro__leaf charintro__leaf--4">
          <Character variant="leafGreen" />
        </div>
      </div>

      {/* 잎 위 달팽이 — 화면 왼쪽 아래 */}
      <div className="charintro__snail">
        <Character variant="leaf" alt="달팽이 캐릭터" />
      </div>
    </div>
  )
}
