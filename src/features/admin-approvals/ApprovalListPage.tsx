import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import type { ApplicationStatus, DoctorApplication } from '../../api/types'
import { businessDaysElapsed, slaStatus, type SlaStatus } from './sla'

type LoadState =
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'loaded'; items: DoctorApplication[] }

const statusLabel: Record<ApplicationStatus, string> = {
  PENDING: '심사 대기',
  NEEDS_FIX: '보완 요청',
  APPROVED: '승인',
  REJECTED: '반려',
}

const slaLabel: Record<SlaStatus, string> = {
  ok: '정상',
  warning: '주의',
  overdue: '기한 초과',
}

type Props = {
  /** 기준 시각. 테스트·스냅샷에서 결과가 매번 같도록 주입할 수 있게 둡니다. */
  now?: Date
}

export function ApprovalListPage({ now }: Props) {
  const [state, setState] = useState<LoadState>({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false
    api
      .listApplications()
      .then((items) => !cancelled && setState({ kind: 'loaded', items }))
      .catch(() => !cancelled && setState({ kind: 'error' }))
    return () => {
      cancelled = true
    }
  }, [])

  // 기준 시각은 처음 렌더링할 때 한 번만 정합니다 (렌더링마다 값이 바뀌지 않도록)
  const [base] = useState(() => now ?? new Date())

  return (
    <section className="card wide">
      <h1>의사 가입 심사 목록</h1>
      <p className="muted">처리 기한: 신청 후 2영업일 이내</p>

      {state.kind === 'loading' && <p>불러오는 중…</p>}
      {state.kind === 'error' && (
        <p role="alert" className="error">
          목록을 불러오지 못했습니다.
        </p>
      )}
      {state.kind === 'loaded' && state.items.length === 0 && <p>심사할 신청이 없습니다.</p>}
      {state.kind === 'loaded' && state.items.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>신청번호</th>
              <th>이름</th>
              <th>소속 병원</th>
              <th>전문과목</th>
              <th>상태</th>
              <th>경과 영업일</th>
              <th>기한</th>
            </tr>
          </thead>
          <tbody>
            {state.items.map((item) => {
              const submitted = new Date(item.submittedAt)
              const sla = slaStatus(submitted, base)
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.hospitalName}</td>
                  <td>{item.specialty}</td>
                  <td>{statusLabel[item.status]}</td>
                  <td>{businessDaysElapsed(submitted, base)}일</td>
                  <td>
                    <span className={`badge ${sla}`}>{slaLabel[sla]}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </section>
  )
}
