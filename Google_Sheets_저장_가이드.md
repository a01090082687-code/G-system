# Google Sheets 저장 기능 완전 가이드

## 개요

관리자 모드에서 수정한 모든 데이터가 **자동으로 Google Sheets에 저장**되도록 구현되어 있습니다. 이 가이드에서는 저장 기능이 어떻게 작동하는지, 그리고 Google Apps Script를 어떻게 설정해야 하는지 설명합니다.

## 저장되는 데이터 항목

다음 항목들이 관리자 모드에서 수정 시 자동으로 Google Sheets에 저장됩니다:

1. **집중관리 명단** (`saveMembers`)
2. **유해인자 관리** (`saveRisks`)
3. **소음 측정 데이터** (`saveNoise`)
4. **혁신 성과** (`saveInnovations`)
5. **응급연락망** (`saveEmergencyContacts`)
6. **스트레칭 영상** (`saveStretchingVideos`)
7. **의약품 설문조사 URL** (`saveMedicineSurveyUrl`)
8. **배치도면 이미지** (`saveFloorplans`)
9. **병원비 지출** (`saveExpenses`)

## Google Apps Script 설정 방법

### 1단계: Google 스프레드시트 준비

1. **Google Drive**에서 새 스프레드시트 생성
2. 다음 시트 탭을 생성 (이름 정확히 일치해야 함):

| 시트 이름 | 설명 |
|-----------|------|
| **Members** | 집중관리 명단 |
| **Risks** | 유해인자 관리 |
| **Noise** | 소음 측정 데이터 |
| **Expenses** | 병원비 지출 |
| **Innovations** | 혁신 성과 |
| **Config** | 설정 데이터 (응급연락망, 스트레칭 영상, 설문조사 URL, 배치도면 등) |

### 2단계: Google Apps Script 코드 배포

1. 스프레드시트에서 **확장 프로그램** → **Apps Script** 클릭
2. 기본 생성된 코드를 모두 삭제
3. 프로젝트의 **`Code.gs`** 파일 내용을 복사하여 붙여넣기
4. 저장 (Ctrl+S 또는 Cmd+S)

### 3단계: 웹 앱으로 배포

1. Apps Script 편집기에서 **배포** → **새 배포** 클릭
2. **유형 선택** → **웹 앱** 선택
3. **설명**: (선택사항) "G-System Backend v1.0" 등
4. **실행할 함수**: `doGet` 선택
5. **액세스 권한**: **"모든 사용자"** 선택 (매우 중요!)
6. **배포** 버튼 클릭
7. 권한 승인 (처음 한 번만)
   - "권한 확인" 클릭
   - Google 계정 선택
   - "고급" → "안전하지 않은 페이지로 이동" 클릭
   - "허용" 클릭

### 4단계: 배포 URL 복사

1. 배포 완료 후 **웹 앱 URL**이 표시됨
2. 형식: `https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec`
3. 이 URL을 복사

### 5단계: index.html에 URL 설정

1. `index.html` 파일 열기
2. 약 548번째 줄의 `GAS_URL` 변수 찾기:
   ```javascript
   const GAS_URL = '';
   ```
3. 복사한 URL을 붙여넣기:
   ```javascript
   const GAS_URL = 'https://script.google.com/macros/s/YOUR_URL_HERE/exec';
   ```
4. 저장

## Code.gs 파일 구조

### 주요 함수 설명

#### `doGet(e)`
- **역할**: 데이터 읽기 (GET 요청)
- **반환**: 모든 데이터를 JSON으로 반환
- **사용**: 페이지 로드 시 데이터 가져오기

#### `doPost(e)`
- **역할**: 데이터 쓰기 (POST 요청)
- **파라미터**: 
  - `action`: 저장할 데이터 타입 (예: 'saveMembers', 'saveRisks')
  - `payload`: 저장할 데이터
- **반환**: `{ ok: true/false, message: '' }`

#### `doOptions(e)`
- **역할**: CORS 프리플라이트 요청 처리
- **중요**: 크로스 오리진 요청을 허용하기 위해 필요

### 저장 함수들

#### `writeMembers(ss, arr)`
- **시트**: Members
- **열**: name, dept, risk, note, isIntensiveCare, counseling

#### `writeRisks(ss, arr)`
- **시트**: Risks
- **열**: type, dept, health, action, level

#### `writeNoise(ss, arr)`
- **시트**: Noise
- **열**: factory, processName, processDept, measuredDb, standardDb, result, protectionGear

