import { Link } from 'react-router'

// 로그인 화면 (뼈대만). 실제 인증·2단계 인증은 백엔드 API가 정해진 뒤 구현합니다.
export function LoginPage() {
  return (
    <section className="card">
      <h1>릴리프메디 의료진 로그인</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <label className="field">
          <span>이메일</span>
          <input type="email" />
        </label>
        <label className="field">
          <span>비밀번호</span>
          <input type="password" />
        </label>
        <button type="submit">로그인</button>
      </form>
      <p className="muted">
        계정이 없으신가요? <Link to="/doctor/signup">의사 회원가입</Link>
      </p>
    </section>
  )
}
