import './FirstStepCard.css'

/**
 * 첫 발자국 카드. 온보딩(인트로)·홈·리스트에서 같은 컴포넌트를 재사용한다.
 *
 *   card    : options.js의 카드 데이터
 *   compact : 리스트용 축약 (본문 줄 수 제한)
 *   onMore  : '자세히보기' 클릭
 */
export default function FirstStepCard({ card, compact = false, onMore, children }) {
  return (
    <article className={`fscard${compact ? ' fscard--compact' : ''}`}>
      {onMore && (
        <button type="button" className="fscard__more" onClick={onMore}>
          자세히보기 ›
        </button>
      )}

      <h3 className="fscard__quote">“{card.quote}”</h3>
      {card.who && <p className="fscard__who">{card.who}</p>}

      <hr className="fscard__rule" />

      <p className="fscard__body">{card.body}</p>

      <div className="fscard__point">
        <p className="fscard__point-title">이 행동의 포인트</p>
        <p className="fscard__point-text">{card.point}</p>
      </div>

      {children}
    </article>
  )
}
