---
name: wellcheck-prototype
description: 웰체크 약사웹 프로토타입(pharmaweb-prototype) HTML 화면을 새로 만들거나 수정할 때 사용. "프로토타입 만들어줘", "새 화면 만들어줘", "약사웹 화면 추가/수정", "고객 목록/상세/처방전 화면" 같은 요청이 나오면 명시적으로 스킬을 쓰라는 말이 없어도 반드시 이 스킬을 먼저 참조한다. 이 스킬의 목적은 "그냥 도는 HTML"이 아니라 "Figma로 옮기기 쉬운, 디자인 시스템에 정확히 맞춘 HTML"을 만드는 것이다. HTML 프로토타입 화면을 만들거나 고치는 모든 작업이 트리거 대상이며, 실제 Figma 이관 단계는 wellcheck-prototype-migration 스킬로 이어진다.
---

# 웰체크 약사웹 프로토타입 빌더 Skill

디자인 시스템 토큰에 맞춘 HTML 프로토타입을 생성/수정하는 스킬. 최종 목표는 이 HTML을
`wellcheck-prototype-migration` 스킬로 Figma에 **컴포넌트 인스턴스 기반**으로 이관하는 것이다.

---

## 이 스킬의 위치 (전체 파이프라인)

```
[1단계] 이 스킬          [2단계] wellcheck-prototype-migration 스킬
토큰 맞춘 HTML 생성   →   그 HTML을 Figma 컴포넌트 인스턴스로 이관
(+ 이관 마커 부착)        (기준 프레임 클론 + createInstance)
```

- 이 스킬은 **1단계만** 담당한다. HTML을 직접 `use_figma`로 노드 생성하지 않는다.
- 이관은 반드시 2단계 스킬에 넘긴다. 이유는 아래 "왜 raw 노드 생성이 실패했나" 참조.

### 왜 raw 노드 생성이 실패했나 (이 스킬이 존재하는 이유)

이전 방식은 토큰 맞춘 HTML을 `use_figma`로 createFrame/createText 하듯 raw 노드를 직접
그렸다. 색·폰트가 토큰과 같아도 결과물은 **디자인 시스템 컴포넌트(Button, Tag, Select
인스턴스)에 연결되지 않은 껍데기 노드 덩어리**였다 — 이관 실패의 실체.

교훈: HTML→Figma의 병목은 "색·폰트 값 불일치"가 아니라 "HTML 요소 → Figma **컴포넌트
인스턴스** 매핑"이다. 그래서 이 스킬은 HTML을 이관의 **설계도**로 취급하고, 각 요소에
"이건 어떤 컴포넌트다"라는 마커(`data-figma`)를 심어둔다. 2단계 스킬은 그 마커를 읽어
raw로 그리지 않고 `createInstance`로 조립한다.

---

## 절대 원칙 3가지

1. **시각 값(색·폰트·spacing·radius)은 항상 `resources/tokens.md`만 따른다.** 새 hex나
   임의 px를 짓지 않는다. tokens.md에 없는 값이 필요하면(신규 컴포넌트 등) 사용자에게 먼저
   확인한다 — 임의 추정 금지.
2. **콘텐츠(화면 구성, 데이터, 문구, 인터랙션)는 사용자 요청대로** 자유롭게 작성한다. 이
   스킬이 강제하는 건 시각 값과 이관 친화 구조뿐이다.
3. **모든 UI 요소에 이관 마커(`data-figma`)를 붙인다.** 마커 없는 요소는 2단계 이관에서
   raw 노드로 떨어져 실패했던 원인이 된다.

---

## 절차 (순서 고정)

### 1. `resources/tokens.md`를 먼저 view로 실제 읽는다 — 조회 전 착수 금지

"먼저 읽는다"는 지시만으로는 실제 조회가 누락된다(이전 실패 원인). **tokens.md를 view로
연 뒤에만 화면 작성을 시작한다.** 저장소에 별도 CLAUDE.md가 있어도 이 스킬이 트리거된
작업에서는 tokens.md가 유일 기준이다.

### 2. 기존 소스/패턴 확보

- 기존 화면 파일은 GitHub raw에서 가져온다(반드시 `master` 브랜치):
  `https://raw.githubusercontent.com/m2choo/pharmaweb-prototype/master/[파일명]`
  (예: `customer_list.html`, `customer_info.html`, `prescription_list.html`)
