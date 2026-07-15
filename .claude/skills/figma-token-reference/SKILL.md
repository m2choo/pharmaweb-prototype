---
name: figma-token-reference
description: Figma 디자인 시스템(컬러/타이포/컴포넌트 토큰)을 조회해서, 코딩을 시작하기 전에 참조할 CLAUDE.md 토큰 문서를 만들거나 갱신할 때 사용. "토큰 문서 만들어줘", "Figma 참조 문서", "디자인 시스템 반영", "코딩 전에 토큰 정리해줘" 같은 표현이나 figma.com 링크 + 코딩 참조 문서 요청이 나오면 이 Skill을 먼저 참조.
---

# Figma 토큰 참조 문서 생성 Skill

Figma 디자인 시스템 파일을 조회해서, **코딩을 시작하기 전에** 팀이 참조할 토큰/컴포넌트 스펙
문서(`CLAUDE.md` 또는 `docs/design-tokens.md`)를 만든다. 목적은 "다 만들고 나중에 Figma에
맞추기"가 아니라 "처음부터 Figma 토큰으로 코딩해서, 나중에 Figma로 이관할 때 값을 다시 맞추는
작업 자체를 없애는 것"이다.

**관련 Skill**: 이 문서가 이미 있는 상태에서 화면을 Figma로 이관하려면
`html-to-figma-migration` Skill을 쓴다. 그 Skill의 "baseline 실측" 단계를 이 문서로 대체/보강할
수 있다 — 매번 즉석 실측하지 않고 이 문서를 1차 참조하고, 필요한 것만 추가 실측한다.

---

## 0. 시작 전 확인 사항

1. **Figma 파일/노드 링크** — 최소 컬러 가이드, 타이포 가이드 노드. 컴포넌트 가이드 노드가
   따로 있으면 함께 받는다.
2. **대상 코드베이스 경로** — 문서를 어디에 만들지 (보통 저장소 루트의 `CLAUDE.md`)
3. **(선택) 기존 코드에 하드코딩된 값이 있는지** — 있으면 "코드-Figma 불일치" 섹션을 추가로
   만든다 (기존에 vibe-coding으로 짜여진 코드가 있는 경우). 처음부터 이 문서를 보고 코딩하는
   경우엔 이 섹션이 필요 없다.

---

## 1. Figma 조회 절차

### 1-1. 구조 파악 (get_metadata)

큰 canvas/frame 노드는 `get_design_context`가 바로 안 먹으므로, 먼저 `get_metadata`로 전체
구조(노드 이름 목록)를 확보한다.

- Color Guide, Typography 섹션 → 컬러/타이포 리프 노드 위치 파악
- Components 캔버스 → Button/Select/Checkbox/Tag/Popup/LNB 등 컴포넌트별 프레임 위치 파악

**결과가 너무 커서(수만~십만 자) 파일로 저장되면**, JSON 문자열 안의 줄바꿈이 `\n`으로
escape되어 있어 grep이 전체를 한 줄로 인식한다. `resources/flatten-metadata.js`로 실제
줄바꿈으로 풀어낸 뒤 grep할 것.

```bash
node .claude/skills/figma-token-reference/resources/flatten-metadata.js \
  <get_metadata 결과가 저장된 파일 경로> \
  <풀어낸 결과를 저장할 경로>
```

### 1-2. 리프 노드 실측 (get_design_context)

`get_metadata`로 찾은 개별 컴포넌트/스와치 노드 ID로 `get_design_context`를 호출한다.
- canvas/거대 frame이 아니라 **instance/symbol 등 실제 리프 노드**를 호출해야 동작한다
- 여러 개를 조회할 때는 **한 메시지에 병렬로 묶어서** 호출 (한 번에 10~20개까지 가능)
- `excludeScreenshot: true`로 텍스트만 받아 토큰 절약

반환된 코드에서 `var(--color/xxx, #hex)` 같은 시맨틱 변수명이 있으면 그 이름을 그대로 문서에
쓴다 — 나중에 CSS 커스텀 프로퍼티로 도입할 때 Figma 쪽과 이름이 맞아야 Code Connect 매핑이
쉬워진다.

### 1-3. 조회 우선순위 (전부 다 조회하지 않는다)

1. Color Guide 전체 스와치
2. Typography 전체 스케일
3. 실제 화면에 쓰이는 컴포넌트(Button, Select, Tag, Popup, LNB/GNB 등) 위주로 — variant가
   너무 많은 컴포넌트(예: Tag 계열)는 그룹당 1~2개 대표 variant만 실측하고 나머지는 이름만
   기록해도 충분하다

---

## 2. 출력 문서 구조 (템플릿)

`resources/REFERENCE.md.template` 참고. 고정 섹션:

1. **핵심 요약** — 이 문서를 코딩 전에 먼저 보라는 목적 명시, 출처 판단 기준(Figma 값이 항상
   하드코딩 값보다 우선한다는 원칙) 한 줄
2. **컬러 토큰** — 표(토큰명 / hex / 용도), Figma 자체에 있는 명명 불일치나 토큰화 안 된
   그레이가 있으면 별도로 표시
3. **타이포그래피** — 표(스타일명 / 폰트weight / size / line-height / letter-spacing)
4. **컴포넌트별 스펙** — variant별 표(배경/보더/텍스트색, 사이즈, radius 등)
5. **(기존 코드가 있는 경우만) 코드-Figma 불일치** — 코드에 이미 하드코딩된 값과 실측값이
   다른 부분을 표로 정리, 우선 수정 대상으로 명시
6. **MCP 작업 시 주의사항** — 이 Skill 자체의 실전 팁(리프 노드 조회, flatten 스크립트 등)을
   다음 사람이 재사용하도록 남겨둔다

---

## 3. 토큰 절약 원칙

- `get_metadata`는 구조 파악 1회만, 이후는 리프 노드 `get_design_context`로
- 여러 노드 조회는 반드시 병렬 배치로 묶기
- 스크린샷은 기본 제외(`excludeScreenshot: true`) — 시각 확인이 꼭 필요한 컴포넌트만 예외

---

## 4. 이 문서를 코딩에 적용하는 방법 (팀 공유 시 안내)

- 색상·폰트 크기·spacing·radius는 **항상 이 문서의 토큰명을 CSS 커스텀 프로퍼티로 선언해서
  참조** (`--color-primary: #3E71F0;` 등), 임의의 hex/px 값을 새로 박지 않는다.
- 화면 구성·데이터·인터랙션(콘텐츠 축)은 이 문서와 무관하게 자유롭게 작성해도 된다 — 이
  Skill이 강제하는 건 시각 값뿐이다.
- Figma 쪽 디자인 시스템이 바뀌면 이 문서를 다시 생성해서 diff를 확인하고, 코드의 CSS
  변수 값만 갱신하면 된다 (변수명이 같으므로 사용부 코드는 안 건드려도 됨).
