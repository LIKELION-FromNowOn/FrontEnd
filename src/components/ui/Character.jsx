import './Character.css'

/**
 * 캐릭터 이미지.
 *
 *   face        얼굴만 — 헤더 아바타, 말풍선 옆
 *   fullCircle  크림 원 배경 + 전신 — 로그인, 마이 프로필 (시안에 원이 있는 자리)
 *   fullPlain   배경 없는 전신 — 모카 히어로처럼 색 배경 위에 얹는 자리
 *   leaf        나뭇잎 위 달팽이 — 이어가는 첫 발자국 카드, 캐릭터 소개
 *   leafGreen   잎 하나 (진한 초록) — 캐릭터 소개 배경 장식
 *   leafPale    잎 하나 (연한 초록) — 캐릭터 소개 배경 장식
 *
 * 파일은 public/character/ 에 있습니다. 그림이 바뀌면 같은 이름으로 덮어쓰면
 * 코드 수정 없이 반영됩니다.
 */
const SRC = {
  face: '/character/face.png',
  fullCircle: '/character/full-circle.png',
  fullPlain: '/character/full-plain.png',
  leaf: '/character/leaf.png',
  leafGreen: '/character/leaf-green.png',
  leafPale: '/character/leaf-pale.png',
}

export default function Character({ variant = 'face', size, width, height, alt = '' }) {
  return (
    <img
      className="character"
      src={SRC[variant]}
      width={width ?? size}
      height={height ?? size}
      alt={alt}
      /* 장식용이면 alt를 비우고 스크린리더에서 숨긴다 */
      aria-hidden={alt === '' ? true : undefined}
    />
  )
}
