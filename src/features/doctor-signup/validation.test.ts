import { describe, expect, it } from 'vitest'
import { validateLicenseNumber, validatePassword, validateSignup, type SignupInput } from './validation'

// TDD 예제: 이 테스트를 먼저 쓰고, 실패(Red)를 확인한 뒤 validation.ts를 구현(Green)했습니다.
// 기준은 「의사 회원가입·승인 기획서」 4-2 제출 자료를 따릅니다.

const validInput: SignupInput = {
  email: 'doctor@example.com',
  password: 'Relief!2026',
  licenseNumber: '123456',
  hospitalId: 'HOSP-001',
  specialty: '비뇨의학과',
  licenseFileName: 'license.pdf',
  employmentFileName: 'employment.pdf',
  agreedTerms: true,
}

describe('validateLicenseNumber', () => {
  it('숫자만 있으면 통과한다', () => {
    expect(validateLicenseNumber('123456')).toBeNull()
  })

  it('비어 있으면 필수 입력 오류', () => {
    expect(validateLicenseNumber('')).toBe('면허번호를 입력해 주세요.')
  })

  it('숫자가 아닌 문자가 있으면 오류', () => {
    expect(validateLicenseNumber('12a456')).toBe('면허번호는 숫자만 입력할 수 있습니다.')
  })

  it('앞뒤 공백은 무시한다', () => {
    expect(validateLicenseNumber(' 123456 ')).toBeNull()
  })

  it('6자리를 넘으면 오류 (가정값: 실제 면허번호 자릿수 확인 필요)', () => {
    expect(validateLicenseNumber('1234567')).toBe('면허번호는 6자리 이하입니다.')
  })
})

describe('validatePassword', () => {
  it('8자 이상 + 영문·숫자·특수문자를 모두 포함하면 통과', () => {
    expect(validatePassword('Relief!2026')).toBeNull()
  })

  it('8자 미만이면 오류', () => {
    expect(validatePassword('Ab1!')).toBe('비밀번호는 8자 이상이어야 합니다.')
  })

  it('특수문자가 없으면 오류', () => {
    expect(validatePassword('Relief2026')).toBe('영문, 숫자, 특수문자를 모두 포함해 주세요.')
  })
})

describe('validateSignup', () => {
  it('모든 값이 올바르면 오류가 없다', () => {
    expect(validateSignup(validInput)).toEqual({})
  })

  it('이메일 형식이 틀리면 email 오류', () => {
    const errors = validateSignup({ ...validInput, email: 'not-an-email' })
    expect(errors.email).toBe('이메일 형식이 올바르지 않습니다.')
  })

  it('소속 병원을 선택하지 않으면 오류', () => {
    expect(validateSignup({ ...validInput, hospitalId: '' }).hospitalId).toBe('소속 병원을 선택해 주세요.')
  })

  it('면허증 사본과 소속 증빙은 필수', () => {
    const errors = validateSignup({ ...validInput, licenseFileName: '', employmentFileName: '' })
    expect(errors.licenseFileName).toBe('면허증 사본을 첨부해 주세요.')
    expect(errors.employmentFileName).toBe('소속 증빙 서류를 첨부해 주세요.')
  })

  it('약관에 동의하지 않으면 오류', () => {
    expect(validateSignup({ ...validInput, agreedTerms: false }).agreedTerms).toBe('필수 약관에 동의해 주세요.')
  })
})
