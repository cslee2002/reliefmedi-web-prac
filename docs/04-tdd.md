# 연습 4. TDD 기반 개발

목표: "실패하는 테스트 먼저 → 통과하는 최소 구현 → 정리"를 반복하는 리듬을 몸에 익힙니다.

## TDD 한 바퀴
```
🔴 Red      실패하는 테스트를 하나 쓴다 (아직 기능이 없으니 실패해야 정상)
🟢 Green    테스트를 통과하는 가장 단순한 코드를 쓴다
🔵 Refactor 테스트가 통과하는 상태를 유지하며 코드를 정리한다
```
터미널 하나에 감시 모드를 켜 두고 진행합니다.
```bash
npm test          # 파일을 저장할 때마다 관련 테스트가 다시 돔
```

## 이 프로젝트의 예제 읽기
| 예제 | 테스트 | 구현 | 배울 점 |
|---|---|---|---|
| 가입 입력 검증 | `src/features/doctor-signup/validation.test.ts` | `validation.ts` | 순수 함수는 테스트가 가장 쉽다. 화면 로직을 함수로 빼내는 이유 |
| 처리 기한(2영업일) | `src/features/admin-approvals/sla.test.ts` | `sla.ts` | 날짜는 "지금"을 인자로 받아야 테스트할 수 있다 |
| 가입 화면 | `DoctorSignupPage.test.tsx` | `DoctorSignupPage.tsx` | 사용자가 보는 기준(라벨, 버튼 이름)으로 테스트. API 는 MSW 가 대신 응답 |
| 심사 목록 | `ApprovalListPage.test.tsx` | `ApprovalListPage.tsx` | 정상·빈 목록·에러 상태를 시나리오로 나눠 테스트 |

## 실습 1. 공휴일을 영업일에서 빼기 (sla.ts)
지금 `businessDaysElapsed` 는 주말만 뺍니다. 기획서는 "주말·공휴일 제외"입니다.

브랜치: `feat/sla-holidays`

**🔴 Red** — `sla.test.ts` 에 추가하고 저장 → 실패 확인
```ts
describe('공휴일', () => {
  it('공휴일은 영업일에서 뺀다', () => {
    const holidays = ['2026-11-04'] // 수요일을 공휴일로 가정
    // 월 → 목: 화, (수 공휴일), 목 = 2영업일
    expect(businessDaysElapsed(MON, new Date('2026-11-05T10:00:00+09:00'), holidays)).toBe(2)
  })
})
```
타입 오류(인자 개수)도 Red 입니다.

**🟢 Green** — `businessDaysElapsed(submittedAt, now, holidays: string[] = [])` 로 인자를 추가하고, 날짜가 holidays 에 있으면 세지 않게 합니다. 기존 테스트가 깨지지 않는지 함께 확인합니다.

**🔵 Refactor** — 일 번호 ↔ `YYYY-MM-DD` 변환을 함수로 빼는 등 정리. 테스트는 계속 초록이어야 합니다.

**한 걸음 더** — `slaStatus` 에도 holidays 를 전달하는 테스트 → 구현. 공휴일 목록을 어디서 가져올지(고정 목록 / API)는 기획 질문으로 남겨 둡니다.

## 실습 2. 1년 재확인 기한 (새 함수)
기획서 9-3: 기한 30일 전 알림, 기한 경과 시 "소속 확인 필요", 30일 더 지나면 "정지".

새 파일 `src/features/doctor-account/recheck.test.ts` 부터 만듭니다.
```ts
import { describe, expect, it } from 'vitest'
import { recheckStage } from './recheck'

describe('recheckStage', () => {
  const due = new Date('2027-11-03T00:00:00+09:00')

  it('기한 30일 전보다 이르면 none', () => {
    expect(recheckStage(due, new Date('2027-09-01T00:00:00+09:00'))).toBe('none')
  })
  it('기한 30일 전부터는 notify', () => { /* 직접 작성 */ })
  it('기한이 지나면 needs-confirmation', () => { /* 직접 작성 */ })
  it('기한 30일이 더 지나면 suspended', () => { /* 직접 작성 */ })
  it('경계값: 정확히 30일 전 / 기한 당일', () => { /* 직접 작성 */ })
})
```
경계값(정확히 30일, 당일 0시)을 테스트로 먼저 정하는 것이 TDD 의 큰 장점입니다. 기획서의 모호한 부분이 여기서 드러납니다.

## 실습 3. 화면 테스트 먼저 쓰기
`ApprovalDetailPage` (연습 2 실습 A) 를 화면 테스트부터 시작합니다.
```tsx
it('반려 버튼을 누르면 사유를 입력하라고 한다', async () => {
  // 렌더 → 반려 클릭 → '반려 사유를 선택해 주세요' 가 보이는지
})
```
가짜 API 가 필요하면 `src/mocks/handlers.ts` 에 핸들러를 먼저 추가합니다.

## 좋은 테스트 습관
- 테스트 이름은 한국어로 "무엇을 하면 어떻게 된다" — 그대로 기획 명세가 됩니다
- 구현 세부(state 이름, 내부 함수)가 아니라 결과(화면에 보이는 것, 반환값)를 검사
- 시간·난수·네트워크처럼 바뀌는 값은 인자로 받거나 목업으로 고정
- 버그를 발견하면 먼저 그 버그를 재현하는 테스트를 쓰고 고치기
- 커버리지 숫자보다 "중요한 규칙이 테스트로 고정되어 있는가"가 중요
  ```bash
  npm run coverage   # coverage/index.html 에서 안 덮인 줄 확인
  ```

## 확인 문제
- [ ] 테스트를 먼저 쓰고 빨간불을 본 뒤 구현했다
- [ ] 실습 1을 PR 로 올려 CI 초록불로 병합했다
- [ ] 실습 2에서 경계값 테스트를 통해 기획에 물어볼 질문을 하나 이상 찾았다
