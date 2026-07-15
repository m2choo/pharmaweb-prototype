# pharmaweb-prototype — Figma 연동 규칙

이 문서는 Figma 디자인 시스템(파일 `YRWyzc9i5g82n3qhMTkBpn` — "의사 Web") 중 "Style Guide" 캔버스
+ "Components" 캔버스를 이 코드베이스에 반영할 때 참고할 규칙이다.

**핵심 요약**: Figma 쪽에는 이미 잘 정리된 시맨틱 디자인 토큰(`--color/primary`,
`--color/grey/800`, `--font/size/base` 등)과 컴포넌트 variant 체계가 존재한다. 반면 이 코드
(`customer_list.html`, `customer_info.html`, `prescription_list.html`)는 토큰이 전혀 없고
색상·폰트 크기·radius를 페이지마다 하드코딩한 순수 정적 HTML이다. **Figma 연동 작업의 본질은
"코드에 토큰을 처음 도입하면서 Figma 값으로 맞추는 것"**이며, 그 과정에서 아래처럼 이미 코드와
Figma 값이 어긋난 부분들을 바로잡아야 한다.

> **출처 판단 기준**: 이 문서의 색상·타이포·컴포넌트 값은 의사웹 파일(`YRWyzc9i5g82n3qhMTkBpn`)
> 기준으로 실측했다. 약사웹 전용 마스터 가이드에 별도 Paint Style 체계가 있다면 그쪽이 더
> 우선하지만, 어느 Figma 소스든 **"하드코딩된 프로토타입 CSS 값" vs "Figma 값"이 어긋나면
> Figma 값이 이긴다** — 이번 작업의 목적 자체가 우연히 박힌 코드값이 아니라 디자인 시스템 의도를
> 코드에 반영하는 것이기 때문. 같은 디자인 시스템을 공유하는 제품 간에는 이 문서의 값을 그대로
> 재사용해도 된다는 판단(2026-07-09 확인)에 따라 작성됨.

## 1. 프로젝트 구조 (코드)

```
pharmaweb-prototype/
├── server.js               # 정적 파일 서빙용 Node http 서버 (포트 8765)
├── customer_list.html      # 단골고객 목록 페이지
├── customer_info.html      # 고객 상세 페이지
└── prescription_list.html  # 처방전 목록 페이지
```

- 프레임워크 없음, 빌드 시스템 없음(`package.json` 없음). Vanilla HTML + 인라인 `<script>`.
- 각 HTML 파일이 자체 `<style>` 블록을 가짐 — 공유 스타일시트 없음.
- 데이터는 각 파일 하단 `<script>`의 JS 배열에 하드코딩된 mock data.

## 2. Figma 디자인 토큰 (실측값)

Figma "Style Guide" 캔버스(`Color Guide`, `Typography`) + "Components" 캔버스에서 직접 조회한
값. 컴포넌트 코드에는 `var(--color/xxx, #hex)` 형태로 시맨틱 변수명이 이미 붙어 있음 — 이 변수명을
코드에 그대로 CSS 커스텀 프로퍼티로 도입하는 것을 권장.

### 컬러 — Color Guide 토큰

| 토큰명 (Figma 변수) | 값 | 용도 |
|---|---|---|
| `--color/primary` (`--color/blue/300`) | `#3E71F0` | **Primary 브랜드 블루** — 버튼 solid, outlined 텍스트/보더, LNB active, 토글 on |
| `--color/white` | `#FFFFFF` | 버튼/카드 배경, 텍스트 |
| `--color/grey/900` | `#212529` | |
| `--color/grey/800` | `#333D48` | 다크 버튼 배경, ghost/outlined-secondary 텍스트, 헤딩 텍스트 |
| `--color/grey/700` | `#252525` | |
| `--color/grey/600` | `#666666` | 본문 서브 텍스트 |
| `--color/grey/550` | `#7888AC` | solid-grey 버튼 배경 |
| `--color/grey/500` | `#8B95A1` | |
| `--color/grey/400` | `#A9ADB9` | 보더, placeholder 텍스트, toggle off 트랙 |
| `--color/grey/300` | `#D9D9D9` | Select/Search 기본 보더 |
| `--color/grey/250` | `#D1D7E0` | 테이블 보더, outlined-secondary 버튼 보더 |
| `--color/grey/200` | `#EBEBEB` | |
| `--color/grey/150` | `#EEF0F3` | 테이블 배경 |
| `--color/grey/100` | `#F6F6F6` | 새로고침 버튼 hover 배경 |
| `--color/blue/200` | `#E3EBFF` | solid-secondary 버튼 배경, Tag_Medium 배경 |
| `--color/blue/100` | `#ECF1FF` | Pagination 활성 배경 |
| `--color/red` | `#EE4951` | 에러 메시지, danger, Tag_담당역할(대표의사) |
| `--color/wellda/purple` | `#6053F3` | 질환 태그 |
| `--color/wellda/yellow` | `#FFAE35` | 질환 태그 |
| `--color/wellda/orange` | `#FF7B1C` | 질환 태그 |
| `--color/wellda/red_welda` | `#F0510D` | 질환 태그 |

