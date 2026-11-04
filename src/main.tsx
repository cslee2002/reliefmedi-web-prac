import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { createAppRouter } from './app/router'
import './index.css'

async function bootstrap() {
  // 목업 모드(.env.mock)일 때만 MSW를 켭니다. 운영 빌드에는 포함되지 않습니다.
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const { startMockWorker } = await import('./mocks/browser')
    await startMockWorker()
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={createAppRouter()} />
    </StrictMode>,
  )
}

void bootstrap()
