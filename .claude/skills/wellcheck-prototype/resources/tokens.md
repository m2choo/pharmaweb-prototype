# 웰체크 약사웹 프로토타입 — 디자인 토큰 (내장 스냅샷)

> **최종 갱신**: 2026-07-09 · **조회 출처**: Figma 파일 `YRWyzc9i5g82n3qhMTkBpn`("의사 Web")
> "Style Guide" + "Components" 캔버스
>
> 이 파일은 `figma-token-reference` Skill로 재조회해서 **이 파일 하나만** 교체하면 갱신된다.
> Skill 본문(SKILL.md)은 안 바뀌어도 된다.

## 컬러 토큰

| 토큰명 (Figma 변수) | 값 | 용도 |
|---|---|---|
| `--color-primary` | `#3E71F0` | 버튼 solid, outlined 텍스트/보더, LNB active, 토글 on |
| `--color-white` | `#FFFFFF` | 버튼/카드 배경, 텍스트 |
| `--color-grey-900` | `#212529` | |
| `--color-grey-800` | `#333D48` | 다크 버튼 배경, ghost/outlined-secondary 텍스트, 헤딩 |
| `--color-grey-700` | `#252525` | |
| `--color-grey-600` | `#666666` | 본문 서브 텍스트 |
| `--color-grey-550` | `#7888AC` | solid-grey 버튼 배경 |
| `--color-grey-500` | `#8B95A1` | |
| `--color-grey-400` | `#A9ADB9` | 보더, placeholder, toggle off 트랙 |
| `--color-grey-300` | `#D9D9D9` | Select/Search 기본 보더 |
| `--color-grey-250` | `#D1D7E0` | 테이블 보더, outlined-secondary 버튼 보더 |
| `--color-grey-200` | `#EBEBEB` | |
| `--color-grey-150` | `#EEF0F3` | 테이블 배경 |
| `--color-grey-100` | `#F6F6F6` | 새로고침 버튼 hover 배경 |
| `--color-blue-200` | `#E3EBFF` | solid-secondary 버튼 배경, Tag_Medium 배경 |
| `--color-blue-100` | `#ECF1FF` | Pagination 활성 배경 |
| `--color-red` | `#EE4951` | 에러 메시지, danger, Tag_담당역할(대표의사) |
| `--color-wellda-purple` | `#6053F3` | 질환 태그 |
| `--color-wellda-yellow` | `#FFAE35` | 질환 태그 |
| `--color-wellda-orange` | `#FF7B1C` | 질환 태그 |
| `--color-wellda-red` | `#F0510D` | 질환 태그 |
| `--color-success` | `#33AF2E` | "전송가능" 태그 텍스트 (배경 `#EEFAF0`, 보더 `#CFF4CE`) |
| `--color-warning` | `#FF8A00` | "관리 필요" 태그 텍스트 (배경 `#FFFAE9`, 보더 `#FFD5A4`) |

**LNB/GNB 전용 (Color Guide 밖, 그대로 사용)**: 배경 `#F5F6F9`, 보더 `#D7D7D7`, 1depth 텍스트
`#191F28`(16px Medium)/`#4A505A`(15px Regular), 서브메뉴 텍스트 `#555`, 검색창 보더 `#BDBDBD`,
하단 버튼 보더 `#CBCDD2`.

**출처 판단 기준**: 새로 짜는 코드의 하드코딩값과 이 표가 어긋나면 항상 이 표가 이긴다.

## 타이포그래피

기본 폰트 **Noto Sans KR**, 영문/숫자 전용은 **Poppins**.

| 스타일명 | weight | size | line-height | letter-spacing | 용도 |
|---|---|---|---|---|---|
| H1 | Medium 500 | 30px | 100% | -1.2px | |
| H2 | DemiLight 350 | 24px | 100% | -0.96px | |
| H3 | Medium 500 | 18px | 100% | -0.72px | Popup 제목 |
| Body1 | Regular 400 | 15px | 100% | -0.6px | |
| Body1_bold | Medium 500 | 15px | 100% | -0.6px | 버튼 텍스트 |
| Body1_Reading | Regular 400 | 15px | 25px | -0.6px | Popup 본문, 문단 |
| Caption 1 | Medium 500 | 13px | 100% | -0.26px | 담당역할 태그 |
| Caption 2 | DemiLight 350 | 13px | 100% | 0 | |
| Caption 3 | Regular 400 | 12px | 120% | -0.48px | Select/태그 텍스트 |
| B2 (GNB 전용) | Regular 400 | 14px | 100% | -0.28px | GNB 서브메뉴 |

