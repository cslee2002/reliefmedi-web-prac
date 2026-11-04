/**
 * 화면별 정적 HTML 스냅샷 생성 스크립트
 *
 * 하는 일
 *  1. 목업 빌드 결과(dist-mock)를 로컬 서버로 띄웁니다.
 *  2. src/screens.ts 에 등록된 화면·상태를 Playwright(헤드리스 브라우저)로 하나씩 엽니다.
 *  3. 렌더링된 화면을 CSS까지 넣은 단일 HTML 파일로 저장합니다. (스크립트 제거 → 더블클릭으로 바로 열림)
 *  4. design/ 시안과 나란히 비교하는 index.html 을 만듭니다.
 *
 * 실행: npm run build:mock && npm run snapshot
 * 결과: snapshots/ 폴더 (커밋하지 않음. CI 에서 생성해 배포·첨부)
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'
import { preview } from 'vite'
import { screens } from '../src/screens.ts'

const ROOT = resolve(import.meta.dirname, '..')
const OUT_DIR = join(ROOT, 'snapshots')
const DESIGN_DIR = join(ROOT, 'design')
const PORT = 4300
const BASE = process.env.BASE_PATH ?? '/'
const COMMIT = process.env.GITHUB_SHA?.slice(0, 7) ?? 'local'

type Row = { id: string; title: string; state: string; file: string; design?: string }

function escapeHtml(text: string) {
  return text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
}

async function main() {
  if (!existsSync(join(ROOT, 'dist-mock', 'index.html'))) {
    throw new Error('dist-mock 이 없습니다. 먼저 npm run build:mock 을 실행하세요.')
  }

  rmSync(OUT_DIR, { recursive: true, force: true })
  mkdirSync(OUT_DIR, { recursive: true })

  const server = await preview({
    root: ROOT,
    base: BASE,
    mode: 'mock',
    build: { outDir: 'dist-mock' },
    preview: { port: PORT, strictPort: true, open: false },
    logLevel: 'warn',
  })
  const origin = `http://localhost:${PORT}${BASE.replace(/\/$/, '')}`

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const designFiles = existsSync(DESIGN_DIR) ? readdirSync(DESIGN_DIR) : []
  const rows: Row[] = []

  try {
    for (const screen of screens) {
      for (const state of screen.states) {
        const url = `${origin}${screen.path}${state.query ? `?${state.query}` : ''}`
        await page.goto(url, { waitUntil: 'networkidle' })
        await page.waitForSelector('main > *')

        const html = await page.evaluate(
          ({ id, title, label, commit }) => {
            // 1) 적용된 CSS 전부를 문자열로 모음
            const css = Array.from(document.styleSheets)
              .map((sheet) => {
                try {
                  return Array.from(sheet.cssRules).map((r) => r.cssText).join('\n')
                } catch {
                  return ''
                }
              })
              .join('\n')
            // 2) 복제본에서 스크립트·외부 스타일 제거 후 CSS 인라인
            const doc = document.documentElement.cloneNode(true) as HTMLElement
            doc.querySelectorAll('script, link[rel="stylesheet"], link[rel="modulepreload"]').forEach((el) => el.remove())
            const style = document.createElement('style')
            style.textContent = css
            doc.querySelector('head')!.appendChild(style)
            // 3) 스냅샷 정보 배너
            const banner = document.createElement('div')
            banner.setAttribute(
              'style',
              'position:fixed;right:8px;bottom:8px;padding:6px 10px;background:#1d2330;color:#fff;font:12px sans-serif;border-radius:6px;opacity:.85;z-index:9999',
            )
            banner.textContent = `${id} ${title} · ${label} · 정적 스냅샷 (commit ${commit})`
            doc.querySelector('body')!.appendChild(banner)
            return '<!doctype html>\n' + doc.outerHTML
          },
          { id: screen.id, title: screen.title, label: state.label, commit: COMMIT },
        )

        const file = `${screen.id}__${state.key}.html`
        writeFileSync(join(OUT_DIR, file), html)
        rows.push({
          id: screen.id,
          title: screen.title,
          state: state.label,
          file,
          design: designFiles.find((f) => f.startsWith(screen.id) && f.endsWith('.html')),
        })
        console.log(`✓ ${file}`)
      }
    }
  } finally {
    await browser.close()
    await new Promise<void>((done) => server.httpServer.close(() => done()))
  }

  // design/ 시안을 함께 복사해 비교 링크가 동작하게 함
  if (designFiles.length > 0) cpSync(DESIGN_DIR, join(OUT_DIR, 'design'), { recursive: true })

  writeFileSync(join(OUT_DIR, 'index.html'), renderIndex(rows))
  console.log(`\n${rows.length}개 스냅샷 생성 완료 → snapshots/index.html`)
}

function renderIndex(rows: Row[]) {
  const body = rows
    .map(
      (r) => `<tr>
  <td>${escapeHtml(r.id)}</td><td>${escapeHtml(r.title)}</td><td>${escapeHtml(r.state)}</td>
  <td><a href="${r.file}">구현 스냅샷</a></td>
  <td>${r.design ? `<a href="design/${r.design}">기획 시안</a>` : '<span class="none">시안 없음</span>'}</td>
</tr>`,
    )
    .join('\n')
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>화면 스냅샷 목록</title>
<style>
body{font-family:Pretendard,'Apple SD Gothic Neo',sans-serif;margin:24px;color:#1d2330;background:#f6f7f9}
table{border-collapse:collapse;background:#fff;width:100%;max-width:960px}
th,td{padding:10px;border-bottom:1px solid #e4e7ec;text-align:left}
.none{color:#98a2b3} .meta{color:#667085;font-size:13px}
</style></head><body>
<h1>화면 스냅샷 목록</h1>
<p class="meta">commit ${COMMIT} · 생성 ${new Date().toISOString()} · 목업 데이터 기준 정적 화면 (클릭 동작 없음)</p>
<table><thead><tr><th>화면 ID</th><th>이름</th><th>상태</th><th>구현</th><th>시안</th></tr></thead>
<tbody>
${body}
</tbody></table></body></html>
`
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
