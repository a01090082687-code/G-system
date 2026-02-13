# Google Sheets 연동 확인 가이드

## 문제: 다른 사용자들이 데이터를 볼 수 없는 경우

GitHub Pages를 통해 홈페이지를 열었을 때, 관리자 모드로 데이터를 업데이트해도 다른 사용자들이 볼 수 없는 경우 다음을 확인하세요.

## 1. Google Apps Script 배포 확인

### 필수 확인 사항:
1. **웹 앱으로 배포되었는지 확인**
   - Google Apps Script 편집기에서 `배포` → `새 배포` → `웹 앱` 선택

2. **액세스 권한 확인**
   - **반드시 "모든 사용자"로 설정**되어 있어야 합니다
   - "나"로 설정되어 있으면 다른 사용자가 접근할 수 없습니다

3. **배포 URL 확인**
   - 배포 후 생성된 URL이 `index.html`의 `GAS_URL`에 정확히 입력되어 있는지 확인
   - 형식: `https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec`

## 2. 브라우저 콘솔 확인

### 개발자 도구 열기:
- **Chrome/Edge**: `F12` 또는 `Ctrl+Shift+I` (Mac: `Cmd+Option+I`)
- **Safari**: `Cmd+Option+I` (개발자 메뉴 활성화 필요)

### 확인할 로그:
1. **데이터 로드 성공 시:**
   ```
   📡 Google Sheets 데이터 로드 시도: https://script.google.com/...
   ✅ Google Sheets 데이터 로드 성공: {members: [...], ...}
   ```

2. **데이터 로드 실패 시:**
   ```
   ❌ Google Sheets 데이터 로드 실패: Error: ...
   ⚠️ Google Sheets 연결 실패: ...
   ```

3. **데이터 저장 시:**
   ```
   💾 Google Sheets에 저장 시도: saveFloorplans {...}
   ✅ Google Sheets 저장 성공: saveFloorplans
   ```

## 3. Google Sheets 데이터 확인

1. Google Sheets 파일을 직접 열어서 확인:
   - **Config** 시트에 `floorplans`, `stretchingVideos`, `medicine_survey_url` 키가 있는지 확인
   - 값이 JSON 형식으로 올바르게 저장되어 있는지 확인

2. 데이터 형식 예시:
   - `floorplans`: `{"factory1":"data:image/png;base64,...","factory2":"data:image/png;base64,..."}`
   - `stretchingVideos`: `[{"id":1,"title":"...","videoUrl":"..."}]`
   - `medicine_survey_url`: `https://docs.google.com/forms/d/...`

## 4. CORS 문제 해결

### 문제 증상:
- 콘솔에 `CORS policy` 오류가 표시됨
- 네트워크 탭에서 요청이 실패함

### 해결 방법:
1. Google Apps Script 배포 시 **"모든 사용자"** 권한 확인
2. `Code.gs`의 `doOptions` 함수가 올바르게 설정되어 있는지 확인:
   ```javascript
   function doOptions(e) {
     return ContentService
       .createTextOutput('')
       .setHeader('Access-Control-Allow-Origin', '*')
       .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
       .setHeader('Access-Control-Allow-Headers', 'Content-Type')
       .setHeader('Access-Control-Max-Age', '86400');
   }
   ```

## 5. 자동 새로고침 확인

- 페이지가 열려있는 동안 **10초마다** 자동으로 Google Sheets에서 데이터를 가져옵니다
- 관리자가 데이터를 저장하면, 다른 사용자들은 최대 10초 내에 자동으로 최신 데이터를 볼 수 있습니다

## 6. 테스트 방법

1. **관리자 컴퓨터에서:**
   - 관리자 모드로 로그인
   - 배치도/스트레칭 영상/의약품 조사 링크 추가 및 저장
   - 브라우저 콘솔에서 "✅ Google Sheets 저장 성공" 메시지 확인

2. **다른 사용자 컴퓨터/핸드폰에서:**
   - GitHub Pages URL로 접속
   - 브라우저 콘솔에서 "✅ Google Sheets 데이터 로드 성공" 메시지 확인
   - 최대 10초 기다린 후 데이터가 표시되는지 확인

## 7. 문제 해결 체크리스트

- [ ] Google Apps Script가 웹 앱으로 배포되어 있음
- [ ] 배포 시 "액세스 권한: 모든 사용자"로 설정됨
- [ ] `index.html`의 `GAS_URL`이 올바른 배포 URL로 설정됨
- [ ] Google Sheets의 Config 시트에 데이터가 저장되어 있음
- [ ] 브라우저 콘솔에 에러가 없음
- [ ] 네트워크 탭에서 Google Sheets 요청이 성공함 (200 OK)

## 8. 여전히 문제가 있는 경우

1. **Google Apps Script를 다시 배포:**
   - 기존 배포 삭제 후 새로 배포
   - 새 URL을 `index.html`에 업데이트

2. **브라우저 캐시 삭제:**
   - `Ctrl+Shift+Delete` (Mac: `Cmd+Shift+Delete`)
   - 캐시된 이미지 및 파일 삭제

3. **시크릿 모드로 테스트:**
   - 캐시 문제를 제외하고 테스트

4. **다른 브라우저로 테스트:**
   - 브라우저별 차이 확인
