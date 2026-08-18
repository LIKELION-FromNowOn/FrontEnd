import './FlipCard.css'

/**
 * 마우스를 올리면 뒷면이 보이는 카드. 벗어나면 부드럽게 앞면으로 돌아온다.
 *
 * hover만으로는 터치 기기에서 뒷면을 볼 수 없어 focus에도 같이 반응시킨다.
 * (탭하면 포커스가 들어가 뒤집힌다)
 */
export default function FlipCard({ front, back }) {
  return (
    <div className="flipcard" tabIndex={0}>
      <div className="flipcard__inner">
        <div className="flipcard__face flipcard__face--front">{front}</div>
        <div className="flipcard__face flipcard__face--back">{back}</div>
      </div>
    </div>
  )
}
