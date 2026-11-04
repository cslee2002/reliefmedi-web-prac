import { Link, Outlet } from 'react-router'

export function Layout() {
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          릴리프메디 웹 (연습 프로젝트)
        </Link>
        {import.meta.env.VITE_USE_MOCK === 'true' && <span className="badge warning">목업 데이터</span>}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
