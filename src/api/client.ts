import type { DoctorApplication, Hospital, SignupRequest, SignupResponse } from './types'

// API 기본 주소. 목업 모드에서는 MSW가 /api/* 요청을 가로챕니다.
const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // 상대 경로를 현재 주소 기준 절대 URL로 바꿉니다 (테스트 환경에서도 동작하도록)
  const url = new URL(`${API_BASE}${path}`, globalThis.location?.href ?? 'http://localhost')
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // httpOnly 쿠키 세션 사용 전제
    ...init,
  })
  if (!res.ok) throw new ApiError(res.status, `요청 실패 (${res.status})`)
  return (await res.json()) as T
}

export const api = {
  searchHospitals: (keyword: string) =>
    request<Hospital[]>(`/hospitals?keyword=${encodeURIComponent(keyword)}`),
  signupDoctor: (body: SignupRequest) =>
    request<SignupResponse>('/doctors/signup', { method: 'POST', body: JSON.stringify(body) }),
  listApplications: () => request<DoctorApplication[]>('/admin/doctor-applications'),
}