**⚠ Color Guide 밖에서 쓰이는 추가 그레이 (LNB/GNB 전용, 토큰화 안 됨)**
LNB/GNB 컴포넌트는 Color Guide에 없는 자체 그레이를 씀: `#F5F6F9`(LNB 배경), `#D7D7D7`(LNB
보더), `#191F28`(GNB 1depth 텍스트), `#4A505A`(GNB 1depth Regular 텍스트), `#555`(GNB 서브메뉴
텍스트), `#BDBDBD`(검색창 보더), `#CBCDD2`(하단 버튼 보더). Figma 디자인 시스템 자체에 존재하는
불일치이므로, 코드에 토큰화할 때 그대로 새 변수로 추가하거나 Figma팀에 통일 여부 확인 필요.

**⚠ 코드와 불일치하는 부분 (우선 수정 대상)**
- 코드의 primary blue는 대부분 `#2563EB`(customer_list/info/prescription_list 전체에서
  70회+ 사용)인데, Figma 실제 primary는 `#3E71F0`. `#3E71F0`은 `customer_info.html`에만 3번
  등장 — 즉 원래 의도된 색이 코드 작성 중 다른 블루로 대체된 것으로 보임.
- 초록(success) 계열이 코드에서 `#15C784`/`#10B981`/`#20C4A0`/`#059669`/`#16A34A` 5가지로
  흩어져 있는데, Figma Color Guide에는 success 그린 토큰이 없음. 대신 실제 "전송가능" 태그
  컴포넌트는 `#EEFAF0`(bg) / `#CFF4CE`(border) / `#33AF2E`(text) 조합을 씀 — 코드의 5가지 초록
  중 정답에 가장 가까운 건 없음. Figma의 `#33AF2E`로 통일 권장.

### 타이포그래피

기본 폰트는 **Noto Sans KR** (`--font/family/base`), 영문 전용은 Poppins(`Body1_English`,
캘린더 날짜 숫자).

| 스타일명 | 폰트/weight | size | line-height | letter-spacing |
|---|---|---|---|---|
| H1 | Medium (500) | 30px | 100% | -1.2px |
| H2 | DemiLight (350) | 24px | 100% | -0.96px |
| H3 | Medium (500) | 18px | 100% | -0.72px |
| Body1 | Regular (400) | 15px | 100% | -0.6px |
| Body1_bold | Medium (500) | 15px | 100% | -0.6px |
| Body1_Reading | Regular (400) | 15px | 25px | -0.6px |
| Body1_English | Poppins Regular | 15px | 100% | -0.6px |
| Caption 1 | Medium (500) | 13px | 100% | -0.26px |
| Caption 2 | DemiLight (350) | 13px | 100% | 0 |
| Caption 3 | Regular (400) | 12px | 120% | -0.48px |
| Caption 3_reading | Regular (400) | 12px | 25px | -0.48px |
| B2/500 Regular (GNB 전용) | Regular (400) | 14px | 100% | -0.28px |

버튼 텍스트는 `--font/size/base`(15px) Medium, Select/Search placeholder·에러 텍스트는
`--font/size/xs`(12px) Medium/Regular. Popup 타이틀은 H3(18px), 본문은 Body1_Reading.

**⚠ 코드와 불일치**: 코드는 `font-size`가 8px~20px 사이 20가지 이상 값으로 파편화되어 있어 위
스케일과 거의 매핑되지 않음. 토큰 도입 시 이 파편화된 값들을 위 스케일로 재정렬 필요.

## 3. 컴포넌트 (Figma "Components" / "Style Guide" 캔버스 실측)

### Button
공통: `border-radius: 8px`, `padding: 0 20px`, `height: 40px`(기본), 텍스트 15px Medium.

| Variant | 배경 | 보더 | 텍스트 |
|---|---|---|---|
| `solid` (primary) | `--color/primary` #3E71F0 | 없음 | white |
| `solid-secondary` | `--color/blue/200` #E3EBFF | 없음 | `--color/primary` |
| `solid-dark` | `--color/grey/800` #333D48 | 없음 | white |
| `solid-grey` | #7888AC | 없음 | white |
| `outlined` | white | `--color/primary` | `--color/primary` |
| `outlined-secondary` | white | `--color/grey/250` #D1D7E0 | `--color/grey/800` |
| `ghost` | transparent | 없음 | `--color/grey/800` |

