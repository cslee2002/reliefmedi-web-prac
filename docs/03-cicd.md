# 연습 3. GitHub Actions 로 CI/CD

목표: PR마다 자동 검사(CI), main 머지 시 자동 배포(CD)를 돌려 봅니다.

## 구성
| 파일 | 언제 | 하는 일 |
|---|---|---|
| `.github/workflows/ci.yml` | PR 생성·갱신 | 린트 → 타입체크 → 테스트(커버리지) → 빌드 → 화면 스냅샷 zip 첨부 |
| `.github/workflows/deploy.yml` | main 에 push(= PR 병합) | 테스트 → 목업 빌드 → 스냅샷 → GitHub Pages 배포 |

```
PR 올림 ──▶ CI ──(통과해야 머지 가능)──▶ Squash merge ──▶ main ──▶ Deploy ──▶ Pages
```

## 1. CI 돌려 보기
1. 아무 브랜치에서 PR 을 올립니다.
2. PR 화면 아래 **Checks** 에 `CI / 린트·타입체크·테스트·빌드`, `CI / 화면 스냅샷` 이 돌아가는 것 확인
3. 저장소 **Actions** 탭 → 실행 기록 클릭 → 단계별 로그 보기
4. 실행 화면 아래 **Artifacts** 의 `screen-snapshots` 를 내려받아 `index.html` 열기

### 일부러 실패시켜 보기
`src/features/admin-approvals/sla.ts` 에서 `>` 를 `>=` 로 바꿔 push → CI 빨간불 → 로그에서 어떤 테스트가 실패했는지 확인 → 되돌려 push → 초록불

## 2. CI 통과를 머지 조건으로 걸기
CI 가 한 번이라도 돈 뒤에 선택할 수 있습니다.
**Settings → Branches(또는 Rules) → main 규칙 → Require status checks to pass** → `린트·타입체크·테스트·빌드` 와 `화면 스냅샷` 선택
→ 이제 CI 가 실패하면 Merge 버튼이 막힙니다.

## 3. CD: GitHub Pages 배포
1. **Settings → Pages → Build and deployment → Source: GitHub Actions** 선택
2. PR 하나를 병합하면 **Actions** 탭에서 `Deploy` 가 실행됨
3. 끝나면 `deploy` 단계에 주소가 표시됩니다.
   - 앱: `https://<조직>.github.io/<저장소>/`
   - 화면 스냅샷: `https://<조직>.github.io/<저장소>/screens/`

> 백엔드가 없어 목업 모드로 배포합니다. 화면 상단에 "목업 데이터" 배지가 보입니다.
> 비공개 저장소에서 Pages 가 막히면 저장소를 공개로 바꾸거나, 아래 서버 배포 방식을 쓰세요.

## 4. 이 워크플로가 하는 일 읽어 보기
`ci.yml` 의 핵심:
```yaml
on:
  pull_request:
    branches: [main]          # main 으로 향하는 PR 에서 실행
jobs:
  verify:
    steps:
      - uses: actions/checkout@v4          # 코드 받기
      - uses: actions/setup-node@v4        # Node 설치 (.nvmrc 버전, npm 캐시)
      - run: npm ci                        # package-lock 그대로 설치
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run coverage
      - run: npm run build
  snapshots:
    needs: verify                          # verify 가 성공해야 실행
```

## 5. 실제 서버가 생기면 (나중에)
스테이징 서버(예: 네이버 클라우드)에 배포하려면 `deploy.yml` 의 Pages 부분을 서버 업로드로 바꿉니다.
1. 서버에 배포용 계정과 SSH 키 생성
2. 저장소 **Settings → Secrets and variables → Actions** 에 등록
   - `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PATH`
3. 빌드 결과(`dist/`)와 스냅샷을 rsync/scp 로 올리는 단계 추가
4. 운영 배포는 태그로만: `on: push: tags: ['v*']`
   ```bash
   git switch main && git pull
   git tag v0.1.0 && git push origin v0.1.0   # 이 순간 운영 배포 워크플로 실행
   ```
- 비밀번호·키는 절대 코드에 쓰지 않고 Secrets 에만 둡니다. 로그에도 `***` 로 가려집니다.
- 실제 API 주소는 빌드 시 `VITE_API_BASE` 환경 변수로 넣습니다.

## 확인 문제
- [ ] PR 에서 CI 초록불·빨간불을 둘 다 봤다
- [ ] Artifacts 에서 화면 스냅샷 zip 을 받아 열어 봤다
- [ ] CI 실패 시 Merge 버튼이 막히는 것을 확인했다
- [ ] main 병합 후 Pages 주소에서 앱과 `/screens/` 를 확인했다
