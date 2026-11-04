import { render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { setScenario } from '../../mocks/scenario'
import { ApprovalListPage } from './ApprovalListPage'

const NOW = new Date('2026-11-03T12:00:00+09:00') // 화요일

describe('ApprovalListPage', () => {
  afterEach(() => setScenario(null))

  it('신청 목록과 기한 상태를 보여준다', async () => {
    render(<ApprovalListPage now={NOW} />)
    const row = (await screen.findByText('APP-0002')).closest('tr')!
    // 10/28(수) 신청 → 11/3(화) 기준 4영업일 경과 → 기한 초과
    expect(within(row).getByText('4일')).toBeInTheDocument()
    expect(within(row).getByText('기한 초과')).toBeInTheDocument()
  })

  it('신청이 없으면 빈 상태 문구를 보여준다', async () => {
    setScenario('empty')
    render(<ApprovalListPage now={NOW} />)
    expect(await screen.findByText('심사할 신청이 없습니다.')).toBeInTheDocument()
  })

  it('불러오기에 실패하면 오류를 보여준다', async () => {
    setScenario('error')
    render(<ApprovalListPage now={NOW} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('목록을 불러오지 못했습니다.')
  })
})
