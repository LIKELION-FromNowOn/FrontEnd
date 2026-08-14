import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import Button from '../../components/ui/Button'
import Chip from '../../components/ui/Chip'
import { SKIN_FEELINGS, DID_OPTIONS } from '../options'
import './ReduceRecordScreen.css'

const MAX = 120

/** 덜어내기 기록 — 피부 느낌 + 실행 정도 + 한 줄 기록 */
export default function ReduceRecordScreen() {
  const navigate = useNavigate()
  const [feeling, setFeeling] = useState(null)
  const [did, setDid] = useState(null)
  const [note, setNote] = useState('')

  return (
    <div className="rrec">
      <AppHeader nickname="예니" />

      <div className="rrec__body">
        <div className="rrec__head">
          <button
            type="button"
            className="rrec__back"
            onClick={() => navigate(-1)}
            aria-label="뒤로"
          >
            ←
          </button>
          <h1 className="rrec__title">덜어내기 기록</h1>
        </div>

        <p className="rrec__lead">
          오늘 피부는 어땠나요?
          <br />
          기록이 다음 추천을 더 정확하게 도와줘요
        </p>

        <h2 className="rrec__section">덜어내기 컨디션</h2>

        <p className="rrec__label">피부 느낌은 어떤가요?</p>
        <div className="rrec__feelings">
          {SKIN_FEELINGS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`rrec__feeling${feeling === f.key ? ' is-selected' : ''}`}
              onClick={() => setFeeling(f.key)}
              aria-pressed={feeling === f.key}
            >
              <span className="rrec__emoji" aria-hidden>
                {f.emoji}
              </span>
              <span className="rrec__feeling-label">{f.label}</span>
            </button>
          ))}
        </div>

        <p className="rrec__label">오늘 실제로 어떻게 했나요?</p>
        <div className="chip-group rrec__dids">
          {DID_OPTIONS.map((d) => (
            <Chip key={d} selected={did === d} onClick={() => setDid(d)}>
              {d}
            </Chip>
          ))}
        </div>

        <h2 className="rrec__section">오늘 한 줄 기록</h2>
        <div className="rrec__note">
          <textarea
            className="rrec__textarea"
            placeholder="오늘 느낀 점을 자유롭게 적어보세요"
            maxLength={MAX}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <span className="rrec__count">
            {note.length}/{MAX}
          </span>
        </div>

        <div className="rrec__cta">
          <Button onClick={() => navigate('/home')}>기록 저장하기</Button>
        </div>
      </div>
    </div>
  )
}
