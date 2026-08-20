import './Illust.css'

/**
 * 화면용 일러스트.
 *
 *   firstStep  메모하는 달팽이 — 첫 발자국 소개
 *   analyzing  껍질에 웅크린 달팽이 — 케어 분석 중
 *
 * 파일은 public/illust/ 에 있다. 그림이 바뀌면 같은 이름으로 덮어쓰면 반영된다.
 * (디자인은 SVG로 오지만 안에 PNG가 들어 있는 형태라, PNG만 꺼내서 쓴다)
 */
const SRC = {
  firstStep: '/illust/first-step.png',
  analyzing: '/illust/analyzing.png',
}

export default function Illust({ name, width, alt = '' }) {
  return (
    <img
      className="illust"
      src={SRC[name]}
      width={width}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
    />
  )
}
