import { describe, expect, it } from 'vitest'
import { businessDaysElapsed, slaStatus } from './sla'

// 기획서 6-1: 승인 처리 기한은 신청 후 2영업일. 주말은 영업일에서 제외.
// (공휴일은 아직 반영하지 않음 → 연습 과제: docs/04-tdd.md 참고)

// 2026-11-02(월) ~ 2026-11-08(일)
const MON = new Date('2026-11-02T10:00:00+09:00')
const TUE = new Date('2026-11-03T10:00:00+09:00')
const WED = new Date('2026-11-04T10:00:00+09:00')
const FRI = new Date('2026-11-06T10:00:00+09:00')
const NEXT_MON = new Date('2026-11-09T10:00:00+09:00')
const NEXT_TUE = new Date('2026-11-10T10:00:00+09:00')

describe('businessDaysElapsed', () => {
  it('같은 날이면 0일', () => {
    expect(businessDaysElapsed(MON, MON)).toBe(0)
  })

  it('월요일 신청, 수요일 기준이면 2영업일', () => {
    expect(businessDaysElapsed(MON, WED)).toBe(2)
  })

  it('금요일 신청, 다음 주 월요일이면 주말을 빼고 1영업일', () => {
    expect(businessDaysElapsed(FRI, NEXT_MON)).toBe(1)
  })

  it('금요일 신청, 다음 주 화요일이면 2영업일', () => {
    expect(businessDaysElapsed(FRI, NEXT_TUE)).toBe(2)
  })
})

describe('slaStatus', () => {
  it('1영업일 미만 경과는 정상', () => {
    expect(slaStatus(MON, MON)).toBe('ok')
  })

  it('1영업일 경과는 주의', () => {
    expect(slaStatus(MON, TUE)).toBe('warning')
  })

  it('2영업일째(기한 당일)도 아직 주의', () => {
    expect(slaStatus(MON, WED)).toBe('warning')
  })

  it('2영업일을 넘기면 기한 초과', () => {
    const THU = new Date('2026-11-05T10:00:00+09:00')
    expect(slaStatus(MON, THU)).toBe('overdue')
  })
})
