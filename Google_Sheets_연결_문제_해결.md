# Google Sheets 연결 문제 해결 가이드

## 발생한 오류
"저장 중 오류가 발생했습니다. Google Sheets 연결을 확인해주세요."

## 해결 방법

### 1. Google Apps Script 배포 확인

1. **Google Apps Script 편집기 열기**
   - Google Drive에서 스프레드시트 열기
   - 확장 프로그램 → Apps Script 클릭

2. **웹 앱 배포 확인**
   - 상단 메뉴에서 `배포` → `웹 앱 배포 관리` 클릭
   - 현재 배포가 있는지 확인

3. **새로 배포하기 (필요한 경우)**
   - `배포` → `새 배포` 클릭
   - 유형 선택: **웹 앱** 선택
   - 설명: (선택사항) 버전 번호 등
   - **액세스 권한: "모든 사용자"** 선택 (매우 중요!)
   - 배포 클릭

4. **새 URL 복사**
   - 배포 후 생성된 URL 복사
   - 형식: `https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec`

5. **index.html에 URL 업데이트**
   - `index.html` 파일 열기
   - `GAS_URL` 변수 찾기 (약 548번째 줄)
   - 새 URL로 교체:
   ```javascript
   const GAS_URL = 'https://script.google.com/macros/s/새로운URL/exec';
   ```

### 2. 브라우저 개발자 도구로 확인

1. **개발자 도구 열기**
   - `F12` 키 누르기 (Mac: `Cmd+Option+I`)

2. **콘솔 탭 확인**
   - 저장 시도 시 다음 메시지 확인:
     - `💾 Google Sheets에 저장 시도: saveMedicineSurveyUrl {...}`
     - 성공: `✅ Google Sheets 저장 성공: saveMedicineSurveyUrl`
     - 실패: `❌ Google Sheets 저장 실패: ...`

3. **네트워크 탭 확인**
   - 네트워크 탭 열기
   - 저장 버튼 클릭
   - `exec`로 끝나는 요청 찾기
   - 상태 코드 확인:
     - `200`: 성공
     - `401`, `403`: 권한 문제
     - `404`: URL이 잘못됨
     - `500`: 서버 오류

### 3. Google Apps Script 코드 확인

`Code.gs` 파일이 올바르게 배포되었는지 확인:

1. **Apps Script 편집기에서 확인**
   - `doPost` 함수가 있는지 확인
   - `saveMedicineSurveyUrl` 케이스가 있는지 확인
   - `writeConfigKey` 함수가 있는지 확인

2. **실행 로그 확인**
   - Apps Script 편집기에서 `실행` → `doPost` 실행
   - 실행 로그에서 오류 확인

### 4. CORS 문제 해결

`Code.gs`의 `createJsonResponse` 함수에 CORS 헤더가 포함되어 있는지 확인:

```javascript
function createJsonResponse(obj) {
  var json = JSON.stringify(obj);
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
```

### 5. 빠른 테스트 방법

브라우저 주소창에 직접 입력하여 테스트:

```
https://script.google.com/macros/s/YOUR_GAS_URL/exec
```

- 정상: JSON 데이터가 표시됨
- 오류: 에러 메시지가 표시됨

### 6. 일반적인 문제와 해결책

| 문제 | 원인 | 해결책 |
|------|------|--------|
| 401/403 오류 | 권한 문제 | "모든 사용자"로 재배포 |
| 404 오류 | URL이 잘못됨 | GAS_URL 확인 및 업데이트 |
| CORS 오류 | 헤더 누락 | Code.gs의 createJsonResponse에 CORS 헤더 추가 |
| 500 오류 | 스크립트 오류 | Apps Script 실행 로그 확인 |

### 7. 여전히 문제가 있는 경우

1. **Google Apps Script를 완전히 새로 배포**
   - 기존 배포 삭제
   - Code.gs 파일 다시 확인
   - 새로 배포

2. **브라우저 캐시 삭제**
   - `Ctrl+Shift+Delete` (Mac: `Cmd+Shift+Delete`)
   - 캐시된 파일 삭제

3. **시크릿 모드로 테스트**
   - 캐시 문제 제외하고 테스트

4. **다른 브라우저로 테스트**
   - 브라우저별 차이 확인

## 수정된 코드

에러 메시지가 더 자세하게 표시되도록 개선되었습니다. 이제 브라우저 콘솔에서 정확한 오류 원인을 확인할 수 있습니다.
