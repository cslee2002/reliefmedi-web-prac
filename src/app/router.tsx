import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import { ApprovalListPage } from '../features/admin-approvals/ApprovalListPage'
import { LoginPage } from '../features/auth/LoginPage'
import { DoctorSignupPage } from '../features/doctor-signup/DoctorSignupPage'
import { PendingPage } from '../features/doctor-signup/PendingPage'
import { screens } from '../screens'
import { HomePage } from './HomePage'
import { Layout } from './Layout'

// 화면 ID → 컴포넌트 연결. screens.ts 에 화면을 추가하면 여기에도 추가합니다.
const components: Record<string, ComponentType> = {
  'WEB-01-01': LoginPage,
  'WEB-03-01': DoctorSignupPage,
  'WEB-03-02': PendingPage,
  'WEB-04-01': ApprovalListPage,
}

export const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      ...screens.map((s) => {
        const Component = components[s.id]
        if (!Component) throw new Error(`화면 ${s.id} 의 컴포넌트가 router.tsx 에 등록되지 않았습니다.`)
        return { path: s.path, element: <Component /> }
      }),
    ],
  },
]

export function createAppRouter() {
  // BASE_URL: 배포 경로 (예: GitHub Pages 는 /저장소이름/). vite.config.ts 의 base 값.
  return createBrowserRouter(routes, { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' })
}
