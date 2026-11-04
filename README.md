# 릴리프메디 웹 (연습 프로젝트)

의사 회원가입·승인 화면을 예제로, 아래 네 가지를 연습하기 위한 프로젝트입니다.

1. GitHub PR 올리기와 병합 → [docs/01-github-pr.md](docs/01-github-pr.md)
2. 브랜치를 만들어 작업한 뒤 PR → [docs/02-branch-workflow.md](docs/02-branch-workflow.md)
3. GitHub Actions로 CI/CD → [docs/03-cicd.md](docs/03-cicd.md)
4. TDD 기반 개발 → [docs/04-tdd.md](docs/04-tdd.md)

순서대로 따라 하면 됩니다.

## 기술 스택
| 용도 | 도구 |
|---|---|
| 화면 | React 19 + TypeScript + Vite |
| 라우팅 | React Router 7 |
| 테스트 | Vitest + Testing Library (jsdom) |
| 가짜 API | MSW (Mock Service Worker) |
| 화면 스냅샷 | Playwright |
| 린트 | oxlint |
| CI/CD | GitHub Actions (+ GitHub Pages) |

## 처음 실행
```bash
# Node 22 필요 (.nvmrc). nvm 사용 시: nvm use
npm install
npm run dev:mock      # 백엔드 없이 목업 데이터로 실행 → http://localhost:5173
```

## 자주 쓰는 명령
| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 (실제 API 사용, 백엔드 필요) |
| `npm run dev:mock` | 개발 서버 (목업 데이터) |
| `npm test` | 테스트 감시 모드 (파일 저장할 때마다 다시 실행) — TDD 할 때 켜 두기 |
| `npm run test:run` | 테스트 한 번 실행 |
| `npm run coverage` | 테스트 + 커버리지 리포트 (`coverage/index.html`) |
| `npm run typecheck` | 타입 검사 |
| `npm run lint` | 린트 |
| `npm run build` | 운영 빌드 (`dist/`) |
| `npm run build:mock` | 목업 빌드 (`dist-mock/`) |
| `npm run snapshot` | 화면별 정적 HTML 생성 (`snapshots/`), `build:mock` 먼저 실행 |

## 폴더 구조
```
├─ design/                 기획 시안 HTML (기획자 편집 영역, 파일명은 화면 ID로 시작)
├─ docs/                   연습 가이드
├─ scripts/snapshot.ts     화면별 정적 HTML 생성
├─ src/
│  ├─ app/                 라우터, 레이아웃, 화면 목록 홈
│  ├─ features/            기능 단위 폴더 (화면 + 로직 + 테스트를 한곳에)
│  │  ├─ auth/
│  │  ├─ doctor-signup/
│  │  └─ admin-approvals/
│  ├─ api/                 API 호출과 타입 (OpenAPI 명세가 나오면 자동 생성 타입으로 교체)
│  ├─ mocks/               MSW 가짜 API, 가짜 데이터, 시나리오(정상/빈 목록/에러)
│  ├─ test/setup.ts        테스트 공통 설정
│  └─ screens.ts           화면 레지스트리 (라우터와 스냅샷이 함께 사용)
└─ .github/                CI/CD 워크플로, PR·이슈 템플릿, CODEOWNERS
```

## 화면 흐름 (시안 → 구현 → 스냅샷)
```
design/ 시안 HTML  ──(충성이 보고 반영)──▶  src/ React 코드  ──(npm run snapshot)──▶  snapshots/ 화면별 HTML
  기획자가 편집                                                                         누구나 열어 봄 (편집 금지)
```
- 스냅샷은 스크립트가 제거된 정적 HTML이라 더블클릭으로 열립니다. 클릭 동작은 없습니다.
- `snapshots/index.html` 에서 같은 화면 ID의 구현과 시안을 나란히 볼 수 있습니다.
- 스냅샷은 커밋하지 않습니다. CI가 PR마다 zip으로 첨부하고, main 머지 시 `/screens/` 경로로 배포합니다.

## 새 화면 추가하는 법
1. `src/features/<기능>/` 에 테스트(`*.test.tsx`)부터 작성
2. 화면 컴포넌트 구현
3. `src/screens.ts` 에 화면 ID·경로·상태 등록
4. `src/app/router.tsx` 의 `components` 에 연결
5. 필요한 가짜 API는 `src/mocks/handlers.ts` 에 추가

