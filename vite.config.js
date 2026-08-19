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
     */
    port: 5174,
    strictPort: true,

    /**
     * 개발 중 백엔드 호출을 이 서버가 대신 전달한다.
     * 브라우저는 같은 출처(localhost:5174)로 부르고 실제 요청은 vite 가 서버끼리 보내므로
     * **CORS 가 걸리지 않는다.** 백엔드 허용 목록에 우리 포트가 없어도 개발이 막히지 않는다.
     *
     * 배포본(Netlify)에는 이 프록시가 없다. 그래서 .env.production 은 절대 주소를 쓴다.
     * 배포 전에 백엔드 CORS_ORIGINS 에 배포 주소를 반드시 넣어야 한다.
     */
    proxy: {
      '/api': {
        target: 'http://1.201.116.42:8080',
        changeOrigin: true,
        /**
         * 프록시는 브라우저의 Origin 헤더를 그대로 넘기는데, 우리 포트가 백엔드 허용
         * 목록에 없으면 서버가 「Invalid CORS request」로 거부한다.
         * 그래서 전달할 때 허용된 출처로 바꿔 보낸다.
         * 백엔드 CORS_ORIGINS 에 우리 주소가 추가되면 이 한 줄은 지워도 된다.
         */
        headers: { Origin: 'http://localhost:5173' },
      },
    },
  },
})
