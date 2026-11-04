import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { DoctorSignupPage } from './DoctorSignupPage'

// 컴포넌트 테스트: 사용자가 보는 화면 기준으로 동작을 확인합니다.
// API 응답은 src/mocks/handlers.ts 의 MSW 목업이 처리합니다 (src/test/setup.ts 에서 켜짐).

function renderPage() {
  const router = createMemoryRouter(
    [
      { path: '/doctor/signup', element: <DoctorSignupPage /> },
      { path: '/doctor/pending', element: <h1>심사 대기 화면</h1> },
    ],
    { initialEntries: ['/doctor/signup'] },
  )
  render(<RouterProvider router={router} />)
}

async function fillValidForm(licenseNumber = '123456') {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('이메일(아이디)'), 'doctor@example.com')
  await user.type(screen.getByLabelText('비밀번호'), 'Relief!2026')
  await user.type(screen.getByLabelText('면허번호'), licenseNumber)
  await user.selectOptions(screen.getByLabelText('소속 병원'), 'HOSP-001')
  await user.type(screen.getByLabelText('전문과목'), '비뇨의학과')
  await user.upload(screen.getByLabelText('면허증 사본'), new File(['x'], 'license.pdf'))
  await user.upload(
    screen.getByLabelText('소속 증빙 (재직증명서 또는 사업자등록증)'),
    new File(['x'], 'employment.pdf'),
  )
  await user.click(screen.getByRole('checkbox'))
  return user
}

describe('DoctorSignupPage', () => {
  it('빈 상태로 제출하면 검증 오류를 보여준다', async () => {
    renderPage()
    await userEvent.setup().click(screen.getByRole('button', { name: '가입 신청' }))
    expect(screen.getByText('이메일 형식이 올바르지 않습니다.')).toBeInTheDocument()
    expect(screen.getByText('면허번호를 입력해 주세요.')).toBeInTheDocument()
  })

  it('올바르게 입력하고 제출하면 심사 대기 화면으로 이동한다', async () => {
    renderPage()
    const user = await fillValidForm()
    await user.click(screen.getByRole('button', { name: '가입 신청' }))
    expect(await screen.findByRole('heading', { name: '심사 대기 화면' })).toBeInTheDocument()
  })

  it('이미 가입된 면허번호면 서버 오류 메시지를 보여준다', async () => {
    renderPage()
    const user = await fillValidForm('999999')
    await user.click(screen.getByRole('button', { name: '가입 신청' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('이미 가입된 면허번호입니다.')
  })
})
