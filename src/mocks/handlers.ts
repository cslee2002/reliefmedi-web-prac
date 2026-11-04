import { http, HttpResponse } from 'msw'
import type { SignupRequest, SignupResponse } from '../api/types'
import { applications, hospitals } from './fixtures'
import { getScenario } from './scenario'

// 백엔드가 준비되기 전, /api/* 요청에 가짜 응답을 돌려줍니다.
// 경로 앞의 '*/' 는 어떤 호스트·베이스 경로로 요청해도 매칭되게 합니다.

export const handlers = [
  http.get('*/api/hospitals', ({ request }) => {
    const keyword = new URL(request.url).searchParams.get('keyword') ?? ''
    return HttpResponse.json(hospitals.filter((h) => h.name.includes(keyword)))
  }),

  http.post('*/api/doctors/signup', async ({ request }) => {
    const body = (await request.json()) as SignupRequest
    if (body.licenseNumber === '999999') {
      return HttpResponse.json({ message: '이미 가입된 면허번호입니다.' }, { status: 409 })
    }
    const response: SignupResponse = { applicationId: 'APP-9999', status: 'PENDING' }
    return HttpResponse.json(response, { status: 201 })
  }),

  http.get('*/api/admin/doctor-applications', () => {
    const scenario = getScenario()
    if (scenario === 'error') return HttpResponse.json({ message: '서버 오류' }, { status: 500 })
    if (scenario === 'empty') return HttpResponse.json([])
    return HttpResponse.json(applications)
  }),
]
