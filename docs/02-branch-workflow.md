# 연습 2. 브랜치에서 작업하고 PR 올리기 (GitHub Flow)

목표: 실제 기능 하나를 브랜치에서 개발해 PR로 합치고, 충돌 해결과 기획자 PR 리뷰까지 해 봅니다.

## 브랜치 전략: GitHub Flow
```
main ──●──────────●──────────●──   항상 배포 가능한 상태. PR로만 들어옴
        \        /  \        /
         feat/...    design/...    짧게 쓰고 머지 후 삭제
```
| 접두어 | 용도 | 예 |
|---|---|---|
| `feat/` | 기능 | `feat/doctor-signup-steps` |
| `fix/` | 버그 | `fix/sla-weekend` |
| `design/` | 기획 시안 수정 | `design/signup-steps` |
| `chore/` | 설정·빌드 | `chore/ci-cache` |
| `docs/` | 문서 | `docs/tdd-guide` |

## 커밋 메시지 규칙 (Conventional Commits)
```
<종류>: <무엇을>
feat: 의사 가입 단계 표시 추가
fix: 금요일 신청 건 영업일 계산 오류
test: 공휴일 영업일 테스트 추가
```

## 한 사이클
```bash
git switch main && git pull                 # 1. 최신 main 에서 시작
git switch -c feat/approval-detail          # 2. 브랜치 생성
# 3. 작업 (TDD: 테스트 먼저 → 연습 4)
git add -p                                  # 4. 바뀐 부분을 확인하며 담기
git commit -m "feat: 심사 상세 화면 추가"
git push -u origin feat/approval-detail     # 5. 원격에 올리기
gh pr create --fill                         # 6. PR 생성
# 7. CI 통과 확인 → Squash and merge
git switch main && git pull                 # 8. 정리
git branch -d feat/approval-detail
```
작업 중 main 이 바뀌었다면 PR 올리기 전에 따라잡기:
```bash
git fetch origin
git rebase origin/main      # 내 커밋을 최신 main 위로 옮김
git push --force-with-lease # rebase 후에는 이 옵션으로 push (내 브랜치에서만!)
```

## 실습 A. 기능 브랜치
`src/screens.ts` 에 화면 하나를 추가해 봅니다.
1. `feat/admin-approval-detail` 브랜치 생성
2. `src/features/admin-approvals/ApprovalDetailPage.test.tsx` 에 "신청번호를 제목으로 보여준다" 테스트 작성 → 실패 확인
3. `ApprovalDetailPage.tsx` 구현 → 통과
4. `screens.ts` 에 `WEB-04-02` 등록, `router.tsx` 에 연결
5. PR 생성 → CI 통과 → 병합

## 실습 B. 충돌 일부러 만들어 해결하기
1. main 에서 브랜치 두 개를 만듭니다: `feat/conflict-a`, `feat/conflict-b`
2. 두 브랜치에서 **같은 줄**을 다르게 수정 (예: `src/features/doctor-signup/PendingPage.tsx` 의 제목)
3. A 를 PR → 병합
4. B 를 PR 하면 "This branch has conflicts" 표시
5. 로컬에서 해결:
   ```bash
   git switch feat/conflict-b
   git fetch origin && git rebase origin/main
   # 충돌 파일을 열어 <<<<<<< ======= >>>>>>> 표시를 정리
   git add src/features/doctor-signup/PendingPage.tsx
   git rebase --continue
   git push --force-with-lease
   ```
6. CI 통과 후 병합

## 실습 C. 기획자 PR 리뷰해 보기
기획자 역할을 직접 해 봅니다.
1. `design/signup-steps` 브랜치에서 `design/WEB-03-01_doctor-signup.html` 수정 → PR
2. CODEOWNERS 때문에 리뷰 요청이 자동으로 걸리는 것 확인 (실제 아이디로 바꿨을 때)
3. 리뷰 화면에서 줄 단위 코멘트 남기기 → **Approve** → 병합
4. 바뀐 시안을 보고 React 코드에 반영하는 `feat/` PR 을 따로 만들기
   - 시안 PR 과 구현 PR 을 분리하면 "기획 의도"와 "구현"의 기록이 따로 남습니다.

## 하지 말 것
- main 에서 바로 작업하기
- 남의 브랜치에 `--force` push
- `.env` 같은 비밀 정보 커밋 (실수로 올렸다면 키를 즉시 폐기·재발급)
- 하나의 PR에 여러 기능 섞기 — PR은 작을수록 리뷰와 되돌리기가 쉽습니다
