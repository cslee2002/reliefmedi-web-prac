import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// BASE_PATH: 배포 경로. GitHub Pages 는 /저장소이름/ , 일반 서버는 / (기본값)
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/main.tsx', 'src/mocks/**', 'src/test/**'],
    },
  },
})
