# 매일 쓰는 JavaScript 배열 메서드 5가지

실무에서 배열을 다루는 코드는 하루에도 수십 번 씁니다. 그런데 `for` 루프 대신 적절한 배열 메서드를 쓰면 코드가 훨씬 읽기 쉬워집니다. 오늘은 가장 자주 쓰이는 5가지 메서드와, 실수하기 쉬운 함정을 함께 정리합니다.

## 1. `filter` — 조건에 맞는 항목만 뽑기

```javascript
const users = [
  { name: '김철수', active: true },
  { name: '이영희', active: false },
  { name: '박민준', active: true },
];

const activeUsers = users.filter(u => u.active);
// [{ name: '김철수', active: true }, { name: '박민준', active: true }]
```

**함정**: `filter`는 항상 새 배열을 반환합니다. 원본은 그대로입니다.

## 2. `map` — 모든 항목을 변환하기

```javascript
const prices = [1000, 2500, 800];
const discounted = prices.map(p => Math.round(p * 0.9));
// [900, 2250, 720]

// 객체 배열에서 특정 필드만 추출할 때도 유용
const names = users.map(u => u.name);
// ['김철수', '이영희', '박민준']
```

**함정**: `map` 안에서 부수 효과(콘솔 출력, API 호출 등)를 실행하지 마세요. 그럴 땐 `forEach`가 적합합니다.

## 3. `reduce` — 배열을 하나의 값으로 합치기

```javascript
const cart = [
  { name: '커피', price: 4500, qty: 2 },
  { name: '샌드위치', price: 6000, qty: 1 },
];

const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
// 15000
```

`reduce`는 합계 외에도 객체 변환, 그룹핑에 활용됩니다.

```javascript
// 태그별로 포스트 묶기
const byTag = posts.reduce((acc, post) => {
  (post.tags || []).forEach(tag => {
    acc[tag] = acc[tag] || [];
    acc[tag].push(post);
  });
  return acc;
}, {});
```

## 4. `find` vs `filter` — 하나만 필요할 때

```javascript
const users = [
  { id: 1, name: '김철수' },
  { id: 2, name: '이영희' },
];

// filter → 배열 반환 (항상)
const result1 = users.filter(u => u.id === 1); // [{ id: 1, ... }]

// find → 첫 번째 항목 또는 undefined 반환
const result2 = users.find(u => u.id === 1);   // { id: 1, ... }
```

하나만 찾을 때는 `find`가 더 명확하고, 찾으면 즉시 멈춰서 더 빠릅니다.

## 5. `flatMap` — map + flat을 한 번에

```javascript
const sentences = ['안녕 세상', '오늘 날씨'];
const words = sentences.flatMap(s => s.split(' '));
// ['안녕', '세상', '오늘', '날씨']
```

`map`을 하고 `flat(1)`을 따로 호출하는 것보다 한 번에 처리할 수 있어 편합니다. 특히 1:N 변환(하나의 항목이 여러 결과로 펼쳐지는 경우)에 딱 맞습니다.

## 마치며

| 메서드 | 용도 | 반환 |
|--------|------|------|
| `filter` | 조건에 맞는 항목 선별 | 배열 |
| `map` | 모든 항목 변환 | 배열 |
| `reduce` | 배열 → 단일 값/객체 | 임의 |
| `find` | 첫 번째 매칭 항목 | 항목 또는 `undefined` |
| `flatMap` | 변환 후 1단계 펼치기 | 배열 |

이 5가지만 제대로 익혀도 대부분의 배열 처리는 깔끔하게 해결됩니다. `for` 루프가 필요한 경우는 생각보다 많지 않습니다.
