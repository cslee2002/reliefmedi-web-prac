import type { DoctorApplication, Hospital } from '../api/types'

// 화면 확인용 가짜 데이터. 실제 사람 정보가 아닙니다.

export const hospitals: Hospital[] = [
  { id: 'HOSP-001', name: '릴리프 비뇨의학과의원', address: '서울시 영등포구' },
  { id: 'HOSP-002', name: '테스트 대학교병원', address: '경기도 안양시' },
  { id: 'HOSP-003', name: '샘플 여성의원', address: '서울시 강남구' },
]

export const applications: DoctorApplication[] = [
  {
    id: 'APP-0001',
    name: '김테스트',
    licenseNumber: '100001',
    hospitalName: '릴리프 비뇨의학과의원',
    specialty: '비뇨의학과',
    status: 'PENDING',
    submittedAt: '2026-11-02T10:00:00+09:00',
  },
  {
    id: 'APP-0002',
    name: '이샘플',
    licenseNumber: '100002',
    hospitalName: '테스트 대학교병원',
    specialty: '산부인과',
    status: 'PENDING',
    submittedAt: '2026-10-28T15:30:00+09:00',
  },
  {
    id: 'APP-0003',
    name: '박예시',
    licenseNumber: '100003',
    hospitalName: '샘플 여성의원',
    specialty: '산부인과',
    status: 'NEEDS_FIX',
    submittedAt: '2026-11-03T09:00:00+09:00',
  },
]
