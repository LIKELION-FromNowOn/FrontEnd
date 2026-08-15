import './Character.css'

/**
 * 캐릭터 이미지.
 *
 *   face        얼굴만 — 헤더 아바타, 말풍선 옆
 *   fullCircle  크림 원 배경 + 전신 — 로그인, 마이 프로필
 *   leaf        나뭇잎 위 달팽이
 *
 * 파일은 public/character/ 에 있습니다. 그림이 바뀌면 같은 이름으로 덮어쓰면
 * 코드 수정 없이 반영됩니다.
 */
const SRC = {
  face: '/character/face.png',
  fullCircle: '/character/full-circle.png',
  leaf: '/character/leaf.png',
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