- 프로젝트 스택: 프레임워크·빌드 시스템 없는 vanilla HTML + 페이지별 `<style>` 블록
  (`server.js` 정적 서빙, 포트 8765). 새 화면도 같은 구조로 만든다 — React·별도 CSS 파일
  도입 등 임의로 스택을 바꾸지 않는다.

### 3. 이관 친화 구조로 작성 (아래 "이관 친화 HTML 규칙" 준수)

### 4. 모든 컴포넌트에 `data-figma` 마커 부착 (아래 "컴포넌트 매핑" 준수)

### 5. 자가 검증 (아래 "완료 전 체크리스트" 전 항목 통과 확인)

### 6. 완료 후 사용한 토큰을 간단히 언급

예: "primary는 tokens.md `--color-primary`, 전송상태 태그는 전송가능 토큰을 썼습니다."
사용자가 임의 값 혼입 여부를 확인할 수 있게 한다.

---

## 컴포넌트 매핑 — HTML 마커 → Figma 컴포넌트

각 UI 요소에 `data-figma="<타입>/<variant>"` 속성을 단다. 2단계 이관 스킬은 이 값을
검색 키로 삼아 기존 컴포넌트를 찾아 `createInstance` 한다(wellcheck-prototype-migration 2-4절).
값(색 등)은 tokens.md 기준으로 인라인 지정하되, 마커가 "인스턴스로 묶어라"는 신호다.

| HTML 요소 | data-figma 값 | 이관 시 인스턴스화 대상 |
|---|---|---|
| 기본 파랑 버튼 | `button/solid` | Button solid(primary) |
| 연파랑 버튼 | `button/solid-secondary` | Button solid-secondary |
| 다크 버튼 | `button/solid-dark` | Button solid-dark |
| 외곽선 버튼 | `button/outlined` | Button outlined |
| 보조 외곽선 버튼 | `button/outlined-secondary` | Button outlined-secondary |
| 고스트 버튼 | `button/ghost` | Button ghost |
| 전송상태 태그(전송가능) | `tag/status-success` | 전송상태 태그(전송가능) |
| 전송상태 태그(관리필요) | `tag/status-warning` | 전송상태 태그(관리 필요) |
| 질환 태그 | `tag/disease-<질환>` | 질환 태그(Heavy, 닷 마커 포함) |
| 위험군 태그 | `tag/risk-<고중저>` | 위험군 태그(pill) |
| 담당역할 태그 | `tag/role-<역할>` | 담당역할 태그 |
| Select/드롭다운 | `select/<xs\|s\|m\|l\|xl>` | Select |
| Search 입력 | `search/default` | Search |
| Checkbox | `checkbox` | Checkbox |
| Radio | `radio` | Radio |
| Toggle | `toggle` | Toggle |
| 페이지네이션 | `pagination` | Pagination |
| 팝업/모달 | `popup` | Popup |
| 좌측 내비 | `lnb` | LNB |

- **닷 마커·pill 배경 같은 내부 구조는 HTML에서 흉내만 내고, 실제 구조는 이관 시 컴포넌트가
  갖는다.** HTML에서 `<span class="dot">`을 빼먹어도 마커만 정확하면 이관 컴포넌트가 채운다.
- 표에 없는 신규 요소는 마커를 `data-figma="new/<의미>"`로 달고, 완료 보고 시 "신규 컴포넌트
  후보"로 사용자에게 알린다(임의 신규 생성 금지, 절대 원칙 1).

---

## 버튼 배치 규칙 (긍정/부정 액션 쌍)

모달·팝업 footer 등에 버튼 2개가 나란히 놓일 때(확인/취소류), 항상 아래 순서를 지킨다.

- **긍정 액션(예, 보내기, 전송하기, 저장, 확인 등)은 오른쪽, 활성 스타일**
  (`button/solid` — primary 배경 + white 텍스트).
- **부정/보조 액션(아니요, 취소, 이전 등)은 왼쪽, 비활성 톤 스타일**
  (`button/outlined-secondary` 또는 `button/outlined` — white 배경).
- 새 화면을 만들거나 기존 화면을 수정할 때 버튼 쌍이 생기면 항상 이 순서로 배치한다 — 반대로
  되어 있으면(부정이 오른쪽) 위반이므로 바로잡는다.

---

## 이관 친화 HTML 규칙

Figma auto-layout·frame에 1:1로 매핑되도록 짠다. 아래는 이관 병목(구조 매핑)을 줄이는 제약.

