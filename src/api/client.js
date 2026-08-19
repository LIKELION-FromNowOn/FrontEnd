import { API_BASE, assertConfigured } from './config'
import { ENDPOINTS, isLive } from './live'
import { getToken } from './session'

/**
 * 서버 응답이 실패했을 때 던지는 오류.
 * 명세서의 실패 코드(UNAUTHORIZED · NO_EVALUATION · TIMER_ALREADY_RUNNING …)를
 * code 로 담아 화면에서 분기할 수 있게 한다.
 */
export class ApiError extends Error {
  constructor(message, { status, code, apiId } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.apiId = apiId
  }
}

/**
 * 실패 응답에서 code·message 를 꺼낸다.
 *
 * ⚠️ 성공 봉투는 { ok: true, data: {...} } 로 명세서 28건에 똑같이 적혀 있는데
 *    **실패 봉투의 모양은 명세서 어디에도 없다.** 표에 HTTP 상태·code·message 만 있다.
 *    그래서 흔한 세 모양을 모두 받아 준다. 백엔드에서 실물 1건을 받으면 하나로 줄일 것.
 */
function readError(data, status) {
  const e = data?.error ?? data ?? {}
  return {
    code: e.code ?? data?.code,
    message: e.message ?? data?.message ?? `요청에 실패했어요 (${status})`,
  }
}

/**
 * 성공 응답에서 알맹이를 꺼낸다.
 *
 * 28건은 { ok: true, data: {...} } 로 감싸 오고,
 * 2026-08-11에 신설된 9건(안내문·예정·케어코치·안전·거절사유)은 명세서에 맨몸 JSON 으로
 * 적혀 있다. 백엔드 common 에 ApiResponse 가 이미 있어서 실제로는 전부 감쌀 가능성이 높지만,
 * 확인 전까지는 양쪽을 다 받아 준다.
 */
const unwrap = (data) =>
  data && typeof data === 'object' && 'ok' in data && 'data' in data ? data.data : data

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * API 한 건을 부른다.
 *
 *   apiId  API 명세서의 API ID. live.js 에서 실연동 여부를 본다.
 *   path   경로 변수({itemId} 등)를 채운 실제 경로. 없으면 live.js 의 path 를 쓴다.
 *   mock   실연동 전에 돌려줄 값. **명세서 응답 예시와 같은 모양으로 둘 것** —
 *          그래야 스위치만 켜도 화면이 안 깨진다.
 *
 * 실연동이 꺼져 있으면 서버를 부르지 않고 mock 을 돌려준다.
 */
export async function call(apiId, { path, query, body, mock, signal } = {}) {
  const ep = ENDPOINTS[apiId]
  if (!ep) throw new Error(`[api] 모르는 API ID: ${apiId}`)

  if (!isLive(apiId)) {
    // 실제 호출과 비슷한 체감을 주려고 약간 늦춘다. 로딩 상태가 안 보이면 버그를 놓친다.
    await delay(250)
    return typeof mock === 'function' ? mock() : mock
  }

  assertConfigured('VITE_API_BASE', API_BASE)

  const qs = query ? `?${new URLSearchParams(query)}` : ''
  const token = getToken()

  const res = await fetch(`${API_BASE}${path ?? ep.path}${qs}`, {
    method: ep.method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : null),
      ...(token ? { Authorization: `Bearer ${token}` } : null),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })

  // 204(예정 삭제 등)처럼 본문이 없는 응답이 있으므로 먼저 텍스트로 받는다
  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      // JSON이 아니면(프록시 오류 페이지 등) 본문을 그대로 메시지에 싣는다
      throw new ApiError(text.slice(0, 200), { status: res.status, apiId })
    }
  }

  if (!res.ok) {
    const { code, message } = readError(data, res.status)
    throw new ApiError(message, { status: res.status, code, apiId })
  }

  return unwrap(data)
}
