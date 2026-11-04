// 승인 처리 기한(SLA) 계산. 기준 시간대는 한국 시간(KST).

export type SlaStatus = 'ok' | 'warning' | 'overdue'

export const SLA_BUSINESS_DAYS = 2

const KST_OFFSET_MS = 9 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

// KST 기준 날짜(자정)로 맞춘 일 번호
function kstDayNumber(date: Date): number {
  return Math.floor((date.getTime() + KST_OFFSET_MS) / DAY_MS)
}

function isWeekend(dayNumber: number): boolean {
  // 1970-01-01(day 0)은 목요일. 0=목,1=금,2=토,3=일
  const weekday = ((dayNumber % 7) + 7) % 7
  return weekday === 2 || weekday === 3
}

/** 신청일 다음 날부터 기준일까지 지난 영업일 수 (주말 제외) */
export function businessDaysElapsed(submittedAt: Date, now: Date): number {
  const start = kstDayNumber(submittedAt)
  const end = kstDayNumber(now)
  let count = 0
  for (let day = start + 1; day <= end; day++) {
    if (!isWeekend(day)) count++
  }
  return count
}

export function slaStatus(submittedAt: Date, now: Date): SlaStatus {
  const elapsed = businessDaysElapsed(submittedAt, now)
  if (elapsed > SLA_BUSINESS_DAYS) return 'overdue'
  if (elapsed >= 1) return 'warning'
  return 'ok'
}