#### `writeInnovations(ss, arr)`
- **시트**: Innovations
- **열**: category, title, desc, date, imageUrl, savings

#### `writeExpenses(ss, year, monthlyExpenses)`
- **시트**: Expenses
- **열**: year, month, name, amount, hospital

#### `writeConfigKey(ss, key, value)`
- **시트**: Config
- **형식**: key-value 쌍
- **사용**: 
  - `emergencyContacts`: 응급연락망 배열
  - `stretchingVideos`: 스트레칭 영상 배열
  - `medicine_survey_url`: 설문조사 URL 문자열
  - `floorplans`: 배치도면 객체 `{factory1: "...", factory2: "..."}`

## 저장 동작 확인 방법

### 1. 브라우저 콘솔 확인

1. **F12** 키로 개발자 도구 열기
2. **콘솔** 탭 선택
3. 관리자 모드에서 데이터 수정
4. 다음 메시지 확인:
   ```
   💾 Google Sheets에 저장 시도: saveMembers [...]
   ✅ Google Sheets 저장 성공: saveMembers
   ```

### 2. Google Sheets에서 확인

1. Google 스프레드시트 열기
2. 해당 시트 탭 확인
3. 데이터가 저장되었는지 확인

### 3. 네트워크 탭 확인

1. 개발자 도구의 **네트워크** 탭 열기
2. 데이터 수정 시도
3. `exec`로 끝나는 POST 요청 확인
4. 상태 코드가 **200**인지 확인

## 문제 해결

### 저장이 안 되는 경우

1. **GAS_URL 확인**
   - `index.html`의 `GAS_URL`이 올바른지 확인
   - 빈 문자열이 아닌지 확인

2. **권한 확인**
   - Google Apps Script가 "모든 사용자"로 배포되었는지 확인
   - "나"로 설정되어 있으면 다른 사용자가 저장할 수 없음

3. **브라우저 콘솔 확인**
   - 에러 메시지 확인
   - `❌ Google Sheets 저장 실패:` 메시지 확인

4. **Google Apps Script 로그 확인**
   - Apps Script 편집기에서 **실행** → **실행 로그** 확인
   - 오류가 있으면 메시지 확인

### 일반적인 오류

| 오류 | 원인 | 해결책 |
|------|------|--------|
| HTTP 401/403 | 권한 문제 | "모든 사용자"로 재배포 |
| HTTP 404 | URL 오류 | GAS_URL 확인 및 업데이트 |
| CORS 오류 | 헤더 누락 | Code.gs의 `doOptions` 및 `createJsonResponse` 확인 |
| HTTP 500 | 스크립트 오류 | Apps Script 실행 로그 확인 |

## 저장 흐름도

```
관리자 모드에서 데이터 수정
    ↓
APP_DATA 또는 다른 데이터 객체 업데이트
    ↓
apiPost('saveXXX', data) 호출
    ↓
fetch(GAS_URL, { method: 'POST', ... })
    ↓
Google Apps Script의 doPost() 실행
    ↓
writeXXX() 함수로 Google Sheets에 저장
    ↓
{ ok: true } 반환
    ↓
1초 후 loadDataFromSheets() 호출
    ↓
최신 데이터로 화면 갱신
```

## 중요 사항

1. **모든 저장은 비동기로 처리됨**
   - 저장 완료를 기다리지 않고 화면이 즉시 업데이트됨
   - 저장 실패 시 에러 메시지 표시

2. **저장 후 자동 새로고침**
   - 저장 성공 시 1초 후 자동으로 데이터를 다시 불러옴
   - 다른 사용자들이 최신 데이터를 볼 수 있도록 함

3. **에러 처리**
   - 저장 실패 시 콘솔에 상세한 에러 로그 출력
   - 사용자에게 알림 메시지 표시

4. **데이터 형식**
   - 배열 데이터는 JSON.stringify()로 변환되어 저장
   - 객체 데이터도 JSON.stringify()로 변환
   - 문자열은 그대로 저장

## 테스트 체크리스트

- [ ] Google Apps Script가 웹 앱으로 배포됨
- [ ] 배포 시 "모든 사용자" 권한 설정됨
- [ ] `index.html`의 `GAS_URL`이 올바르게 설정됨
- [ ] Google Sheets에 필요한 시트 탭이 모두 생성됨
- [ ] 브라우저 콘솔에서 저장 성공 메시지 확인됨
- [ ] Google Sheets에서 데이터가 실제로 저장됨
- [ ] 다른 기기에서도 저장된 데이터가 표시됨
