import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// 테스트(Vitest)에서 사용하는 목업 서버
export const server = setupServer(...handlers)
