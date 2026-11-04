// API 타입. 백엔드 OpenAPI 명세가 나오면 openapi-typescript 등으로 자동 생성한 타입으로 교체합니다.

export type ApplicationStatus = 'PENDING' | 'NEEDS_FIX' | 'APPROVED' | 'REJECTED'

export type DoctorApplication = {
  id: string
  name: string
  licenseNumber: string
  hospitalName: string
  specialty: string
  status: ApplicationStatus
  submittedAt: string // ISO 8601
}

export type Hospital = {
  id: string
  name: string
  address: string
}

export type SignupRequest = {
  email: string
  password: string
  licenseNumber: string
  hospitalId: string
  specialty: string
  licenseFileName: string
  employmentFileName: string
}

export type SignupResponse = {
  applicationId: string
  status: ApplicationStatus
}