사이즈 variant 28/40/45/54px 높이, Disabled·Loading·Icon 전용 variant 별도.

**btn_새로고침(Refresh)**: 기본 상태는 투명 배경 + `--color/grey/600` 텍스트, hover 시
`--color/grey/100` 배경. `width:100px, height:40px, gap:5px`, 아이콘 14px.

### Select
- 보더 `--color/grey/300` #D9D9D9, `border-radius: 5px`.
- 높이 variant: XS 20px / S 30px / M 40px / L 40px / XL 54px, 62px(에러 메시지 포함 시).
- placeholder 텍스트 `--color/grey/400`, 에러 텍스트 `--color/red`, 텍스트 크기 12px Medium.
- width variant: 80/120/140/160/250px.

### Search
- 기본(Default): `width:320px, height:40px`, 보더 `--color/grey/300`, `border-radius:5px`,
  placeholder `--color/grey/400`, 우측 돋보기 아이콘 16px.
- Variant2/3(맵뷰용): 검색창 + 우측에 별도 "지도보기" 버튼(`bg-white`, `border --color/grey/300`)
  가 붙는 구조. Variant3은 입력값 삭제(X) 버튼 포함, 텍스트 `--color/grey/800`.

### Checkbox / Radio
- 18px 정사각 아이콘 기반 (커스텀 SVG 애셋, on/off/gray/disabled 상태별 이미지 교체 방식 —
  CSS로 그리지 않음). `check_18size`, `18_abled_radio` 등 사이즈 variant(S/M/L) 존재.

### Toggle
- `28x16px`, `border-radius: 100px` (pill), 트랙 2px 보더.
- off: 트랙/보더 `--color/grey/400`. on: 트랙/보더 `--color/primary`. disabled: `opacity: 0.5`.

### Calendar
- 카드형: `width:280px, height:295px`, 배경 white, 보더 `--color/grey/300`,
  `border-radius:8px`, `box-shadow: -1px 3px 5px rgba(0,0,0,.05)`.
- 연/월 타이틀 Noto Sans KR Bold 15px `--color/grey/800`. 날짜 숫자는 Poppins SemiBold 11px.
- 일/토요일은 `--color/red`, 평일은 `--color/grey/800`. 오늘 날짜는 원형 blue 배경 + white 텍스트.
- 1주(week)/1개월(month) variant 별도 존재.

### Pagination (number)
- 페이지 버튼 26x26px, `border-radius:8px`, 폰트 Poppins SemiBold 13px.
- 비활성: 텍스트만 `--color/grey/800`. **활성(current page)**: 배경 `--color/blue/200`,
  텍스트 `--color/blue/300`(primary). 이전/다음(◀▶) 화살표는 `--color/blue/100` 배경.

### Tag — 여러 그룹 존재, 그룹별 색상 규칙이 다름

- **위험군 (tag_위험군)**: pill(`radius:999px`), 흰 텍스트 12px Medium.
  - 고(高): 배경 `#E5405E` — "고위험군"
  - 중(中): 배경 `#F5AC1F` — "중위험군"
  - 저(低): 배경 `#2BB5B0` — "저위험군"
- **질환 태그 — Heavy (Tag_Heavy, dot+텍스트, 알약색 배경)**: `padding:10px, radius:999px`,
  텍스트 12px Medium.
  - 당뇨: 배경 `#E6D7FA`, dot+텍스트 `#9747FF`
  - 고혈압(전): 배경 `#FDEDD5`, dot+텍스트 `#F68500`
- **질환 태그 — Light (Tag_Light, dot+텍스트, 배경 없음)**: 동일 컬러 팔레트를 dot으로만 표시
  (예: 당뇨(전) `#9747FF`).
- **질환 태그 — Medium (Tag_Medium, "진행" 등 상태)**: 배경 `--color/blue/200`,
  텍스트 `--color/blue/300`(primary), pill.
- **전송상태 태그 (tag_전송상태)**: 각 상태별 배경/보더/텍스트 3색 조합, pill.
  - 관리 필요: 배경 `#FFFAE9`, 보더 `#FFD5A4`, 텍스트 `#FF8A00`
  - 전송가능: 배경 `#EEFAF0`, 보더 `#CFF4CE`, 텍스트 `#33AF2E`
