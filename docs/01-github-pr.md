# 연습 1. 저장소 만들고 첫 PR 올리기·병합하기

목표: 회사 GitHub 조직에 저장소를 만들고, main 을 보호한 뒤, 첫 PR을 올려 병합까지 해 봅니다.

## 0. 준비
- GitHub 계정, Git 설치 (`git --version`)
- 터미널에서 GitHub 인증: [GitHub CLI](https://cli.github.com/) 설치 후 `gh auth login` 을 권장합니다. (HTTPS + 브라우저 로그인)
- Git 사용자 정보 (한 번만)
  ```bash
  git config --global user.name "충성"
  git config --global user.email "GitHub에 등록한 이메일"
  ```

## 1. 조직과 저장소 만들기 (웹)
1. GitHub 오른쪽 위 `+` → **New organization** → Free 플랜 → 회사 이름으로 생성
   - 소유자(Owner)는 회사 쪽 1명 + 본인. 퇴사자가 생겨도 회사가 저장소를 잃지 않게.
2. 조직 화면 → **New repository**
   - 이름: `relief-medi-web` (연습이면 `relief-medi-web-practice`)
   - 공개 범위: 연습은 Public 권장 (Private 은 GitHub Pages 배포에 유료 플랜이 필요할 수 있음)
   - README, .gitignore 는 **추가하지 않음** (이 프로젝트에 이미 있음)

## 2. 이 프로젝트를 저장소에 올리기 (첫 push)
프로젝트 폴더에서:
```bash
git init -b main
git add .
git commit -m "chore: 프로젝트 초기 세팅"
git remote add origin https://github.com/<조직명>/relief-medi-web.git
git push -u origin main
```
> 첫 push 는 보호 규칙을 켜기 **전에** 해야 합니다. 보호를 켠 뒤에는 main 에 직접 push 가 막힙니다.

## 3. main 브랜치 보호하기 (웹)
저장소 → **Settings → Branches → Add branch ruleset** (또는 Add classic branch protection rule)
- 대상 브랜치: `main`
- ✅ **Require a pull request before merging** (PR 필수)
  - Required approvals: `0` (혼자 개발하는 동안. 리뷰어가 생기면 1로)
  - ✅ Require review from Code Owners (기획자 PR을 충성이 승인해야 머지되게)
- ✅ **Require status checks to pass** → 연습 3에서 CI가 한 번 돈 뒤 `린트·타입체크·테스트·빌드` 를 선택
- ✅ **Block force pushes**, ✅ **Restrict deletions**

머지 방식 통일: **Settings → General → Pull Requests**
- ✅ Allow squash merging 만 켜고 나머지(merge commit, rebase) 끄기
- ✅ Automatically delete head branches (머지 후 브랜치 자동 삭제)

## 4. 첫 PR 올리기
작은 변경으로 연습합니다. 예: README 제목 옆에 이름 추가.
```bash
git switch -c docs/readme-owner        # 새 브랜치 만들고 이동
# README.md 수정
git add README.md
git commit -m "docs: README 담당자 표시"
git push -u origin docs/readme-owner
```
push 하면 터미널에 PR 생성 링크가 나옵니다. 또는:
```bash
gh pr create --fill                   # 커밋 메시지로 제목·본문 채움 (본문은 PR 템플릿이 들어감)
```
웹에서 만들 때: 저장소 상단 노란 배너 **Compare & pull request** 클릭 → 템플릿 채우기 → **Create pull request**

## 5. 병합하기
1. PR 화면 아래쪽에서 검사(Checks) 결과 확인 (연습 3 이후 CI가 돌아감)
2. **Files changed** 탭에서 변경 내용 다시 보기 — 혼자여도 한 번 읽어 보는 습관
3. **Squash and merge** → 커밋 메시지 확인 → **Confirm**
4. 로컬 정리
   ```bash
   git switch main
   git pull                           # 머지된 내용 받기
   git branch -d docs/readme-owner    # 로컬 브랜치 삭제
   ```

## 확인 문제
- [ ] main 에 직접 `git push` 해 보고, 거절되는 것을 확인했다
- [ ] PR 하나를 Squash and merge 로 병합했다
- [ ] 병합 후 main 의 커밋 기록(`git log --oneline`)에 커밋이 하나로 합쳐져 있는 것을 확인했다
