# modal_send_v2.html — Figma 일치화 + 이관 작업 기록

> 이 문서는 세션 인수인계용 기록이다. 디자인 스펙 자체(재사용 가능한 규칙)는
> `~/.claude/skills/wellcheck-prototype/resources/tokens.md`에 있고, 이 문서는
> "무엇을 했고 지금 어디까지 왔는지"만 기록한다.

## 대상 파일

- 작업 원본: `C:\Users\USER\pharmaweb-prototype\modal_send_v2.html` (+ `reminder.js`, `reminder.css`)
- 확인용 사본: `C:\Users\USER\Desktop\pharmaweb-prototype\modal_send_v2.html`
  (파일 맨 끝에 `openModal();` 임시 실행 코드가 붙어있음 — 확인 끝나면 그 블록만 삭제)
- 두 저장소 모두 `git remote`가 `m2choo/pharmaweb-prototype`으로 동일

## 이번 세션에서 한 일 (Figma 실제 화면과 대조해서 코드 수정)

Figma 마스터 가이드 파일(`Hg2fE9R6yId239HK6vTau8`, "웰체크 스프린트 스토리보드 v.1.10.0~")의
**"1.17 - 웰체크 약국 서비스"** 페이지에 있는 실제 "복약 상담 전송" 모달 목업
(node `22340:34320`/`34399`/`34753`/`34826`, `24082:37283`, `19386:35075`)을 기준으로
`modal_send_v2.html`을 실측 대조하며 다음을 고쳤다. 상세 스펙 값은 전부 `tokens.md`의
"스텝형 모달" 섹션에 반영되어 있음.

- 색상/폰트 토큰화 (하드코딩 hex 제거, `--color-*` 변수 사용)
- 모달 사이즈: 고정 `86vh` → `min-height:723px` + `max-height:90vh`, 넘칠 때만
  `modal-body` 내부 스크롤(얇은 스크롤바)
- 스텝 탭: 번호 배지(채움/아웃라인 색 수정), 라벨 색상·크기, 탭 줄 간격/보더 위치
- 고객 정보 행 배경색 제거(파란 배경 하드코딩이었음), 아바타 크기/색 수정
- 조제 내역 표: 6컬럼 → 3컬럼(NO/약명/복용일) + 편집·삭제, 헤더 색상 실측 반영
- 약품 편집/추가 폼: 개별 텍스트 필드 → 검색창 1개 + 용량/횟수/일수 컴팩트 입력
- 검색 드롭다운(고객 검색) 카드 재설계: 결과 건수 헤더, 아바타, 상태 태그
- 하단 버튼: 좌측 "Step X/4" 라벨 제거, 가운데 정렬, 구분선 제거, "취소" 버튼 제거
  (Step1은 "처방전 없이 상담" + "다음"만)
- `reminder.js`/`reminder.css`(Step2 복약 알림)에 남아있던 구버전 하드코딩(`#2563EB` 등)도
  토큰으로 교체, 죽은 코드(`rm-step-lbl`) 제거
- `goStep2()` 중복 정의 버그 수정 (다음 버튼이 Step2로 안 넘어가던 원인 — `reminder.js`의
  정상 버전이 `modal_send_v2.html` 안의 구버전에 덮어써지고 있었음)

**의도적으로 Figma와 다르게 둔 것** (버그 아님, 확인 완료)
- "복약 알림" 스텝(Step2) 자체와 우측 Puzzle AI 어시스턴트 패널 — Figma엔 없는
  이 프로토타입만의 추가 기능
- 처방전 원본을 좌측 상시 패널이 아니라 "이미지 보기" 버튼+팝업으로 처리 —
  조제내역 표 폭이 좁아지는 걸 피하기 위한 의도적 선택

## Figma 이관 (`wellcheck-prototype-migration` 스킬) — 진행 중, 중단 지점

### 확인된 0절 값
- HTML 소스: `C:\Users\USER\pharmaweb-prototype\modal_send_v2.html`
- 임시 작업 위치: 워킹 파일 `ICLchS9dDEoct2rVWswLjx`("웰체크 피그마 추명이"), 페이지/노드 `469:648`("ㄴ이관test")
- 추가 참고자료 없음, 최종 이관 목적지 미정(임시 위치에 완성 후 나중에 결정)

### 6절 분기 판별 결과
- 진입점 2종: `openModal()`(빈 검색) / `openModalAtStep2(data)`(고객·처방전 사전 선택 —
  별도 프레임 아니라 01-1-a의 진입 변형으로 처리)
- Step1: 매칭(`selectCustomer`) vs 미매칭 직접추가(`isNew:true`) → **프레임 분리** (01-1-a/01-1-b)
- Step2(복약 알림): `isNew`면 스킵(분기 아님) → 프레임 하나(01-2), 스킵 조건만 Description에 명시
- Step3(복약지도 전송): `isNew`일 때 앱 가입 안내 문단 추가 → **프레임 분리** (01-3-a/01-3-b)
- Step4(전송 확인): `isNew`일 때 휴대폰 입력란+동의 체크박스+안내문 통째로 추가 →
  **프레임 분리** (01-4-a/01-4-b)

### 막힌 지점 — 크로스파일 컴포넌트 재사용 불가
- 마스터 가이드 파일(`Hg2fE9R6yId239HK6vTau8`)이 **팀 라이브러리로 게시되어 있지 않아서**,
  작업 파일(`ICLchS9dDEoct2rVWswLjx`)에서 그 안의 버튼/태그 컴포넌트를 `importComponentByKeyAsync`로
  가져올 수 없음을 실측 확인함(에러: `Component with key "..." not found`).
- 이건 Figma 플러그인 API의 근본 제약(게시 안 된 파일의 컴포넌트는 다른 파일에서 import 불가)이라
  코드로 우회 불가.
- **해결 방법 논의 중**: 마스터 가이드 파일을 팀 라이브러리로 게시하기로 방향 잡음
  (Assets 패널 → Publish). 게시는 실제 Figma 컴포넌트/스타일만 대상이라 스프린트 목업
  프레임들은 영향 없음 — 사용자가 안전성 확인 후 게시 진행 예정.
- **다음 세션에서 이어할 일**: 마스터 가이드 게시 완료 여부 확인 →
  게시됐으면 작업 파일 Assets 패널에서 해당 라이브러리 활성화 →
  `importComponentByKeyAsync`로 버튼/태그 등 인스턴스화 재시도 →
  확인된 6절 분기 구조대로 프레임 6~7개(01-1-a/b, 01-2, 01-3-a/b, 01-4-a/b) 조립 →
  화면 번호 라벨 부착 + code-based Description 작성 → 마스터 가이드 baseline 페이지
  하위로 최종 이관(목적지는 아직 미정, 사용자 확인 필요).

## 참고 — Figma MCP 연결 이슈
세션 중간에 `claude.ai Figma` 커넥터 OAuth 토큰이 만료되어 재인증 필요했음
(claude.ai 웹의 Settings → Connectors에서 Figma 재연결로 해결). 만약 다음 세션에서도
Figma 도구 호출이 "재인증 필요" 에러를 내면 같은 방법으로 재연결.