- **담당 역할 태그 (Tag_담당 역할)**: `height:24px`, pill, Caption1(13px Medium).
  - 대표 의사: 배경 `#FFF4F5`, 텍스트 `--color/red`
  - (직원/의사/케어코디네이터 등 variant 별도 색상 존재, 미조회)

### Popup
- 카드: `border-radius:10px`, 흰 배경, 보더 `--color/grey/300`,
  `drop-shadow: 0 4px 7.5px rgba(0,0,0,.1)`, 상하 패딩 `40px/35px`.
- 제목: H3(18px Medium) `--color/grey/800`. 본문: Body1_Reading(15px/25px) `--color/grey/600`.
- 버튼 영역: 취소류(`bg-white, border --color/grey/300, text --color/grey/600`) +
  확인류(`bg --color/primary, text white`) 조합, `height:40px, radius:8px, padding:0 60px`.
- 알림형(Variant5/6)은 `bg --color/grey/100`의 리스트 박스 안에 안내 문구를 넣는 구조.

### LNB / GNB (좌측 내비게이션)
- LNB 전체: 배경 `#F5F6F9`, 우측 보더 `#D7D7D7`, `width:200px`, 상단 padding 40px.
- 로고 위에 검색창(`bg white, border #BDBDBD, radius:6px, shadow: 0 2px 10px #E8E9EA`).
- GNB 1depth 메뉴 항목: `height:33px`, 텍스트 16px Medium `#191F28`(비활성) /
  15px Regular `#4A505A`(변형).
- **hover/active 상태**: 메뉴 배경이 `--color/primary`(#3E71F0)로 바뀌고 텍스트 white로 변함
  (코드의 `.lnb-item.active`와 동일 패턴이지만 색이 `#2563EB`로 되어있어 불일치).
- 하위(2depth) 메뉴: `padding-left:40px`, 텍스트 14px Regular `#555`. 강조 항목(예: "만성질환
  통합 체계")은 `--color/primary` 텍스트.
- 하단 사용자 카드: 구분선 `#C9C9C9`, 이름 16px Bold + "의사" 14px Regular, 버튼
  (`내 정보`/`로그아웃`)은 `bg white, border #CBCDD2, radius:4px, height:35px`, 텍스트 14px
  Medium `#333D48`. → 코드의 `.lnb-btn-sm`과 구조는 같으나 보더색(`#E0E0E0` vs `#CBCDD2`) 다름.

## 4. 아이콘

- 코드에는 별도 아이콘 파일 없이 인라인 `<svg>` 직접 작성.
- Figma "Style Guide"에는 `ic_lnb*` 접두사의 LNB 아이콘 세트(on/off 상태별 variant)와
  `icon_진행중`/`icon_미진행` 등 별도 아이콘 컴포넌트가 정리되어 있음.
- Figma에서 아이콘을 가져올 때는 `download_assets`로 받아 인라인 SVG로 교체.

## 5. 스타일링 방식 (코드)

- 순수 CSS, 페이지별 `<style>` 블록. CSS 변수·글로벌 스타일시트 없음.
- 반응형 처리 없음, LNB 고정 200px + `margin-left:200px` 레이아웃 (Figma LNB도 동일하게 200px
  고정 — 이 부분은 코드와 일치).

## 6. Figma MCP 작업 시 주의사항

- `get_design_context`/`get_variable_defs`는 **개별 리프 노드**(구체적인 컴포넌트/스와치/심볼)에는
  잘 동작하지만, `canvas`나 매우 큰 프레임 노드에는 "nothing selected" 오류가 남 — 먼저
  `get_metadata`로 구조를 파악한 뒤 원하는 리프 노드 ID를 찾아 `get_design_context`를 호출할 것.
- `get_metadata` 결과가 크면(수만~십만 자) 파일로 저장되는데, JSON 안의 텍스트가 `\n`으로
  escape되어 있어 grep이 한 줄로만 매칭됨 — Node로 JSON을 파싱해 실제 줄바꿈으로 풀어낸 뒤 grep할 것.
- 코드에 CSS 변수를 도입할 때는 Figma의 변수명 규칙(`--color/primary`, `--color/grey/800`,
  `--font/size/base`)을 그대로 따르는 것을 권장 — 이미 Figma 컴포넌트 코드가 이 이름으로 되어
  있으므로 향후 Code Connect 매핑이 쉬워짐.
- 3개 HTML 파일에 중복된 CSS(LNB, 헤더, 버튼 등)를 각각 고치지 말고, 토큰 도입 시점에 공용
  `styles.css`로 추출하는 것을 함께 진행할 것.
- 이 저장소는 GitHub(`m2choo/pharmaweb-prototype`)와 연결되어 있고 현재 clean 상태.
