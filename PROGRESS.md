# Wellcheck 다제약물관리사업 프로토타입 — 작업 현황

> 파일: `wellcheck_polypharmacy_prototype_preview.html`  
> 프리뷰: `npx serve -l 3456 .` → http://localhost:3456  
> 마지막 업데이트: 2026-06-05 (바로 가기 버튼 개선, 아이프레임 구조 분석 — 다음 개선 방향 논의 중)

---

## ⚠️ v2 시리즈 (customer_list_v2.html 등) — 별도 작업 흐름, 2026-07-06 최신

> GitHub Pages 배포: https://m2choo.github.io/pharmaweb-prototype/  
> 이 섹션은 위의 Wellcheck 다제약물관리사업 문서와 **별개 작업**. 배포는 `master` 브랜치 push 시 GitHub Actions(`pages-build-deployment`)가 자동 빌드.

### 대상 파일 (모두 "AI 복약 상담" 3단계 모달 포함)
- `customer_list_v2.html` — 고객 목록 (KIMCHECK = 단골 시드 데이터, 나머지는 신규/비단골)
- `prescription_list_v2.html` — 처방전 목록
- `customer_info_v2.html` — 고객 상세
- `cl_note_v2.html` — CL note 목록 (localStorage `wcCLNotes` 키로 데이터 저장)

### 공통 구조 (4개 파일 동일 패턴 유지 — 한 곳 수정 시 나머지 3곳도 동일하게)
- AI 상담 모달: `renderStep1()` → 고객 검색/선택 → `renderStep2()`(복약지도문) → `renderStep3()`(전송 확인)
- 고객 검색: `onSearch(val)` — input의 `oninput`, 드롭다운(`#s1dropdown`) 렌더링
- 고객 선택: `selectCustomer()`(기존 단골 KIMCHECK 선택) / `addNewCustomerByName(name)`(직접 입력 신규 고객)
- 검색창 숨김 공통 함수: `hideSearchSection()` — `#s1searchWrap`, `#s1guide`, `#s1error` 모두 display:none

### 최근 완료 작업 (커밋 순, 최신이 아래)
1. **드롭다운 안 닫히는 버그 수정** — `s1-add-inline-row`(직접 입력 행)에 onclick이 버튼에만 걸려있어 행 클릭이 무시됨 → onclick을 div 전체로 이동
2. **고객 이름 한글/영문/숫자만 허용하는 유효성 검사**
   - 처음엔 "고객 추가" 클릭 시점에만 검사 → 실시간(타이핑 중) 검사로 개선 (`onSearch` 내부에 정규식 체크 추가)
   - 정규식: `/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]/` (숫자 허용 — 휴대전화 번호 검색 지원)
   - 에러 메시지: "특수문자는 입력할 수 없습니다. 한글, 영문, 숫자만 입력해 주세요." (`#s1error`)
