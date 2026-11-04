// 화면 레지스트리: 모든 화면을 여기에 등록합니다.
// - 라우터(src/app/router.tsx)와 스냅샷 스크립트(scripts/snapshot.ts)가 이 목록을 공통으로 씁니다.
// - React를 import하지 않는 순수 데이터 파일이어야 합니다 (Node 스크립트에서도 읽기 때문).
// - id 는 기획서 화면 ID와 맞추고, design/ 폴더의 시안 파일명도 같은 id로 시작하게 합니다.

export type ScreenState = {
  key: string // 스냅샷 파일명에 붙는 상태 이름
  label: string
  query?: string // 예: 'scenario=empty'
}

export type Screen = {
  id: string
  title: string
  path: string
  role: 'guest' | 'doctor' | 'admin'
  states: ScreenState[]
}

const DEFAULT_STATE: ScreenState = { key: 'default', label: '기본' }

export const screens: Screen[] = [
  {
    id: 'WEB-01-01',
    title: '로그인',
    path: '/login',
    role: 'guest',
    states: [DEFAULT_STATE],
  },
  {
    id: 'WEB-03-01',
    title: '의사 회원가입',
    path: '/doctor/signup',
    role: 'guest',
    states: [DEFAULT_STATE],
  },
  {
    id: 'WEB-03-02',
    title: '가입 심사 대기',
    path: '/doctor/pending',
    role: 'doctor',
    states: [DEFAULT_STATE],
  },
  {
    id: 'WEB-04-01',
    title: '의사 가입 심사 목록',
    path: '/admin/approvals',
    role: 'admin',
    states: [
      DEFAULT_STATE,
      { key: 'empty', label: '신청 없음', query: 'scenario=empty' },
      { key: 'error', label: '불러오기 실패', query: 'scenario=error' },
    ],
  },
]
