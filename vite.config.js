import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    /**
     * 포트를 고정한다. 비어 있는 포트를 자동으로 찾게 두면 실행할 때마다 주소가 바뀌는데,
     * 백엔드 CORS 허용 목록에 주소를 등록해야 해서 흔들리면 안 된다.
     * 이 값을 바꾸면 백엔드 CORS_ORIGINS 에도 같이 알려야 한다.
     * (2026-08-20 기준 허용: http://localhost:5173 · http://localhost:5174)
     */
    port: 5174,
    strictPort: true,

    /**
     * 개발 중 백엔드 호출을 이 서버가 대신 전달한다.
     * 브라우저는 같은 출처(localhost:5174)로 부르고 실제 요청은 vite 가 서버끼리 보내므로
     * **CORS 가 걸리지 않는다.**
     *
     * 2026-08-20 부터는 직접 불러도 된다(5174 가 허용 목록에 들어갔다. 브라우저에서 실측 확인).
     * 프록시로 두는 이유는 CORS 가 아니라, 개발 중에 백엔드 주소가 바뀌어도
     * 이 파일 한 줄만 고치면 되기 때문이다.
     *   → 직접 부르고 싶으면 .env.development 의 VITE_API_BASE 를 절대 주소로 바꾸면 된다.
     *
     * 배포본(Netlify)에는 이 프록시가 없다. 그래서 .env.production 은 절대 주소를 쓴다.
     * **배포 주소가 나오면 백엔드 CORS_ORIGINS 에 반드시 넣어야 한다.**
     */
    proxy: {
      '/api': {
        target: 'http://1.201.116.42:8080',
        changeOrigin: true,
        /**
         * 여기 있던 `headers: { Origin: 'http://localhost:5173' }` 는 지웠다.
         *
         * 우리 포트가 백엔드 허용 목록에 없어서 허용된 출처인 척 바꿔 보내던 줄이었는데,
         * 2026-08-20 백엔드가 CORS_ORIGINS 에 5174 를 넣어 줘서 필요가 없어졌다.
         * 남겨 두면 5173 이 목록에서 빠지는 날 이유 없이 깨진다.
         */
      },
    },
  },

  /**
   * 배포본 확인용 서버(`vite build && vite preview`).
   *
   * 기본 포트 4173 은 백엔드 CORS 허용 목록에 **없다** — 실측 403 이다.
   * 그래서 허용된 두 포트 중 dev 가 안 쓰는 5173 으로 고정한다.
   * 이러면 dev(5174)를 켜 둔 채로도 배포본을 같이 띄울 수 있고,
   * .env.production 의 절대 주소로 **실제 CORS 경로를 그대로** 거치게 된다.
   * (개발 서버는 프록시를 타서 같은 출처가 되므로 그 경로를 확인하지 못한다.)
   *
   * 허용 목록: http://localhost:5173 · http://localhost:5174
   */
  preview: {
    port: 5173,
    strictPort: true,
  },
})