3. **더미 고객 이름 전체 교체** — 실제 사람 이름처럼 보이던 이름들을 테스트용 가상 이름으로 통일 (예: 이세모, 김반달, 정네모, 홍동글, 임별표, 권물음, 오느낌, 박하트, 최번개, 윤구름). `customer_list_v2.html` 기준으로 4개 파일 모두 동일 이름 세트 사용.
4. **비단골 고객 이름 짙은 회색(#666) 표시** — 테이블(`customer_list_v2.html`, `prescription_list_v2.html`)에서 `regular`/`isNew` 플래그에 따라 `.td-name.regular`(파랑) vs `.td-name.muted`(#666) 클래스 분기
5. **CL note에서 단골 고객 이름 클릭 시 상세 페이지 이동** — `cl_note_v2.html`에서 단골(`!isNew`)은 `<a class="name-link" href="customer_info_v2.html">`, 비단골은 `<span class="name-muted">`
6. **모달 내 고객 선택 후 검색창 자동 숨김** (2026-07-06) — 고객 선택 시 안내문구(`#s1guide`)·검색창(`#s1searchWrap`)·에러메시지(`#s1error`)를 `hideSearchSection()`으로 일괄 숨김. 기존엔 처방전 선택 화면 위에 검색창이 계속 남아있던 문제.
7. **다제약물관리사업 대상자 확인 메시지 조건 변경 (AND 조건)** (2026-07-06) — 기존엔 선택한 처방전의 총 약물 수 `totalDrugs >= 10`만으로 경고 표시. 요청에 따라 "3개월 내 처방 약물 10개 이상" **AND** "3개월 이상 복용해야 하는 약물 존재" 조건으로 변경. 데이터 모델에 별도 필드 추가 없이 기존 `drug.days`(처방 일수, 예: rx3은 90일)를 재사용해 `hasLongTermDrug = selectedRxIds.some(id => editingDrugsMap[id].some(d => d.days >= 90))`로 판정. `prescription_list_v2.html`, `prescription_list.html`(구버전) 두 파일의 `updatePolyAlert()`에 동일 적용.
8. **AI 복약 상담 모달에 "복약 알림" 스텝 신규 추가** (2026-07-06, `prescription_list_v2.html`만 우선 적용 — 나머지 3개 v2 패턴 파일은 미반영) — 기존 3단계(고객·처방전 선택 → 복약지도 전송 → 전송 확인) 모달을 4단계로 확장.
   - **최종 스텝 순서**: 1 고객·처방전 선택 → **2 복약 알림(신규)** → 3 복약지도 전송 → 4 전송 확인. 처음엔 복약지도 전송 다음(3번)에 넣었으나, "처방전에서 바로 뽑히는 복약 알림을 먼저 확정하고 그 내용을 반영해 상담 메시지를 작성하는 게 자연스럽다"는 피드백으로 순서를 앞당김 — `goStep2`가 복약 알림(`renderReminderBody`), `goStep3`가 메시지 작성(`renderMsgBody`), `goStep4`가 기존 전송 확인 화면.
   - **정책**: 알림은 **처방전 단위**로 설정(품목별 개별 설정 아님) — 환자앱에 자동 등록되는 현재 정책과 일치, 복잡도 최소화를 위한 선택.
   - 선택한 처방전마다 카드 생성 — 처방전의 `drug.freq`(예: "1일 3회")에서 최댓값을 뽑아 복약 횟수 기본값 산출(`parseFreqCount`/`initReminderSettings`), 복약 기간은 처방전의 `days`(OCR 인식값)를 기본값으로 사용. 모든 값은 약사가 pill 버튼/날짜·숫자 입력으로 수정 가능.
   - **UI를 처방전 선택 리스트(`.s2-rx-card`/`.s2-rx-expand`)와 동일한 톤으로 재정리** (2026-07-06) — 처음엔 카드 안에 카드가 중첩된 느낌(`.rm-card` 내부에 각 설정이 개별 박스)이라 답답하다는 피드백. `.rm-row`(접힌 한 줄 — 병원명·부서·약품 목록·요약 chip·on/off 토글·쉐브론)+`.rm-panel`(펼쳤을 때만 보이는 파란 테두리 확장 영역, `.s2-rx-expand`와 동일 패턴)로 교체, 클릭 시 `rmToggleExpand`로 아코디언처럼 펼침. 토글 스위치·날짜/숫자 입력은 `event.stopPropagation()`으로 행 클릭(펼치기)과 분리.
   - 카드별 토글(`rmToggleEnabled`)로 전송 여부 on/off. 상태는 전역 `reminderSettings` 객체(`{[rxId]: {enabled, times, slots, timing, startDate, days}}`)에 저장, 펼침 상태는 `rmExpandedIds` Set에 저장. `openModal()`/`toggleCheck()` 처방전 해제 시 둘 다 초기화.
   - 하단에 "이 단계 건너뛰기"(`goStep2Skip` — 전체 토글 off 처리 후 다음 단계로) 버튼 추가.
   - 마지막 "전송 확인" 단계(`goStep4`) 요약 테이블에 "복약 알림: N건 설정 (웰체크 앱 자동 등록)" 행 추가.
   - **TODO**: `customer_list_v2.html`, `customer_info_v2.html`, `cl_note_v2.html`에도 동일 4단계 모달 구조 반영 필요 (사용자가 prescription_list_v2.html 우선 확인 후 확장 여부 결정 예정).

### 검증된 값 / 재사용 가능한 패턴
- 확인 모달 디자인 톤: 질문형 제목 + 회색 안내 + 빨간 경고 + 취소/확인(파랑) 버튼
- 보조 액션(삭제 등)은 관리 컬럼에 욱여넣지 말고 전용 컬럼으로 분리
- 커밋 후 사용자 요청 없이도 항상 `git push`까지 수행 (이 프로젝트 규칙)

### 다음 확인 사항
- 최신 커밋(`edc519c` 검색창 자동 숨김) 배포 반영 여부 확인 필요 — `gh run list --repo m2choo/pharmaweb-prototype --limit 3`로 배포 상태 체크 후 https://m2choo.github.io/pharmaweb-prototype/customer_list_v2.html 실제 반영 확인

---

## 개요

B2B 헬스케어 서비스 **Wellcheck**의 자문약사 웹 프로토타입.  
자문 약사가 다제약물관리사업 대상자를 관리하는 싱글 파일(HTML) 앱.

- **기술 스택**: 순수 HTML + CSS + Vanilla JS (빌드 도구 없음)
- **패턴**: IIFE, `const $ = document.querySelector` 헬퍼, `innerHTML` 기반 렌더링
- **상태 관리**: 모듈 레벨 객체 (`s1`, `C` 등) — 새로고침 시 초기화됨

---

## 디자인 규칙

| 항목 | 값 |
|------|----|
| 배경색 | `#F8F7F4` |
| 포인트 컬러 | `#185FA5` |
| 보조 컬러 | `#0F6E56` |
| 폰트 | **Noto Sans KR** (Google Fonts), fallback: Apple SD Gothic Neo |

### 타입스케일 (Text Guide 기준)

| 토큰 | 폰트 | 크기 | 행간 | 용도 |
|------|------|------|------|------|
| H1 | Noto Sans KR Medium | 30px | auto | 페이지 대제목 |
| H2 | Noto Sans KR DemiLight | 24px | auto | 섹션 제목 |
| H3 | Noto Sans KR Medium | 18px | auto | 카드 헤더 |
| Body1 | Noto Sans KR Regular | 15px | auto | 기본 본문 |
| Body1_bold | Noto Sans KR Medium | 15px | auto | 강조 본문 |
| Body1_Reading | Noto Sans KR Regular | 15px | 25px | 긴 문단 |
| Body1_English | Poppins Regular | 15px | auto | 영문 전용 |
| Caption 1 | Noto Sans KR Medium | 13px | auto | 레이블, 배지 |
| Caption 2 | Noto Sans KR DemiLight | 13px | auto | 보조 설명 |
| caption 3 | Noto Sans KR Regular | 12px | 120% | 최소 단위 텍스트 |

**적용 기준 (2026-06-02 업데이트)**
- `body` 기본: 15px (Body1)
- 카드 본문·테이블 셀: 13~15px (Caption 1 ~ Body1)
- 레이블·배지·th: 12~13px (caption 3 ~ Caption 1)
- 최소 허용 크기: 12px (caption 3) — 그 이하 사용 금지

**상태 뱃지 컬러**

| 상태 | 배경 | 텍스트 |
|------|------|--------|
| 동의서 징수 | `#F1EFE8` | `#5F5E5A` |
| 공단 승인 대기 | `#FAEEDA` | `#854F0B` |
| 상담 예정 | `#E6F1FB` | `#185FA5` |
| 1차 상담 완료 | `#E1F5EE` | `#0F6E56` |
| 2차 상담 완료 | `#E1F5EE` | `#0F6E56` |
| 4차 상담 완료 | `#EEEDFE` | `#534AB7` |

---

## 진행 상태값 규칙

대상자의 진행 상태는 아래 5가지 값만 사용. 리스트 테이블 상태 컬럼, 개인 페이지 이름 옆 태그, 사업 절차 타임라인 모두 동일 값 기준으로 표시됨.

| 상태값 | 타임라인 위치 | 리스트 색상 |
|--------|-------------|------------|
| 동의서 징수 | 1번째 단계 (active) | 주황 (warn) |
| 공단 승인 대기 | 2번째 단계 (active) | 주황 (warn) |
| 상담 예정 | 3번째 단계 (active) | 기본 |
| 1차 상담 완료 | 4번째 단계 (active) | 초록 (success) |
| 2차 상담 완료 | 5번째 단계 (active) | 초록 (success) |
| 4차 상담 완료 | 6번째 단계 (active) | 초록 (success) |

- 타임라인: `curIdx` 이전 단계는 `done` (체크), 현재 단계는 `active-step` (점), 이후 단계는 미완료
- 개인 페이지 badge: `c.status` 값 표시, 완료 상태면 파란색(기본 badge), 그 외 주황(warn)

---

## 개발 주의사항

- **단일 HTML 파일 유지** — 별도 파일 생성 금지
- **프레임워크 사용 금지** — 순수 HTML·CSS·JS만
- **기존 state 구조 유지** — 새 기능 추가 시 `s1` 등 기존 상태 객체 확장
- **수정 전 코드 확인** — 반드시 현재 코드 Read 후 작업

---

## 사업 절차

```
동의서 징수 → 공단 승인 → 상담 예정 → 1차 상담 → 2차 상담 → 3차 상담 → 4차 상담
```

---

## 구현 완료 화면

### 1. 대상자 리스트 (`▤ 다제약물관리사업`)

| 기능 | 상태 |
|------|------|
| 검색 (이름 필터링) | ✅ |
| 상태별 필터 탭 (전체 / 상담 예정 / 진행 중 / 완료) | ✅ |
| 페이지네이션 | ✅ |
| 대상자 초대 모달 (문자 발송 미리보기) | ✅ |
| 테이블 → 개인 페이지 링크 | ✅ |

**시드 데이터 (6명):**

| ID | 이름 | 나이/성별 | 참여 | 진행 상태 |
|----|------|----------|------|----------|
| p1 | 김영자 | 72세 / 여 | 참여 | 상담 예정 |
| p2 | 박정수 | 76세 / 남 | 미참여 | — |
| p3 | 이순희 | 74세 / 여 | 참여 | 2차 상담 완료 |
| p4 | 정말순 | 78세 / 여 | 참여 | 동의서 징수 |
| p5 | 오성호 | 74세 / 남 | 참여 | 1차 상담 완료 |
| p6 | 서명희 | 72세 / 여 | 미참여 | — |

---

### 2. 개인 페이지 — 다제약물관리 탭 구조 (2026-06-04 개편)

| 영역 | 내용 |
|------|------|
| 상단: 사업 진행 단계 | 7단계 스텝: 동의서 징수 / 공단 승인 / 상담 예정 / 1차 상담 / 2차 상담 / 3차 상담 / 4차 상담 |
| 단계 상태 표시 | 완료(초록 ✓) / 현재 단계(파랑) / 대기(회색) |
| 하단: 차수별 탭 | 1차 상담지 / 2차 상담지 / 3차 상담지 / 4차 상담지 (미완료 차수는 잠금) |
| 워크플로우 가이드 (3열) | STEP 1 상담 준비 / STEP 2 상담 의견 작성 / STEP 3 복약지도문 발송 — 각 한 줄 설명 포함 |

---

### 3. 개인 페이지 — 1차 상담지 탭

#### 레이아웃 — 3단계 흐름 구조 (2026-06-02 재설계)

```
┌─────────────────────────────────────────┐
│ ① 상담 준비                    [진행 중] │
│  · 상담 일자·방식                        │
│  · 디지털 상담지                         │
│    └ 가로 3단계 가이드 (상담전/중/후)     │
│    └ iframe (dashboard_v2.html)         │
│    └ 메모                               │
└─────────────────────────────────────────┘
              │ (연결선)
┌─────────────────────────────────────────┐
│ ② 상담 의견 작성               [대기 중] │
│  · 약사 소견 텍스트 영역                 │
└─────────────────────────────────────────┘
              │ (연결선)
┌─────────────────────────────────────────┐
│ ③ 복약지도문 발송 & 기록 제출   [대기 중] │
│  · 복약지도문 발송하기 버튼              │
│  · 상담 완료 확정 버튼                   │
│  · 최종 제출                            │
└─────────────────────────────────────────┘
```

**단계 헤더 상태 표시:**
- 번호 뱃지: 파란색(진행 중) / 초록(완료) / 회색(대기)
- 우측 상태 필: `진행 중` / `확정 완료` / `작성 필요` / `작성 완료` / `발송 필요` / `제출 완료` / `대기 중`

> **변경 이력**
> - 2026-05-29: C1 삭제, C2·C9 병렬 상단 배치, 사이드바 제거, full width 전환
> - 2026-06-02: 3단계 흐름 레이아웃으로 전면 재설계, C 넘버 라벨 전면 제거

#### 상담 일자·방식 (구 C2)

- `<input type="date">` 날짜 선택
- 방문 / 유선 / 비대면 토글 버튼 (`.method-btn.sel`)
- 상태: `s1[id].date`, `s1[id].method`

#### 디지털 상담지 (구 C4)

**상단 — dashboard_v2.html iframe 삽입 + 투약 현황 편집 기능 (2026-05-29)**
- `dashboard_v2.html`을 반응형 iframe으로 C4 헤더 div 아래, 기존 폼 위에 삽입
- `initTab1Events`에서 `document.createElement('iframe')`으로 동적 생성 (innerHTML 미지원 우회)
- iframe `width: 100%`, `scrolling: no`, onload 시 `documentElement.scrollHeight`로 높이 자동 맞춤
- `dashboard_v2.html` 반응형 처리: `min-width: 1719px` 제거, viewport `device-width`, 900px·600px 미디어 쿼리 추가 (fcard-body 세로 스택, row3 단열, prof-grid 2열 등)
- `wellcheck` CSS에 `.content{overflow:hidden;min-width:0}` 추가 → 이후 `overflow:hidden` 제거 (콘텐츠 클리핑 문제 수정, 2026-05-29)

**용어 변경 및 메모 레이아웃 통합 (2026-06-02)**
- `dashboard_v2.html` 카드 라벨 "검토 필요" → "꼭 확인하세요!" 로 변경
- `wellcheck_polypharmacy_prototype_preview.html` 메모 섹션 레이아웃 개선
  - 기존: `c4MemoWrap`에 독립 박스 스타일(`border + border-radius + background:#fafafa`) → 박스 안에 박스처럼 보임
  - 변경: 별도 박스 제거, 상단 구분선(`border-top`)만 남겨 대시보드 카드 하단에 자연스럽게 통합

**검토 필요 섹션 시각화 개선 (2026-06-02)**
- 기존: HIGH/MEDIUM/LOW 3열 나란히 → 동등한 시각적 무게로 중요도 구분 어려움
- 변경: 세로 스택 레이아웃, 중요도별 차별화된 카드 디자인
  - **섹션 헤더**: 빨간 아이콘, "투약 이력 분석 — 상담 전 반드시 확인" 부제 추가
  - **HIGH (즉시 확인)**: 굵은 빨간 왼쪽 바(4px) + 분홍 헤더 + `⚠` 접두사 + 약물명 13px bold + 건수 뱃지
  - **MEDIUM (상담 중 확인)**: 주황 왼쪽 바 + 항목별 `1번/2번/3번` 번호 + 항목 간 구분선
  - **LOW (교육 권장)**: 초록 왼쪽 바 + `·` 불릿 리스트로 간결하게
  - 모든 카드 우상단에 건수 뱃지 표시
- `renderFlags()` 마크업 전면 재작성 (`fcard-header` / `fcard-items` / `fitem-r·y·g` 구조)
- CSS: `.fcard.r·y·g` 스타일 분리, `.flevel` 11px bold, `.fbadge` 신규 추가

**투약 현황 편집·저장 기능 (2026-05-29 추가)**
- 처방약·영양제 테이블이 JS 데이터 배열(`rxDrugs`, `suppDrugs`) 기반으로 렌더링
- **수정** 버튼: 테이블 셀 전체 → 인풋 필드 전환, 행 삭제(×) 버튼·행 추가 버튼 표시
- **저장** 버튼: 변경 데이터를 읽어 규칙 엔진 재실행 → 검토 필요(HIGH/MEDIUM/LOW), 상단 뱃지(🔴🟡🟢), 처방·영양제 수, 낙상 고위험 약물 수 자동 업데이트
- **취소** 버튼: 편집 전 상태 복원
- **규칙 엔진 항목**: 수면제·진정제 중복(졸피뎀·트리아졸람·알프라졸람 등), 알렌드로네이트+칼슘 흡수 간격, 오메가3·홍삼 항혈전, 칼슘+마그네슘 중복, 낙상 고위험 약물 자동 감지
- 테이블 행 단위 검토 사항(flag-r/flag-y)도 규칙 기반으로 자동 계산

**PDF 저장 버튼 (2026-05-29 추가)**
- `🖨 인쇄` 버튼 옆에 `⬇ PDF 저장` 버튼 추가
- 클릭 시 `dashboard_v2.html`을 새 탭으로 열고, 페이지 로드 완료 후 브라우저 인쇄 대화상자 자동 실행 (PDF로 저장 옵션 활용)

**최종 확정 팝업 (2026-05-29 추가)**
- `최종 확정` 버튼 클릭 시 `#finalizeConfirmModal` 팝업 표시
- 팝업 문구: "확정한 지도문은 다시 수정하실 수 없습니다."
- 하단 버튼: `취소` (팝업만 닫힘) / `확인` (확정 처리 + 버튼 "✓ 확정 완료"로 변경 + toast)
- 이미 확정 상태(`st.consultFinalized=true`)면 버튼 클릭 무시

**하단 — 메모 영역 (2026-05-29 변경)**
- 기존 상담 폼(자가복약 평가, 부작용, 환자 질문 영역) 전체 삭제
- iframe 하단에 메모 div 추가: `<textarea>` + 수정 버튼 + 저장 버튼
- **수정** 버튼: textarea readonly 해제 → 편집 가능
- **저장** 버튼: 입력값을 `st.c4Memo`에 저장, textarea readonly 전환 + toast 알림
- 상태: `s1[id].c4Memo`, `s1[id].consultFinalized`

**확정 완료 UX 개선 (2026-05-29 추가)**
- `최종 확정` 확인 시 또는 이미 확정(`consultFinalized=true`) 상태 진입 시:
  - **업데이트** 버튼 `disabled` 처리
  - **인쇄 / PDF 저장** 버튼 활성화 (확정 전에는 `disabled`)
  - 메모 `<textarea>` `readonly` 전환 + 배경 `#f9fafb`
  - 메모 하단 수정·저장 버튼 DOM에서 제거
- 인쇄/PDF 클릭 시 `dashboard_v2.html` 새 탭 → 메모 내용을 하단 박스로 삽입 → 브라우저 인쇄 다이얼로그 자동 실행 (`printWithMemo` / `pdfWithMemo` 전역 함수)

**확정 완료 시 iframe 수정 차단 (2026-05-29 추가)**
- 확정 완료 시 `#dashboardIframeWrap` 위에 투명 오버레이 div(`.iframe-lock`) 추가 → iframe 내 클릭·입력 차단
- 초기 로드 시 이미 확정 상태면 iframe `onload` 이후 자동 잠금
- `doFinalize(afterAction?)` 공통 함수로 확정 로직 통합

**디지털 상담지 확정 완료 연동 (2026-05-29 추가)**
- 전체 요약 탭 디지털 상담지 섹션: 1차 `consultFinalized=true` 시 상태 "작성 대기" → "**작성 완료**"(초록 강조) 표시
- "상담지 열기" 버튼: 확정된 경우 `#consultPopupModal` 팝업 오픈, 미확정 시 안내 알림
- 팝업 헤더: "N차 디지털 상담지" 제목 + 🖨 인쇄 + ⬇ PDF 저장 + × 닫기 버튼
  - 인쇄: iframe `contentWindow.print()` 호출
  - PDF 저장: toast 안내 후 인쇄 다이얼로그 실행
  - 닫기: × 버튼 또는 모달 바깥 클릭으로 닫힘
- `openConsultPopup(round)` 함수를 `window.openConsultPopup`으로 할당(IIFE 스코프 우회)

**미확정 상담지 확인 팝업 (2026-05-29 추가)**
- 전체 요약 탭 "상담지 열기" 클릭 시: 확정 여부에 따라 동작 분기
  - 확정(`consultFinalized=true`): 기존대로 상담지 팝업 뷰어 오픈
  - 미확정: `#consultConfirmModal` 확인 팝업 표시
    - 문구: "상담지 최종 확정 전입니다. / 상담지를 확인하시겠습니까?"
    - **취소**: 팝업 닫기, 전체 요약 탭 유지
    - **확인**: 팝업 닫기 + 해당 차수 탭(예: 1차 → 1번 탭)으로 자동 이동
- `openConsultConfirm(round)` 함수 추가, `window.openConsultConfirm`으로 할당

**타임라인 스텝명 변경 (2026-05-29)**
- 기존: "1차 상담 완료 / 2차 상담 완료 / 4차 상담 완료"
- 변경: "1차 상담 / 2차 상담 / 4차 상담"
- `statusMap` 객체로 `c.status`(예: "1차 상담 완료") → 타임라인 `doneUpTo` 인덱스 매핑 분리
  - "1차 상담 완료" → 1차 상담 스텝 done + 2차 상담 active
  - "2차 상담 완료" → 1·2차 done + 4차 상담 active

**확정 전 인쇄/PDF 사전 확정 팝업 (2026-05-29 추가)**
- 인쇄/PDF 버튼은 항상 활성 상태 (disabled 제거)
- 확정 전 클릭 시 `#prefinalizeModal` 팝업 표시
  - 인쇄: "인쇄는 상담지 최종 확정 후에 가능합니다. / 최종 확정할까요?"
  - PDF 저장: "PDF 저장은 상담지 최종 확정 후에 가능합니다. / 최종 확정할까요?"
  - **취소**: 팝업 닫기 / **확인**: 즉시 확정 처리 후 해당 동작 실행
- `guide-btn:disabled` CSS 추가 — 비활성화 버튼을 회색(`#f3f4f6` 배경, `#9ca3af` 텍스트)으로 표시

#### 상담 의견 (구 C7)

- 보기 모드(기본): 의견 텍스트 표시 + `수정` 버튼
- 편집 모드(`수정` 클릭 시): `<textarea>` + `저장` / `취소` 버튼
- 저장 시 `st.opinion` 업데이트 + toast 알림
- 상태: `s1[id].opinion`, `s1[id].opinionEditing`

#### 복약지도문 발송 (구 C9, 4단계 모달)

**진입 지점**: 3단계 블록 `발송하기 →` 버튼

**모달 구조 (전체 너비, 최대 960px, 전체 높이):**

| 단계 | 제목 | 내용 |
|------|------|------|
| Step 1 | 상담지 확인 | 현재 복용 약물 목록(처방약/OTC/건기식) + 약물관련문제 카드 목록 + 다음 단계 안내 |
| Step 2 | 복약지도문 작성 | **이것만 드세요** (전체 약물 체크박스 — 복용 유지/제외 분류) + **정리할 약** (추가·삭제 가능) + 주의사항 카드 + 약사 의견 textarea |
| Step 3 | 발송 방법 | 카카오 알림톡 / 환자앱 라디오 선택 + 복약지도문 미리보기 |
| Step 4 | 전송 완료 | 발송 확인 화면 (발송 방법·시각·담당 약사) + 인쇄·PDF 저장 버튼 |

**헤더:** 환자 이름/생년월일/연락처 + 4단계 스텝 인디케이터 (완료 ✓ 파란색, 현재 파란 테두리, 미완료 회색)  
**푸터:** Step 레이블 + 이전/다음 버튼 (Step 1·4에서 이전 숨김, Step 4에서 파란색 "확인" 버튼)

**발송 방법 (Step 3):**
- 카카오 알림톡, 환자 앱 전송 2가지만 선택 (인쇄·PDF는 Step 4로 이동)

**Step 4 완료 후 UX:**
- `인쇄` / `PDF 저장` 버튼 표시 (발송 후에만 접근 가능)
- `확인` 클릭 → 모달 닫힘 + 발송 버튼 텍스트 `발송하기 →` → `복약지도문 내용 보기` 로 변경

**이것만 드세요 로직:**
- 전체 약물(처방약+건기식)을 체크박스로 표시
- 체크 = 복용 유지(파란 강조), 미체크 = 제외(회색)
- 변경 시 즉시 UI 반영, `_gmDoc.keepMeds` 객체에 저장

**정리할 약 로직:**
- 상담지 DRP에서 `중복투약` 유형 자동 추출 → 해당 약물 자동 매칭
- × 버튼으로 삭제, `+ 정리할 약 추가` 버튼으로 직접 입력

**발송 미리보기 (Step 3 우측):**
- Step 2에서 선택한 복용 유지 약물·정리할 약·주의사항·약사 의견을 자동으로 알림톡 형식으로 포맷팅

> **빠른 연락**: 상단 헤더 `빠른 연락` 버튼으로만 접근 (별도 유지)

#### 상담 완료 확정 & 최종 제출 (구 C10)

**상담 완료 확정 버튼:**
- 파란 테두리 박스 + `✓ 1차 상담 완료` 버튼 (발송 전 필수)
- 클릭 시 3곳 동시 업데이트:
  1. **상단 이름 옆 배지**: `상담 예정` → `1차 상담 완료`
  2. **전체 요약 탭 타임라인**: "1차 상담" 스텝 ✓ 완료, "2차 상담" 스텝 active
  3. **대상자 리스트**: 진행 상태 컬럼 `1차 상담 완료` 표시
- 완료 후: 파란 박스 → 초록 완료 확인 박스로 교체, 최종 제출 버튼 활성화

**최종 제출:**
- `submitBtn`: `consultCompleted=true`일 때만 활성화
- 제출 후: 초록 배너 + 탭 내 모든 폼 요소 `disabled`
- 상태: `s1[id].consultCompleted`, `s1[id].submitted`

---

## 업데이트 이력

### ✅ 2026-06-05 (24차)
- **dashboard_v2.html 전체 디자인 개편 — 서류형 레이아웃으로 전환**
  - 기존 문제: 모든 섹션이 둥근 카드 박스 + 배경색으로 싸여 있어 복잡하고 무거운 느낌
  - 방향: 기본은 서류처럼, 중요한 "꼭 확인하세요!" 섹션만 카드로 강조
  - **body 배경**: `#eeece8`(회색) → `#fff`(흰색) — 문서지 느낌
  - **topbar**: 둥근 카드 → 플랫 헤더 (border-radius 제거, margin 제거, border-bottom만)
  - **대상자 기본 프로필**: 카드 박스 완전 제거 → topbar 바로 아래 한 줄 인라인 바(얇은 구분선만)
    - 항목들을 `|` 구분자로 나란히 배치 (연령·성별 / 거주 형태 / 인지 기능 / 참여 회차 / 만성질환 / 경고)
  - **모든 일반 섹션 (투약 현황, 복약순응도, 이상반응)**: 카드 box 제거 → border-bottom 구분선만, border-radius 0, 패딩 조정
  - **꼭 확인하세요! 카드**: `.card-highlight` 클래스 신설 — 붉은 테두리(1.5px, rgba(226,75,74,0.35)) + border-radius 유지 + 약한 그림자 + 여백으로 단독 강조
  - **"AI 분석 결과" 문구**: 헤더 우측에 작게 표시 → `font-size:12px`, `color:var(--text-secondary)`, **공단 자료와 대조 후 최종 판단** bold 강조

### 🔍 2026-06-05 (23차) — 다음 작업 예정
- **dashboard_v2.html (아이프레임) 구조 개선**
  - 현재 문제점 파악 완료:
    1. 섹션이 너무 많고 스크롤이 지나치게 길음 (topbar → 프로필 → 꼭확인 → 투약현황 → 복약순응도 → 이상반응 → 낙상위험 → 메모)
    2. 정보 성격이 섞여 있음 — 약사 판단 필요 항목 / 환자 자가보고 / 공단 데이터가 같은 레벨로 나열됨
    3. 투약현황 테이블이 너무 지배적 → 다른 중요 정보가 묻힘
  - **다음 작업**: 정보 우선순위 재정의 후 섹션 순서·비중 재조정

### ✅ 2026-06-05 (22차)
- **"바로 가기" 버튼 동작 개선** (`wellcheck_polypharmacy_prototype_preview.html`)
  - 기존: 해당 STEP phase-body로만 스크롤
  - 변경: STEP이 닫혀 있으면 먼저 열고(collapsed 제거) → 해당 STEP으로 스크롤 이동

### ✅ 2026-06-05 (21차)
- **1차 탭 UX 전면 개선** (`wellcheck_polypharmacy_prototype_preview.html`)
  - **"지금 할 일" 액션 박스 신설**: 탭 진입 즉시 현재 단계(STEP 1/2/3)와 해야 할 일 1문장이 상단에 표시. "바로 가기 →" 버튼으로 해당 섹션 스크롤 이동
  - **STEP 접기/펼치기**: STEP 헤더 클릭 시 body toggle. 진입 시 현재 STEP만 펼쳐지고 나머지는 접힘 → 전체 흐름이 한눈에 파악됨
  - **phase-connector(단계 연결선) 제거**: 접기/펼치기 구조와 충돌하므로 삭제
  - **CSS 추가**: `.phase-block.collapsed .phase-body{display:none}`, `.phase-toggle`, `.action-now` 관련 스타일
- **"상담 예정" → "참여 확정"으로 용어 변경** (`wellcheck_polypharmacy_prototype_preview.html`)
  - 사업 진행 단계 스텝명 및 데이터 status 값 전체 일괄 변경
  - 기존: 동의서 징수 → 공단 승인 → **상담 예정** → 1차 상담 …
  - 변경: 동의서 징수 → 공단 승인 → **참여 확정** → 1차 상담 …
- **안내 배너 위치 최종 확정** (`wellcheck_polypharmacy_prototype_preview.html`)
  - iframe 내부(dashboard_v2.html) → wellcheck 앱 UI로 이동, STEP 1 phase-body 내 기록지 바로 위에 위치
  - dashboard_v2.html에서 배너 완전 제거
- **기타 소소한 정리**
  - "디지털 상담지" 중복 타이틀 제거
  - 3열 워크플로우 가이드 박스 제거 (STEP 헤더에 흡수)
  - 차수 탭 레이블 "1차 상담지" → "1차" 단축
  - 긴급 카드 체크박스 제거
  - `mockup_1cha.html` 목업 파일 생성 (AS-IS vs TO-BE 비교용)

### ✅ 2026-06-05 (20차)
- **디지털 상담지 색상 전면 단순화** (`dashboard_v2.html`)
  - 긴급(HIGH): 빨강 좌측 bar + 연핑크 배경 유지 — 즉시 눈에 띄도록 강조 유지
  - 주의(MEDIUM) / 안내(LOW): 컬러(주황/초록) → 회색으로 통일 — 색 노이즈 제거
  - badge(건수 표시): 긴급만 빨강, 나머지 회색
  - `fitem-y` 번호 색상: 주황 → 회색
  - `fitem-g` dot/bullet: 초록 → 회색
  - 투약현황 pills(처방/일반의약품/건기식): 빨강/주황/초록 → 모두 회색
  - 테이블 `flag-r` 행: 진한 분홍(`#FCEBEB`) → 매우 연한 중성 핑크(`#fdf5f5`)
  - `flag-y-txt` 텍스트: 주황 → 기본 secondary 색상
  - 아이템 구분선: 컬러 border → 기본 `var(--border)`
- **상단 통합 안내 배너 신설** (`dashboard_v2.html`)
  - 기존 파란 인쇄 배너 + 반복 prestudy-notice(3곳) → 통합 배너 1개로 교체
  - ① 환자 제공 이력 기반 상담 활용 → ② 공단 자료 크로스체크 / 약사 판단 우선 → ③ 검토 완료 후 인쇄 활용
  - 배너 위치: topbar 바로 아래, 대상자 프로필보다 위
- **사이드 notice 완전 제거** (`dashboard_v2.html`)
  - 투약현황·OTC·건기식 섹션 상단 `prestudy-notice` 3곳 모두 삭제
- **차수 탭 레이블 단축** (`wellcheck_polypharmacy_prototype_preview.html`)
  - `1차 상담지 / 2차 상담지 / 3차 상담지 / 4차 상담지` → `1차 / 2차 / 3차 / 4차`
- **디지털 상담지 부제 삭제** (`wellcheck_polypharmacy_prototype_preview.html`)
  - "환자 앱 사전 입력 기반 · 상담 전·중·후 단계별로 활용하세요" 문구 제거
- **topbar 불필요 태그 제거** (`dashboard_v2.html`)
  - 🔴 긴급 N건 / 🟡 확인 N건 / 🟢 교육 N건 pill 제거
- **로고 교체** (`wellcheck_polypharmacy_prototype_preview.html`)
  - 인라인 SVG → `BI.svg` 외부 파일(`<img src="BI.svg">`)로 교체

### ✅ 2026-06-04 (17차)
- **개인 페이지 다제약물관리 탭 구조 전면 개편** (`wellcheck_polypharmacy_prototype_preview.html`)
  - 기존: 서브탭 (전체 요약 | 1차 | 2차 | 3차 | 4차)
  - 변경: **상단 — 사업 진행 단계** + **하단 — 차수별 탭 (1차 상담지 | 2차 상담지 | 3차 상담지 | 4차 상담지)**
  - 각 차수 탭 콘텐츠 = 기존 차수 탭 내용 그대로 유지
- **사업 진행 단계 스텝 개편**
  - 기존 7단계(동의서 징수/공단 승인 대기/상담 예정/1차 상담/2차 상담/4차 상담/수가 청구)
  - 변경 7단계: **동의서 징수 / 공단 승인 / 상담 예정 / 1차 상담 / 2차 상담 / 3차 상담 / 4차 상담**
    - "공단 승인 대기" → "공단 승인" (단축)
    - "4차 상담" → "3차 상담 / 4차 상담" (3차 추가)
    - "수가 청구" 제거
- **단계 상태 용어 정리**
  - 기존: `완료` / `진행 중` / `-`
  - 변경: `완료` / `현재 단계` / `대기`
- **워크플로우 가이드 (3열 헤더) 단순화**
  - STEP 1/2/3 label을 gray 소타이틀에서 blue 대타이틀로 격상
  - 기존 bullet 설명 목록 제거 → 제목 + 한 줄 설명만 유지
  - STEP 1 · 상담 준비 / STEP 2 · 상담 의견 작성 / STEP 3 · 복약지도문 발송

### ✅ 2026-06-02 (16차)
- **단골고객 현황 테이블 컬럼 재배치** (`wellcheck_polypharmacy_prototype_preview.html`)
  - 컬럼 순서: `보유 질환` → `30일 복약 순응도` → `다제약물 사업참여` → `사업 관리` 로 재배치 (기존: `다제약물 사업참여` → `보유 질환` → `30일 복약 순응도`)
  - `사업 관리` 컬럼 신규 추가: 참여자 → `대상자 바로가기 →` 링크 (클릭 시 개인 페이지 이동) / 미참여자 → `참여 메시지 보내기 ↗` 링크
- **개인 페이지 헤더 개편** (`wellcheck_polypharmacy_prototype_preview.html`)
  - 기존: `personal-top` 카드 (이름·배지·생년월일·버튼 모아서 박스 안에 표시)
  - 변경: 상단 `.header` 영역에 환자 정보 통합
    - `pageTitle`: `‹ [이름]` (뒤로가기 버튼 내장)
    - `pageSubtitle`: `[생년월일]생([나이/성별]) · [성별] · [전화번호]`
    - `headerAction`: `빠른 연락` 버튼
  - `← 목록` 버튼 제거, `‹` 화살표 클릭으로 목록 복귀
  - `personal-top` 카드 div 완전 삭제

### ✅ 2026-06-02 (14차)
- **Overview 탭 플레이스홀더 이미지 삽입** (`wellcheck_polypharmacy_prototype_preview.html`)
  - Overview 탭 콘텐츠를 `overview_placeholder.png` 이미지로 대체
  - 추후 실제 UI 구현 전까지 화면 시안용으로 활용
- **초기 화면 단골고객 리스트로 고정**
  - `tests()` 함수 제거 — `renderList('poly')` 호출로 인해 새로고침 시 "다제약물관리사업 대상자 현황"이 첫 화면으로 떴던 문제 해결
  - `renderList('customers')`만 남겨 단골고객 현황이 항상 첫 화면으로 표시

### ✅ 2026-06-02 (13차)
- **네비게이션 구조 개편** (`wellcheck_polypharmacy_prototype_preview.html`)
  - 사이드바에서 `▤ 다제약물관리사업` 항목 제거
  - 첫 화면 = `단골고객 현황` 리스트
  - 개인 페이지 상단 탭: **Overview** / **다제약물관리** 2개로 재구성
    - `Overview`: 기존 전체 요약 콘텐츠 (타임라인·디지털 상담지·복약 순응도 등)
    - `다제약물관리`: 서브탭 **전체 요약 | 1차 | 2차 | 3차 | 4차** 포함
  - `detail(id, origin)` 시그니처 → `detail(id, activeTopTab?)` 으로 변경
  - `row()` 및 테스트 내 `detail()` 호출 시그니처 동기화
- **워크플로우 가이드 위치 이동** (`wellcheck_polypharmacy_prototype_preview.html`)
  - 기존: `상담 준비` 박스 내부 가로 3단계 스트립
  - 변경: phase 블록 전체 위 독립 카드로 이동
  - 각 step에 번호 칩 + 구체적 행동 지침(영역명 포함) 3개씩
  - STEP 2 설명: "함께 보며 기록" → **"인쇄본으로 상담 진행"** (실시간 편집 아닌 인쇄 활용 방식 반영)
- **꼭 확인하세요! 체크리스트화** (`dashboard_v2.html`)
  - 긴급·주의·안내 각 항목에 체크박스 추가 (인쇄 후 상담 중 직접 체크 용도)
  - 체크박스 accent-color: 긴급 `#A32D2D` / 주의 `#EF9F27` / 안내 `#639922`
- **인쇄 활용 안내 배너 추가** (`dashboard_v2.html`)
  - 꼭확인 섹션 바로 위에 파란 배너 삽입: "이 기록지를 인쇄해서 상담에 활용하세요"
  - 부제: "아래 검토 항목을 체크하며 상담을 진행하세요 — 우측 상단 인쇄 버튼 또는 Ctrl+P"
  - 꼭확인 부제도 "인쇄 후 상담 중 체크하며 활용"으로 수정
- **처방 의약품 목록 스크롤 고정** (`dashboard_v2.html`)
  - `#subsec-rx` max-height: 420px + overflow-y: auto 적용
  - 3개월·6개월 조회 시 무한 늘어나는 문제 해결
  - 커스텀 스크롤바 스타일 (width 5px, 테두리 색)
- **iframe 높이 자동 동기화** (양 파일)
  - `dashboard_v2.html`: `ResizeObserver`로 body 높이 변화 감지 → `postMessage({ type: 'iframeResize', height })` 발송
  - `wellcheck_polypharmacy_prototype_preview.html`: `message` 이벤트 수신 → `consultPopupIframe` 및 `dashboardIframeWrap iframe` 높이 실시간 갱신
  - 섹션 토글 접기 시 iframe 하단 공백 제거

### ✅ 2026-06-02 (9차)
- **투약현황 날짜 필터 추가** (`dashboard_v2.html`)
  - 카드 상단에 1개월 / 3개월 / 6개월 프리셋 + 날짜 직접 입력 + 조회 버튼 (기본: 3개월)
  - 조회 결과 요약 우측 표시 (N회 방문 표시 / 전체 N회)
- **처방 의약품 방문 기준 그룹핑**
  - 데이터 구조: 기존 약품 배열(`rxDrugs`) → 공단 API 구조(`rxVisits`: 방문 > 투약내역)로 전환
  - 같은 날·같은 기관 처방은 방문 헤더 행(날짜 · 병의원명 · 진료형태 · 종수) 아래 약품들로 그룹핑
  - 약효군·투약일수 컬럼 추가, 검토사항 컬럼 유지
  - 규칙 엔진용 현재 약품 목록: 방문 데이터에서 최근 중복 제거로 자동 도출(`deriveRxDrugs`)
- **편집 모드 범위 조정**: 공단 데이터인 처방약은 read-only, OTC·건기식(자가 입력)만 수정 가능
- **서브섹션 타이틀 스타일 개선**: 기존 회색 소문자 divider → 굵은 검정 타이틀 스타일로 변경
- **중복 섹션 제거**: 별도 "투약 이력" 카드 제거 (투약현황과 동일 소스였음)

### ✅ 2026-06-02 (8차)
- **꼭 확인하세요 레이블 한국어 전환** (`dashboard_v2.html`)
  - HIGH → **긴급 — 반드시 확인** / MEDIUM → **주의 — 상담 중 확인** / LOW → **안내 — 교육 권장**
- **플래그 카드 아코디언 접기/펼치기** 추가
  - 기본 상태: 긴급 펼침, 주의·안내 접힘
  - 헤더 클릭 시 토글, ▼/▶ 화살표 회전 애니메이션
- **투약 현황 구조 개선** (`dashboard_v2.html`)
  - 자가 복용 항목을 **일반의약품**·**건강기능식품** 두 섹션으로 분리
  - 헤더 뱃지: 처방 N종 / 일반의약품 N종 / 건기식 N종 으로 구분
  - OTC·건기식은 환자앱에서 빈도 미수집 → **복용빈도 컬럼 제거**, 제품명·주요성분·검토사항 3컬럼
  - `otcDrugs` 배열 신규 추가, 규칙 엔진·편집 모드·readInputs 전반 OTC 반영
  - 영양제 제품명 앱 체크박스 기반 명칭으로 정규화 (오메가 3, 비타민 C, 미네랄 Ca·Mg 등)

### ✅ 2026-06-02 (7차)
- **상담 기록지 타이포그래피 전면 업스케일** (Text Guide 적용)
  - 폰트: Pretendard·Apple SD Gothic Neo → **Noto Sans KR** (Google Fonts, weights 300·400·500·700)
  - `body` 기본 크기: 13~14px → **15px** (Body1 기준)

### ✅ 2026-06-02 (6차)
- **타이포그래피 전면 업스케일** (Text Guide 적용)
  - 폰트: Pretendard·Apple SD Gothic Neo → **Noto Sans KR** (Google Fonts, weights 300·400·500·700)
  - `body` 기본 크기: 13~14px → **15px** (Body1 기준)
  - 카드 레이블: 14px → 15px / 카드 본문: 12px → 14px
  - 배지·pill: 11px → 13px / 버튼: 12px → 13px
  - 테이블 th: 10px → 12px / td: 11px → 13px
  - 레이블류(plabel, cl-sub 등): 10px → 12px (caption 3 최소 기준 준수)
  - 플래그 카드 약물명: 13px → 15px (H3 수준)
  - wellcheck 메인 파일: 14px → 15px, th/pill/card-title 등 동기화
- **상담 일자·방식 섹션 통합**: 독립 box 제거 → 디지털 상담지 헤더 인라인 편입

### ✅ 2026-06-02 (5차)
- **1차 탭 3단계 흐름 레이아웃 재설계**: ① 상담 준비 / ② 상담 의견 작성 / ③ 복약지도문 발송 & 기록 제출
- **C 넘버 라벨 전면 제거**: C2·C4·C7·C9·C10 등 노출 라벨 모두 삭제
- **기록지 폰트 위계 개선**: `card-label` 12px→14px/700, `topbar-title` 15px→16px/700
- **디지털 상담지 활용 가이드**: 가로 3열 배너(상담 전·중·후)로 교체

### ✅ 2026-06-02 (4차)
- **1차 탭 레이아웃 3단계 흐름으로 전면 재설계**
  - 기존: 섹션 나열형 → 변경: ① 상담 준비 / ② 상담 의견 작성 / ③ 복약지도문 발송 & 기록 제출 3단계 블록
  - 각 단계 헤더: 번호 뱃지(진행중·완료·대기) + 제목 + 상태 필
  - 단계 간 연결선(`.phase-connector`) 시각화
  - CSS: `.phase-block`, `.phase-header`, `.phase-num-*`, `.phase-badge-*`, `.phase-connector` 추가
- **기록지(dashboard_v2.html) 폰트 위계 개선**
  - `card-label`: 12px/500 → **14px/700** (섹션 헤더와 바디 폰트 명확히 구분)
  - `topbar-title`: 15px/500 → **16px/700**
  - `card-body`: `font-size: 12px` 명시
- **C 넘버 라벨 전면 제거**: 사용자에게 노출되는 C2·C4·C7·C9·C10 등 모든 라벨 삭제
- **디지털 상담지 활용 가이드**: 가로 3열(상담 전 사전검토 / 상담 중 기록지 함께보기 / 상담 후 확정) 배너

### ✅ 2026-06-02 (3차)
- `dashboard_v2.html` 검토 필요(S4) 카드 레이아웃 전면 재설계
- HIGH → MEDIUM → LOW 세로 스택, 중요도별 색상·타이포그래피·구조 차별화

### ✅ 2026-05-29 (2차)
- Step 3 발송 방법: 카카오 알림톡·환자 앱 2가지만 표시
- Step 4: 인쇄·PDF 저장 버튼 이동, 확인 버튼으로 정리
- 상담의견 수정/저장 기능 추가
- 복약지도문 ↔ 상담지 데이터 연동 (`gmInitDocFromSt`)
- 전체요약 복용 약물 요약 동적 렌더링

### ✅ 2026-05-29 (1차)
- 복약지도문 4단계 모달 신규 구현
- 사이드바 제거, 1차 탭 full width 전환
- dashboard_v2.html iframe 삽입, 반응형 처리

### 📁 변경 파일
- `wellcheck_polypharmacy_prototype_preview.html`
- `dashboard_v2.html`

---

### 4. 2·3·4차 탭 — 잠금 플레이스홀더

1차 탭 미제출 상태에서 2·3·4차 탭 클릭 시:

```
🔒 2차 상담은 1차 상담 완료 후 활성화됩니다.
```

---

## 상태 구조

```javascript
// 환자별 1차 탭 상태 (s1 객체, 환자 ID 키)
s1['p1'] = {
  date: '',                  // C2: 상담 일자 (YYYY-MM-DD)
  method: '방문',            // C2: '방문' | '유선' | '비대면'
  c4Memo: '',                // C4: 메모 텍스트
  consultFinalized: false,   // C4: 상담지 확정 여부
  problems: [                // C6: DRP 목록
    { type, drug, sev, action }
  ],
  opinion: '',               // C7: 상담의견
  opinionEditing: false,     // C7: 편집 모드 여부
  submitted: false,          // C10: 최종 제출 여부
  consultCompleted: false    // 상담 완료 확정 여부 (c.status 동기화)
};

// 복약지도문 모달 단일 약물 데이터 소스 (dashboard_v2.html과 동기화 유지)
GM_MEDS = {
  rx:   [처방약 10종],                          // dashboard_v2.html rxDrugs와 동일
  otc:  [타이레놀 500mg, 판피린큐액],            // 자가 복용 일반의약품 (빈도 없음)
  supp: [오메가 3, 홍삼, 비타민 C, 미네랄 Ca·Mg] // 건강기능식품 (빈도 없음)
};
```

---

## 파일 구조

```
pharmaweb-prototype/
├── wellcheck_polypharmacy_prototype_preview.html   ← 단일 소스 파일
├── dashboard_v2.html                               ← C4 내 iframe으로 삽입되는 상담 기록지
├── PROGRESS.md                                     ← 이 문서
└── .claude/
    └── launch.json                                 ← 프리뷰 서버 설정
```

---

## 프리뷰 실행

```powershell
# 포트 3456으로 정적 서버 실행
npx serve -l 3456 .
```

브라우저에서 `http://localhost:3456/wellcheck_polypharmacy_prototype_preview.html` 접속  
→ `단골고객 현황` 리스트에서 환자 이름 클릭  
→ 개인 페이지 상단 `다제약물관리` 탭 클릭  
→ `1차` 서브탭 클릭

---

## 다음 작업 후보

| 항목 | 설명 |
|------|------|
| 2·3·4차 탭 구현 | 1차 탭과 동일한 구조, 회차별 차이 반영 |
| 수가 청구 화면 | 4차 완료 후 청구 단계 |
| 공단 승인 대기 상태 관리 | 동의서 → 승인 플로우 UI |
| 목록 ↔ 상태 연동 | ✅ 완료 — 상담 완료 확정 시 리스트 진행 상태 컬럼 자동 변경 |
| 데이터 지속성 | localStorage 기반 상태 저장 (새로고침 유지) |
