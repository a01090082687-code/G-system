# G-System 프론트엔드-백엔드 연동 완료 가이드

## ✅ 완료된 작업

### 1. 프론트엔드 서빙 설정
- ✅ `index.html`이 FastAPI 루트(`/`)에서 자동으로 서빙됨
- ✅ CSS 파일 경로를 `/css/style.css`로 변경 (백엔드 정적 파일 서빙)
- ✅ PWA Manifest 연결 완료

### 2. 데이터 통신 로직 변경
- ✅ `GAS_URL` 직접 호출 제거 → Python 백엔드 API (`/api/data`) 사용
- ✅ `loadDataFromSheets()` 함수를 비동기(`async/await`)로 변경하여 백엔드 API 호출
- ✅ `apiPost()` 함수를 백엔드 API 엔드포인트로 매핑
- ✅ "데이터 불러오는 중..." 로딩 화면 유지

### 3. 핵심 로직 Python 이관
- ✅ **병원비 절감액 계산** (`/api/savings/calculate`)
  - 협력병원(W병원, 우리허브병원) 병원비의 10% 할인액을 pandas로 계산
  - 혁신성과 절감액과 합산하여 총 절감액 반환
- ✅ **안전 명언** (`/api/safety-quote`) - Python `random` 모듈 사용
- ✅ **대시보드 통계** (`/api/stats`) - pandas로 집중관리 대상자 통계 계산

## 🚀 실행 방법

### 1. 백엔드 서버 시작
```bash
# 가상환경 활성화 (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# 또는 배치 파일 사용
.\run_server.bat
```

서버가 `http://localhost:8000`에서 실행됩니다.

### 2. 브라우저에서 접속
브라우저에서 `http://localhost:8000`으로 접속하면 자동으로 `index.html`이 표시됩니다.

## 📋 API 엔드포인트 목록

### 데이터 조회
- `GET /api/data` - 모든 데이터 가져오기 (Google Sheets 연동)
- `GET /api/stats` - 대시보드 통계 (총 인원, 상담 이수율 등)
- `GET /api/savings/calculate` - 누적 예산 절감액 계산
- `GET /api/safety-quote` - 안전 명언 (랜덤)
- `GET /api/expenses/{year}` - 연도별 병원비 지출 데이터

### 인증
- `POST /api/auth/login` - 관리자 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/check` - 인증 상태 확인

### 데이터 저장 (관리자 전용)
- `POST /api/members` - 집중관리 대상자 추가
- `PUT /api/members/{member_idx}` - 집중관리 대상자 수정
- `DELETE /api/members/{member_idx}` - 집중관리 대상자 삭제
- `POST /api/counseling` - 상담 기록 업데이트
- `POST /api/survey` - 의약품 설문조사 제출
- `GET /api/survey/results` - 설문조사 결과 조회

## 🔧 주요 변경사항

### 프론트엔드 (`index.html`)
1. **API 베이스 URL**: `const API_BASE_URL = window.location.origin;`
2. **비동기 데이터 로딩**: `async function loadDataFromSheets()`
3. **절감액 계산**: 백엔드 `/api/savings/calculate` 호출
4. **안전 명언**: 백엔드 `/api/safety-quote` 호출

### 백엔드 (`backend/app.py`)
1. **절감액 계산 API**: pandas를 사용한 효율적인 계산
2. **정적 파일 서빙**: CSS, JS, 이미지 등 자동 서빙
3. **CORS 설정**: 프론트엔드와의 통신 허용

## ⚠️ 주의사항

1. **Google Sheets 연동**: 백엔드의 `GAS_URL` 환경 변수가 올바르게 설정되어 있어야 합니다.
2. **세션 관리**: 관리자 로그인은 쿠키 기반 세션으로 관리됩니다.
3. **비동기 처리**: 프론트엔드의 여러 함수가 `async/await`로 변경되었습니다.

## 🐛 문제 해결

### CSS가 로드되지 않는 경우
- `css/style.css` 파일이 프로젝트 루트에 있는지 확인
- 브라우저 개발자 도구(F12)에서 네트워크 탭 확인

### API 호출 실패
- 백엔드 서버가 실행 중인지 확인 (`http://localhost:8000/api/health`)
- 브라우저 콘솔에서 에러 메시지 확인
- CORS 오류인 경우 백엔드 CORS 설정 확인

### 데이터가 표시되지 않는 경우
- Google Sheets 연동이 정상인지 확인
- 백엔드 로그에서 에러 메시지 확인
- `GAS_URL` 환경 변수 확인

## 📝 다음 단계

1. 추가 API 엔드포인트 구현 (혁신성과, 응급연락망 등)
2. 에러 핸들링 강화
3. 로딩 상태 개선
4. 오프라인 지원 (Service Worker)