## 컴포넌트 스펙

### Button
공통: `border-radius:8px`, `padding:0 20px`, `height:40px`(기본), 텍스트 15px Medium.

| Variant | 배경 | 보더 | 텍스트 |
|---|---|---|---|
| solid (primary) | `--color-primary` | 없음 | white |
| solid-secondary | `--color-blue-200` | 없음 | `--color-primary` |
| solid-dark | `--color-grey-800` | 없음 | white |
| solid-grey | `#7888AC` | 없음 | white |
| outlined | white | `--color-primary` | `--color-primary` |
| outlined-secondary | white | `--color-grey-250` | `--color-grey-800` |
| ghost | transparent | 없음 | `--color-grey-800` |

새로고침 버튼: 기본 투명+`--color-grey-600` 텍스트, hover `--color-grey-100` 배경,
`width:100px height:40px gap:5px`.

### Select / Search
- 보더 `--color-grey-300`, `border-radius:5px`.
- Select 높이: XS 20 / S 30 / M,L 40 / XL 54px (에러 텍스트 포함 시 62px).
- placeholder `--color-grey-400`, 에러 텍스트 `--color-red`, 텍스트 12px Medium.
- Search 기본: `width:320px height:40px`, 우측 돋보기 아이콘 16px.

### Checkbox / Radio / Toggle
- Checkbox/Radio: 18px 정사각 아이콘 기반(이미지 교체 방식, on/off/gray/disabled).
- Toggle: `28x16px`, `border-radius:100px`, off 트랙 `--color-grey-400`, on 트랙
  `--color-primary`, disabled `opacity:0.5`.
