import { Link } from 'react-router'
import { screens } from '../screens'

// 개발용 첫 화면: 등록된 모든 화면으로 이동하는 목록
export function HomePage() {
  return (
    <section className="card wide">
      <h1>화면 목록</h1>
      <h2>등록된 화면을 선택하여 이동합니다.</h2>
      <h3>이런 내용도 추가헀습니다.</h3>
      <table>
        <thead>
          <tr>
            <th>화면 ID</th>
            <th>이름</th>
            <th>권한</th>
            <th>상태별 보기</th>
          </tr>
        </thead>
        <tbody>
          {screens.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.title}</td>
              <td>{s.role}</td>
              <td>
                {s.states.map((st) => (
                  <Link key={st.key} to={`${s.path}${st.query ? `?${st.query}` : ''}`} className="chip">
                    {st.label}
                  </Link>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
