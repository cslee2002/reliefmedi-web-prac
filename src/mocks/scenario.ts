// 목업 응답 시나리오. 같은 화면의 여러 상태(정상, 빈 목록, 에러)를 보여주기 위해 사용합니다.
// 브라우저: 주소에 ?scenario=empty 처럼 붙이면 적용됩니다.
// 테스트: setScenario('empty') 로 지정합니다.

export type Scenario = 'default' | 'empty' | 'error'

let override: Scenario | null = null

export function setScenario(next: Scenario | null) {
  override = next
}

export function getScenario(): Scenario {
  if (override) return override
  const search = globalThis.location?.search ?? ''
  const value = new URLSearchParams(search).get('scenario')
  return value === 'empty' || value === 'error' ? value : 'default'
}