- **동의/약관 체크박스 + 안내 텍스트**: 체크 아이콘 14px, 텍스트 15px Regular
  `--color-grey-500`(#8B95A1), `line-height:25px`. 체크박스는 `padding-top:5px`로 텍스트
  첫 줄과 정렬. 배경 박스 없이 체크박스+텍스트만 나란히 배치.

### Tag (그룹별로 색 규칙이 다름)
- **위험군**: pill, 흰 텍스트. 고 `#E5405E` / 중 `#F5AC1F` / 저 `#2BB5B0`.
- **질환 태그(Heavy)**: dot+텍스트, pill 배경. 당뇨 `bg #E6D7FA / text #9747FF`,
  고혈압(전) `bg #FDEDD5 / text #F68500`.
- **상태 태그(Medium)**: `bg --color-blue-200 / text --color-primary`.
- **전송상태**: 관리 필요 `bg #FFFAE9 / border #FFD5A4 / text #FF8A00`,
  전송가능 `bg #EEFAF0 / border #CFF4CE / text #33AF2E`.
- **담당역할**: 대표 의사 `bg #FFF4F5 / text --color-red`, `height:24px`, Caption1.

### Pagination
페이지 버튼 26x26px, `border-radius:8px`, Poppins SemiBold 13px. 활성 페이지:
`bg --color-blue-200 / text --color-primary`. 이전/다음 화살표 `bg --color-blue-100`.

### Popup
카드 `border-radius:10px`, 흰 배경, 보더 `--color-grey-300`,
`drop-shadow: 0 4px 7.5px rgba(0,0,0,.1)`, 상하 패딩 `40px/35px`. 제목 H3, 본문
Body1_Reading `--color-grey-600`. 버튼: 취소(`bg white / border --color-grey-300 / text
--color-grey-600`) + 확인(`bg --color-primary / text white`), `height:40px radius:8px
padding:0 60px`.

### 스텝형 모달 (모달 내 진행 단계 탭)

> 출처: 마스터 가이드 파일(`Hg2fE9R6yId239HK6vTau8`) node `22340:34320`, `22340:34399`,
> `22340:34753`, `22340:34826`, `24082:37283`, `19386:35075`.

**모달 크기 — 고정 높이 아님**
- 모달 높이는 화면(스텝)마다 달라진다(내용에 맞춰 늘고 줆) — `86vh` 같은 고정값 + 내부
  스크롤 방식이 아니다. `min-height:723px`(내용이 적을 때 너무 작아지지 않게, node
  `22340:34320` 기준) + `max-height`(내용이 넘칠 때만 안전장치로 스크롤) 조합으로
  구현한다.
- 고객 정보 행에는 배경색을 넣지 않는다(흰 배경 그대로) — 파란 배경 등 강조색 금지.

**하단 버튼 영역 — 구분선 없음, 가운데 정렬**
- 하단 버튼은 별도 보더로 구분된 푸터 바가 아니라, 카드 안에서 콘텐츠와 `gap:30px`만
  두고 이어진다 — `border-top` 넣지 않는다.
- 버튼 그룹 자체는 모달 폭 전체 기준 **가운데 정렬**(`justify-content:center`)이다.
  좌측에 "Step 2/4" 같은 진행 라벨을 넣지 않는다(Figma에 그런 요소 없음).
- 처방전 확인(1번째) 화면 하단 버튼은 "처방전 없이 상담" + "다음" 두 개만 둔다 — "취소"는
  빼고 닫기는 우상단 ✕ 아이콘으로만 처리한다.

**모달이 늘어날 때 — 내용 영역 안에서 스크롤, 얇은 스크롤바**
- 모달 카드는 `min-height`(짧은 화면에서 너무 작아지지 않게) + `max-height:90vh`(그 이상은
  캡) 둘 다 건다. 캡을 넘으면 `modal-body`(내용 영역)만 `overflow-y:auto`로 스크롤 —
  모달 전체나 배경이 스크롤되는 게 아니라 내용 영역 안에서만 스크롤된다.
- flex 자식에 `overflow-y:auto`를 걸 땐 `min-height:0`을 같이 줘야 실제로 스크롤이
  동작한다(플렉스 기본값이 내용 크기만큼 안 줄어들어서 스크롤이 안 걸리는 흔한 버그).
- 스크롤바는 실제 라이브 웹처럼 폭에 영향 안 주는 얇은 형태로: `::-webkit-scrollbar
  {width:3px}` + `--color-grey-300` thumb(`border-radius:2px`), 트랙은 투명.

**패널 폭 — "Hug"라도 실측값을 그대로 쓴다**
- Figma에서 리사이징 모드가 "Hug"(내용에 맞춰 자동)로 되어 있어도, 실제 그 화면에서
  나온 결과값(px)을 그대로 갖다 쓴다 — "자동이니까 아무 값이나" 식으로 짐작하지 않는다.
  예: "자주 사용하는 태그" 패널은 하그여도 실측 250px.

**모달 상단 타이틀 바**
- 제목: Noto Sans KR DemiLight(350) 24px `--color-grey-900`, `padding:10px 0 15px`(위 10 /
  아래 15, 비대칭).
- 닫기 아이콘: 18×18px.
- 보더: 타이틀 바 하단에만 `--color-grey-300` 구분선.

**고객 정보 행 (아바타·이름)**
- 아바타: 40×40px 원형, 배경 `#EEF0F3`(grey-150). 이니셜 텍스트 18px Medium
  `--color-grey-500`, 가운데 정렬.
- 이름: 18px Medium `--color-grey-700`(#252525) — grey-900 아님.
- 생년월일·나이·성별·연락처 라인: 13px Medium `--color-grey-600`(#666) — 15px Regular
  아님.
- 이 행에는 보더 없음(위 "진행 단계 탭" 항목 참고 — 탭 줄과 `gap:16px`로만 구분).

**진행 단계 탭**
- 한 줄에 `flex:1`로 균등 분할, `padding:10px 20px`, 아이콘-텍스트 `gap:5px`.
- 번호 배지: 20×20px 원형, 항상 채움(아웃라인 아님). 활성 = 배경 `--color-primary` + 흰
  숫자(12px Medium). 비활성 = 배경 `--color-grey-200`(#EBEBEB) + `--color-grey-500`
  (#8B95A1) 숫자(12px Medium).
- 라벨: 활성 = Noto Sans KR Bold 15px `--color-primary`. 비활성 = Noto Sans KR Medium
  15px `#414B5E`.
- 밑줄: 활성 탭에만 `border-bottom:2px solid --color-primary`. 탭 줄 전체 하단에
  `--color-grey-300` 구분선 — 이 구분선은 탭 줄 바로 위(고객 정보 행)에는 없고 탭 줄
  아래에만 한 번 있다.
- 고객 정보 행(아바타·이름)과 탭 줄은 같은 묶음 안에서 `gap:16px`로 붙는다 — 고객 정보
  행 자체에는 보더를 넣지 않는다.

**대체조제 여부 확인 배너**
- 배경 `rgba(238,73,81,.1)`, 보더 없음, `border-radius:8px`, `padding:12px 20px 16px`.
- 아이콘(alert-circle, 빨강, 14×30px) + 타이틀 15px Medium `--color-red` + 서브텍스트 12px
  Regular `--color-red`.
- 라디오 "네/아니오": 커스텀 라디오 아이콘 14px + 텍스트 15px Regular `--color-grey-600`.

**진행 단계 탭 아래 콘텐츠 영역과의 간격**
- 탭 줄이 끝나는 지점과 그 아래 콘텐츠(처방전 원본·조제 내역 패널 등) 사이 `gap:20px`.

**패널 타이틀 공통 규칙** (처방전 원본 / 조제 내역 / 자주 사용하는 태그 / 메시지 편집 /
카카오 알림톡 미리보기 / 전송 요약 등 각 패널의 소제목)
- 18px Medium `--color-grey-700`(#252525) — grey-900 아님.
- 조제 내역 패널 타이틀 오른쪽에 안내문 "대체 조제 시 직접 수정하세요" 12px
  `--color-primary`가 같은 줄에 우측 정렬로 붙는다.

**구조 — Figma 레퍼런스에 없는 의도된 추가 기능**
- Figma 레퍼런스는 3단계(처방전 확인 → 복약 상담 메시지 → 메시지 전송)이지만, 이 프로토타입은
  2번째에 "복약 알림"(복약 시간/횟수 설정) 스텝을 추가해 4단계로 구성했다.
- 우측 "Puzzle AI 어시스턴트" 패널(녹음·요약)도 Figma 레퍼런스에는 없는 이 프로토타입만의
  기능이다.
- 둘 다 의도된 기능 확장이며 Figma에 맞춰 제거/축소할 대상이 아니다.

**구조 — 처방전 확인 화면의 좌측 패널은 의도적으로 미사용**
- 마스터 가이드는 좌측 "처방전 원본" 패널(이미지 상시 노출)과 우측 "조제 내역" 표를
  나란히 배치한 2열 구조지만, 이 프로토타입은 좌측에 이미지를 상시 노출하면 조제 내역
  표 폭이 너무 좁아진다고 판단해 "처방전 원본 이미지 보기" 버튼으로 별도 팝업(이미지
  뷰어 레이어)에서 열람하는 방식을 택했다. 이 차이는 의도된 것이며 맞출 대상이 아니다.

**메시지 편집 영역 부속 요소**
- "초기화" 컨트롤: 텍스트 15px Regular `--color-grey-600` + 아이콘 14px, `gap:5px`.
- 글자 수 카운터: **두 톤** — 현재 글자 수는 `--color-primary`, "/ 500자"는
  `--color-grey-500`(#8B95A1), 둘 다 12px, `gap:4px`. 단색 아님.

**메시지 태그 리스트** ("자주 사용하는 태그")
- pill 칩이 아니라 세로로 쌓인 풀와이드 리스트 버튼, 각 `height:45px`, `border-radius:8px`,
  `padding:0 15px`, 세로 `gap:6px`.
- 선택됨: 보더 `--color-primary`, 텍스트 `--color-primary`, `opacity:.8`.
- 선택 안 됨: `bg white`, 보더 `--color-grey-300`, 텍스트 `--color-grey-600`.
- 메시지 편집 textarea: `border:1px solid --color-primary`, `border-radius:8px`,
  `padding:16px`, 텍스트 15px `--color-grey-600`.

**모달 내 테이블 규격**

조제 내역 표 (`.s2-drug-table`)
- 컬럼 3개: NO(25px, 가운데) / 약명(229px, 좌측) / 복용일(70px, 가운데). 대체조제 여부는
  컬럼이 아니라 위 배너로 표시.
- 헤더: `bg #EEF0F3`, `border-top:1px solid --color-grey-250`, `height:34px`, 텍스트
  Noto Sans KR Regular 12px `#5F6E7D`.
- 행: `height:54px`, `padding:0 10px`, 좌측 그룹 `gap:30px`.
  - NO: Poppins Regular 15px `--color-grey-400`.
  - 약명: 상단 15px Regular `--color-grey-800` + 하단(용법) 13px Medium `--color-grey-600`.
  - 복용일: 15px Regular `--color-grey-800`.
  - 우측: 편집·삭제 아이콘 각 24×24px.

약품 편집/추가 폼 (조제 내역 표의 행을 펼쳤을 때)
- 개별 "약품명"/"성분명" 텍스트 필드가 아니라 **검색창 하나**("약품 검색" 라벨 11px Medium
  `--color-grey-550`(#7888AC) + 인풋 + 우측 지우기(X) 아이콘).
- 용량/횟수/일수는 각각 라벨(11px Medium grey-550) + 작은 숫자 입력(66×28px, 보더
  `#CBCDD0`, Poppins 15px) + 단위 텍스트(15px grey-800, 예: "1회 [ ] 정", "하루 [ ] 회",
  "[ ] 일")로 가로 배치.
- 대체조제 여부는 이 폼에 없다(표 위 배너가 처방 단위로 대신함).
- 버튼: 취소(`button/outlined`, primary 보더+텍스트) + 저장(`button/solid`), 둘 다
  `height:34px width:80px border-radius:6px font-size:13px` — 모달 하단 내비 버튼(40px)
  보다 작은 사이즈.
- 폼을 펼치면 그 안에서 모달 자체의 높이가 늘어난다(내부 스크롤 아님) — 위 "모달 크기"
  항목과 같은 원칙.

검색 드롭다운 (고객 검색 등)
- 카드: `border-radius:5px`(팝업의 10px보다 작음), 보더 `--color-grey-300`, 그림자
  `0 4px 7.5px rgba(0,0,0,.1)`.
- 매칭 있을 때 상단에 "검색 결과 N건" 헤더 행(`height:30px`, 보더 하단 grey-200, 라벨
  12px medium grey-600 + 건수 12px medium primary, 좌우 끝 정렬).
- 결과 행: 아바타 40px(배경 `#EEF0F3`) + 이름 15px medium grey-700 + 전화번호 12px
  regular grey-800(다른 보조텍스트처럼 grey-500 아님) + 우측 상태 태그(pill, bg blue-100/
  border blue-200/text primary, height 28px).
- 결과 없음/입력 전 상태: 가운데 정렬, 아이콘 원(40px, bg grey-150) + 안내문(15px
  grey-800) + 보조문(13px DemiLight grey-500).

전송 요약 표 (`.sum-tbl`)
- 라벨 셀: `bg --color-grey-100`, 가운데 정렬, `width:100px`, 텍스트 15px `--color-grey-600`.
- 값 셀: 텍스트 15px `#252525`.
- 행 `height:52px`, 보더 `--color-grey-250` — **아래쪽과 왼쪽 둘 다**(`border-bottom` +
  `border-left`), 아래쪽만 아님.

카카오 알림톡 미리보기
- 타임스탬프(예: "09:00"): 10px Medium `--color-grey-400`, 말풍선과 `gap:7px`.
- 말풍선: 배경 `#FFE790`, `border-radius:16px`(우상단만 각짐), `padding:15px 12px`, 텍스트
  Noto Sans KR DemiLight 15px `#252525`, `line-height:21px`.

**모달 하단 내비게이션 버튼 색 구분**
- 이 모달의 "이전"(스텝 뒤로가기) 버튼은 텍스트 색이 `--color-grey-800`(#333D48)이다 —
  Popup 섹션의 일반 "취소" 버튼(`--color-grey-600`)과 다른 색이니 혼동하지 않는다.
- "전송하기"(마지막 스텝의 발송 버튼)는 텍스트만 있는 게 아니라 종이비행기 아이콘(16px)이
  좌측에 붙고 `gap:4px`, `padding:4px 10px` — 아이콘 없는 일반 `button/solid`과 padding이
  다르다.

### LNB (좌측 내비게이션, 고정 200px)
배경 `#F5F6F9`, 우측 보더 `#D7D7D7`. GNB 1depth `height:33px`, hover/active 시 배경
`--color-primary` + 텍스트 white로 전환. 하위 메뉴 `padding-left:40px`, 텍스트 14px `#555`.
하단 사용자 카드 버튼: `bg white / border #CBCDD2 / radius:4px / height:35px`.

## 아이콘

별도 아이콘 파일 없이 인라인 `<svg>` 직접 작성하는 방식(기존 코드와 동일하게 유지). LNB
아이콘은 `viewBox="0 0 16 16"` 16px 그리드 관례를 따른다.
