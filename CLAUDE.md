# My Blog — 마크다운 기반 정적 블로그

## 프로젝트 개요

마크다운(`.md`) 파일을 읽어 블로그 웹사이트로 렌더링하는 순수 정적 사이트입니다.
서버 없이 브라우저에서 직접 실행되며, 프레임워크나 빌드 도구를 사용하지 않습니다.

## 기술 스택

- **언어**: HTML, CSS, JavaScript (순수 바닐라, 프레임워크 없음)
- **마크다운 파서**: [marked.js](https://marked.js.org/) (CDN)
- **코드 하이라이팅**: [highlight.js](https://highlightjs.org/) (CDN)
- **빌드 도구**: 없음 — 파일을 직접 브라우저에서 열거나 로컬 HTTP 서버로 실행

## 디렉토리 구조

```
my-blog/
├── CLAUDE.md          # 이 파일
├── index.html         # 메인 진입점 (포스트 목록)
├── post.html          # 개별 포스트 렌더링 페이지
├── css/
│   ├── style.css      # 글로벌 스타일 (레이아웃, 타이포그래피)
│   └── dark.css       # 다크 모드 오버라이드 (또는 CSS 변수로 통합)
├── js/
│   ├── main.js        # 포스트 목록 로딩 및 렌더링
│   ├── post.js        # 마크다운 파싱 및 포스트 렌더링
│   └── theme.js       # 다크/라이트 모드 토글 및 저장
└── posts/
    ├── index.json     # 포스트 메타데이터 목록 (제목, 날짜, slug, 태그)
    └── *.md           # 마크다운 포스트 파일
```

## 핵심 동작 방식

1. `posts/index.json`에 포스트 메타데이터를 관리
2. `index.html`에서 `fetch()`로 `index.json`을 읽어 포스트 목록 렌더링
3. 포스트 클릭 시 `post.html?slug=파일명` 형태로 이동
4. `post.html`에서 `fetch()`로 해당 `.md` 파일을 읽고 marked.js로 파싱하여 표시

## 설계 원칙

- **No build step**: `npm install`, webpack, bundler 없음. CDN 또는 로컬 파일 직접 사용
- **No framework**: React, Vue, Svelte 등 사용 금지. 순수 DOM API 사용
- **CSS 변수 기반 테마**: `:root`와 `[data-theme="dark"]` 셀렉터로 다크 모드 구현
- **모바일 우선 반응형**: `max-width` 기준 미디어 쿼리, 가독성 최우선
- **접근성**: 시맨틱 HTML (`<article>`, `<nav>`, `<main>`, `<time>` 등) 사용

## 디자인 가이드라인

### 타이포그래피
- 본문 폰트: `'Pretendard', 'Noto Sans KR', system-ui, sans-serif`
- 코드 폰트: `'JetBrains Mono', 'Fira Code', monospace`
- 본문 최대 너비: `720px` (가독성을 위한 line length 제한)
- 기본 폰트 크기: `16px`, 줄 간격: `1.7`

### 색상 (CSS 변수)
```css
/* 라이트 모드 */
--color-bg: #ffffff
--color-surface: #f8f9fa
--color-text: #1a1a2e
--color-text-muted: #6c757d
--color-border: #e9ecef
--color-accent: #4f46e5   /* 인디고 — 링크, 강조 */
--color-code-bg: #f4f4f5

/* 다크 모드 */
--color-bg: #0f0f13
--color-surface: #1a1a24
--color-text: #e8e8f0
--color-text-muted: #9090a0
--color-border: #2a2a38
--color-accent: #818cf8
--color-code-bg: #1e1e2e
```

### 레이아웃
- 헤더: 사이트 타이틀 + 다크 모드 토글 버튼
- 포스트 목록: 카드형 또는 리스트형, 제목/날짜/태그 표시
- 포스트 페이지: 제목, 날짜, 태그, 마크다운 본문, 하단 네비게이션(이전/다음)
- 반응형 브레이크포인트: `768px` (모바일/데스크탑 구분)

## posts/index.json 형식

```json
[
  {
    "slug": "claude-code-guide",
    "title": "Claude Code 사용법 가이드",
    "date": "2026-06-17",
    "tags": ["claude", "ai", "tools"],
    "excerpt": "Claude Code CLI 도구의 핵심 기능을 정리한 가이드입니다."
  }
]
```

## 로컬 실행 방법

`fetch()`를 사용하므로 반드시 HTTP 서버가 필요합니다 (file:// 프로토콜 불가).

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code Live Server 확장 사용 가능
```

브라우저에서 `http://localhost:8080` 접속.

## 주요 제약사항

- `fetch()`는 동일 출처 정책 때문에 로컬 파일 직접 열기(`file://`) 불가 → 반드시 로컬 서버 사용
- 새 포스트 추가 시 반드시 `posts/index.json`에도 메타데이터 추가
- IE 지원 불필요. 최신 Chromium/Firefox/Safari 기준