- **모든 블록을 명시적 컨테이너로 감싼다.** 익명 텍스트·떠 있는 요소 금지 → Figma frame에
  매핑될 단위를 분명히 한다.
- **레이아웃은 flex로, 파라미터를 인라인으로 명시한다.** `display:flex`, `flex-direction`,
  `gap`, `padding`을 CSS 상속에 맡기지 말고 요소에 직접 준다 → auto-layout 변환 시 gap·padding·
  방향이 그대로 읽힌다.
- **컴포넌트 단위를 주석으로 표시한다.** 예: `<!-- component: button/solid -->` → 이관 시
  묶음 경계 인식.
- **spacing은 4px 그리드 배수로.** 임의 홀수 px 지양 → Figma spacing과 어긋남 방지.
- **폰트는 tokens.md 스타일명 기준.** Noto Sans KR / Poppins(영문·숫자). 이관 시
  `loadFontAsync` 대상이 되므로 그 외 폰트 혼입 금지.
- **텍스트는 실제 프로토타입 데이터로 채운다.** 더미("텍스트", "Lorem") 잔존 금지 —
  이관 후 그대로 남는다.

---

## 이관 핸드오프 (2단계 연결)

HTML 완성 후 이관 요청("Figma로 옮겨줘")이 오면, **이 스킬에서 직접 노드를 만들지 않고**
`wellcheck-prototype-migration` 스킬을 참조한다. 그 스킬에 이 HTML을 넘기면:

- 기준 프레임(`392:5278` 등)을 `.clone()`해서 베이스로 사용
- `data-figma` 마커별로 기존 컴포넌트를 검색해 `createInstance` (raw createFrame 금지)
- 색은 스타일 ID 바인딩(raw RGB 하드코딩 금지), 폰트는 loadFontAsync 선행
- 화면 번호 라벨·code-based Description까지 그 스킬이 처리

즉 이 스킬의 산출물(마커 붙은 HTML)이 곧 이관 스킬의 입력 스펙이 된다.

---

## 완료 전 체크리스트 (전 항목 통과해야 완료)

- [ ] tokens.md를 view로 실제 열었는가
- [ ] 하드코딩 hex/px 중 tokens.md에 없는 값이 있는가 → grep으로 대조, 있으면 사용자 확인
- [ ] 모든 버튼·태그·입력·팝업에 `data-figma` 마커가 있는가
- [ ] 긍정/부정 버튼 쌍이 "부정 왼쪽(비활성) · 긍정 오른쪽(활성)" 순서로 배치됐는가
- [ ] 모든 블록이 명시적 컨테이너로 감싸져 있고 flex 파라미터가 인라인인가
- [ ] 폰트가 Noto Sans KR / Poppins 외로 새지 않았는가
- [ ] 더미 텍스트가 남아 있지 않은가
- [ ] 스택(vanilla HTML + `<style>`)을 그대로 유지했는가

---

## tokens.md 갱신 방법

Figma 디자인 시스템이 바뀌면 `figma-token-reference` 스킬로 다시 조회해서
`resources/tokens.md` **이 파일 하나만** 교체한다. SKILL.md 본문·절차는 안 바뀐다. 팀원
배포 시에도 이 파일 하나만 다시 보내면 된다.

> 확인 포인트: 현재 tokens.md 출처는 의사 Web 파일(`YRWyzc9i5g82n3qhMTkBpn`)이다. 이관
> 목적지인 마스터 가이드(`Hg2fE9R6yId239HK6vTau8`)의 Paint Style과 값이 일치한다는 전제로
> 동작한다. 이관 중 색 불일치가 발견되면 wellcheck-prototype-migration 2-2절대로 마스터 가이드
> 값을 우선한다.

---

## 배포/설치 방법 (팀원용)

git 저장소와 무관하게 독립 동작하도록 만들어졌다. `wellcheck-prototype/` 폴더 전체
(`SKILL.md` + `resources/`)를 통째로 받아 Claude Code 환경에 넣으면 된다.

- **개인 전역 설치**: `~/.claude/skills/wellcheck-prototype/`에 폴더 복사 (어떤 저장소를
  열어도 트리거 워드에 반응)
- **특정 프로젝트에만**: 그 프로젝트의 `.claude/skills/wellcheck-prototype/`에 복사
- **전달**: 폴더를 zip으로 압축해 Slack/Drive 전달, 또는 저장소를 git으로 받으면
  `.claude/skills/` 하위가 이미 포함되므로 clone/pull만 해도 됨
