import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { api, ApiError } from '../../api/client'
import { validateSignup, type SignupErrors, type SignupInput } from './validation'

const initialInput: SignupInput = {
  email: '',
  password: '',
  licenseNumber: '',
  hospitalId: '',
  specialty: '',
  licenseFileName: '',
  employmentFileName: '',
  agreedTerms: false,
}

const hospitalOptions = [
  { id: 'HOSP-001', name: '릴리프 비뇨의학과의원' },
  { id: 'HOSP-002', name: '테스트 대학교병원' },
  { id: 'HOSP-003', name: '샘플 여성의원' },
]

export function DoctorSignupPage() {
  const navigate = useNavigate()
  const [input, setInput] = useState<SignupInput>(initialInput)
  const [errors, setErrors] = useState<SignupErrors>({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof SignupInput>(key: K, value: SignupInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateSignup(input)
    setErrors(nextErrors)
    setServerError('')
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await api.signupDoctor({
        email: input.email,
        password: input.password,
        licenseNumber: input.licenseNumber.trim(),
        hospitalId: input.hospitalId,
        specialty: input.specialty,
        licenseFileName: input.licenseFileName,
        employmentFileName: input.employmentFileName,
      })
      navigate('/doctor/pending')
    } catch (error) {
      setServerError(
        error instanceof ApiError && error.status === 409
          ? '이미 가입된 면허번호입니다.'
          : '가입 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="card">
      <h1>의사 회원가입</h1>
      <p className="muted">제출 후 운영자가 영업일 기준 2일 이내에 심사합니다.</p>

      <form onSubmit={handleSubmit} noValidate>
        <Field label="이메일(아이디)" error={errors.email}>
          <input type="email" value={input.email} onChange={(e) => update('email', e.target.value)} />
        </Field>
        <Field label="비밀번호" error={errors.password}>
          <input type="password" value={input.password} onChange={(e) => update('password', e.target.value)} />
        </Field>
        <Field label="면허번호" error={errors.licenseNumber}>
          <input inputMode="numeric" value={input.licenseNumber} onChange={(e) => update('licenseNumber', e.target.value)} />
        </Field>
        <Field label="소속 병원" error={errors.hospitalId}>
          <select value={input.hospitalId} onChange={(e) => update('hospitalId', e.target.value)}>
            <option value="">선택해 주세요</option>
            {hospitalOptions.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="전문과목" error={errors.specialty}>
          <input value={input.specialty} onChange={(e) => update('specialty', e.target.value)} />
        </Field>
        <Field label="면허증 사본" error={errors.licenseFileName}>
          <input type="file" onChange={(e) => update('licenseFileName', e.target.files?.[0]?.name ?? '')} />
        </Field>
        <Field label="소속 증빙 (재직증명서 또는 사업자등록증)" error={errors.employmentFileName}>
          <input type="file" onChange={(e) => update('employmentFileName', e.target.files?.[0]?.name ?? '')} />
        </Field>
        <p className="muted small">제출한 서류는 심사 완료 후 7일 내 삭제됩니다.</p>

        <label className="checkbox">
          <input type="checkbox" checked={input.agreedTerms} onChange={(e) => update('agreedTerms', e.target.checked)} />
          의료진 이용약관 및 개인정보 수집·이용에 동의합니다 (필수)
        </label>
        {errors.agreedTerms && <p className="error">{errors.agreedTerms}</p>}

        {serverError && (
          <p role="alert" className="error">
            {serverError}
          </p>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? '제출 중…' : '가입 신청'}
        </button>
      </form>
    </section>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <span className="error">{error}</span>}
    </label>
  )
}
