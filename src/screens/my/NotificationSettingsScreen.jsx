import { useState } from 'react'
import SubPage from '../../components/SubPage'
import Button from '../../components/ui/Button'
import Toggle from '../../components/ui/Toggle'
import { ComingSoonBanner } from '../../components/ComingSoon'
import './NotificationSettingsScreen.css'

/**
 * I03_NotificationSettings — 알림 토글 + 방해금지 시간.
 *
 * ⚠️ **이번 범위 밖이다.** 알림 설정을 저장하는 API 를 만들기로 한 적이 없다(명세 36건에 없음).
 *    토글은 화면 안에서만 움직이고 서버에 저장되지 않는다 — 그래서 맨 위에 준비 중임을 적는다.
 *    줄을 지우지 않고 남기는 것은 2026-08-21 결정이다.
 */
const ITEMS = [
  {
    key: 'care',
    title: '오늘 케어 알림',
    desc: '매일 케어할 내용을 알려드려요.',
    on: true,
  },
  {
    key: 'step',
    title: '첫 발자국 리마인드',
    desc: '첫 발자국을 놓치지 않도록 도와드려요.',
    on: true,
  },
  {
    key: 'reduce',
    title: '덜어내기',
    desc: '덜어내기 시간에 맞춰 안내드려요.',
    on: true,
  },
  { key: 'notice', title: '서비스 공지', desc: null, on: false },
]

export default function NotificationSettingsScreen() {
  const [state, setState] = useState(() =>
    Object.fromEntries(ITEMS.map((i) => [i.key, i.on])),
  )

  return (
    <SubPage
      title="알림 설정"
      lead={
        <>
          <ComingSoonBanner>
            지금은 저장되지 않아요. 알림은 다음 단계에서 준비 중이에요
          </ComingSoonBanner>
          부담 없이 이어갈 수 있도록,
          <br />
          필요한 순간에 알려드려요.
        </>
      }
      footer={<Button>저장하기</Button>}
    >
      <div className="subpage__card noti__card">
        {ITEMS.map((item) => (
          <div key={item.key} className="noti__row">
            <div>
              <p className="noti__title">{item.title}</p>
              {item.desc && <p className="noti__desc">{item.desc}</p>}
            </div>
            <Toggle
              label={item.title}
              checked={state[item.key]}
              onChange={(v) => setState((s) => ({ ...s, [item.key]: v }))}
            />
          </div>
        ))}
      </div>

      <button type="button" className="noti__quiet">
        <div>
          <p className="noti__title">방해금지 시간</p>
          <p className="noti__desc">설정한 시간에는 알림이 울리지 않아요.</p>
        </div>
        <span className="noti__quiet-value">
          23:00~7:00{' '}
          <span className="subpage__chevron" aria-hidden>
            ›
          </span>
        </span>
      </button>
    </SubPage>
  )
}
