# CSS 변수(Custom Properties)로 테마 시스템 만들기

CSS 변수(Custom Properties)는 단순한 색상 관리 도구를 넘어, 유지보수하기 좋은 테마 시스템의 핵심입니다. JavaScript 없이도 다크 모드와 컴포넌트 스타일 변형을 깔끔하게 만들 수 있습니다.

## CSS 변수란?

CSS 변수는 `--` 접두사로 시작하고 `var()`로 사용합니다.

```css
:root {
  --color-primary: #4f46e5;
  --spacing-base: 1rem;
}

button {
  background-color: var(--color-primary);
  padding: var(--spacing-base);
}
```

JavaScript의 상수와 다르게, CSS 변수는 **상속**되고 **런타임에 변경**할 수 있습니다.

## 라이트/다크 모드 구현

`data-theme` 속성으로 테마를 전환하는 패턴입니다.

```css
/* 라이트 모드 기본값 */
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a2e;
  --color-accent: #4f46e5;
}

/* 다크 모드 오버라이드 */
[data-theme="dark"] {
  --color-bg: #0f0f13;
  --color-text: #e8e8f0;
  --color-accent: #818cf8;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: background-color 0.2s, color 0.2s;
}
```

JavaScript에서 토글하는 코드:

```javascript
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute(
    'data-theme',
    current === 'dark' ? 'light' : 'dark'
  );
}
```

## 컴포넌트 내부 변수로 변형 만들기

전역 변수를 컴포넌트 안에서 재정의하면 로컬 변형을 쉽게 만들 수 있습니다.

```css
.btn {
  --btn-bg: var(--color-accent);
  --btn-color: white;
  --btn-radius: 6px;

  background-color: var(--btn-bg);
  color: var(--btn-color);
  border-radius: var(--btn-radius);
  padding: 0.5rem 1rem;
}

/* 위험 버튼 변형 */
.btn.danger {
  --btn-bg: #dc2626;
}

/* 큰 버튼 변형 */
.btn.large {
  --btn-radius: 12px;
  font-size: 1.125rem;
}
```

## JavaScript에서 CSS 변수 읽고 쓰기

```javascript
// 읽기
const accent = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-accent').trim();

// 쓰기 (런타임에 동적으로 변경)
document.documentElement.style.setProperty('--color-accent', '#10b981');
```

사용자가 직접 색상을 고를 수 있는 테마 커스터마이저를 만들 때 유용합니다.

## 마치며

CSS 변수를 잘 활용하면 이런 것들이 가능해집니다.

| 기능 | CSS 변수 없이 | CSS 변수로 |
|------|-------------|-----------|
| 다크 모드 | JS로 클래스 일일이 변경 | 변수 하나만 오버라이드 |
| 컴포넌트 변형 | 클래스 중복 선언 | 내부 변수만 재정의 |
| 런타임 테마 변경 | style 속성 직접 조작 | `setProperty` 한 줄 |

CSS 변수는 IE를 제외한 모든 현대 브라우저에서 지원됩니다. 지금 당장 도입하지 않을 이유가 없습니다.
