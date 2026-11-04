// 의사 회원가입 입력 검증 (순수 함수: 화면과 분리해 테스트하기 쉽게)

export type SignupInput = {
  email: string
  password: string
  licenseNumber: string
  hospitalId: string
  specialty: string
  licenseFileName: string
  employmentFileName: string
  agreedTerms: boolean
}

export type SignupErrors = Partial<Record<keyof SignupInput, string>>

// 가정값: 실제 의사 면허번호 자릿수는 확인 후 수정
const LICENSE_MAX_LENGTH = 6

export function validateLicenseNumber(value: string): string | null {
  const trimmed = value.trim()
  if (trimmed === '') return '면허번호를 입력해 주세요.'
  if (!/^\d+$/.test(trimmed)) return '면허번호는 숫자만 입력할 수 있습니다.'
  if (trimmed.length > LICENSE_MAX_LENGTH) return `면허번호는 ${LICENSE_MAX_LENGTH}자리 이하입니다.`
  return null
}

export function validatePassword(value: string): string | null {
  if (value.length < 8) return '비밀번호는 8자 이상이어야 합니다.'
  const hasLetter = /[A-Za-z]/.test(value)
  const hasDigit = /\d/.test(value)
  const hasSpecial = /[^A-Za-z0-9]/.test(value)
  if (!hasLetter || !hasDigit || !hasSpecial) return '영문, 숫자, 특수문자를 모두 포함해 주세요.'
  return null
}

export function validateSignup(input: SignupInput): SignupErrors {
  const errors: SignupErrors = {}

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email = '이메일 형식이 올바르지 않습니다.'

  const passwordError = validatePassword(input.password)
  if (passwordError) errors.password = passwordError

  const licenseError = validateLicenseNumber(input.licenseNumber)
  if (licenseError) errors.licenseNumber = licenseError

  if (input.hospitalId === '') errors.hospitalId = '소속 병원을 선택해 주세요.'
  if (input.specialty.trim() === '') errors.specialty = '전문과목을 입력해 주세요.'
  if (input.licenseFileName === '') errors.licenseFileName = '면허증 사본을 첨부해 주세요.'
  if (input.employmentFileName === '') errors.employmentFileName = '소속 증빙 서류를 첨부해 주세요.'
  if (!input.agreedTerms) errors.agreedTerms = '필수 약관에 동의해 주세요.'

  return errors
}
