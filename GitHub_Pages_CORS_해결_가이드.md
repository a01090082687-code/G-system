# GitHub Pages CORS 오류 해결 가이드

## 문제 상황

GitHub Pages (`https://a01090082687-code.github.io`)에서 Google Apps Script로 요청할 때 CORS 오류가 발생합니다:
```
Access to fetch at 'https://script.google.com/...' from origin 'https://a01090082687-code.github.io' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## 해결 방법: Google Apps Script 재배포

### 1단계: Code.gs 파일 확인 및 업데이트

1. Google Sheets 열기
2. **확장 프로그램** → **Apps Script** 클릭
3. `Code.gs` 파일이 열립니다
4. 현재 파일의 내용을 확인하고, 아래 내용과 일치하는지 확인:

```javascript
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    .setHeader('Access-Control-Max-Age', '86400');
}
```

5. **저장** 버튼 클릭 (Ctrl+S)

### 2단계: 웹 앱으로 배포 (매우 중요!)

1. Apps Script 편집기에서 **배포** → **새 배포** 클릭
   - 또는 기존 배포가 있다면 **배포 관리** → **수정** 클릭

2. **유형 선택**:
   - **웹 앱** 선택

3. **설정**:
   - **설명**: "G-SYSTEM Backend" (아무거나 가능)
   - **실행할 함수**: `doGet` 선택
   - **액세스 권한**: **"모든 사용자"** 선택 ⚠️ **매우 중요!**
   - **실행 주체**: "나" 선택

4. **배포** 버튼 클릭

5. 권한 승인 (처음 한 번만):
   - "권한 확인" 클릭
   - Google 계정 선택
   - "고급" → "안전하지 않은 페이지로 이동" 클릭
   - "허용" 클릭

### 3단계: 배포 URL 확인 및 복사

1. 배포 완료 후 **웹 앱 URL**이 표시됩니다
2. 형식: `https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec`
3. 이 URL을 **복사**합니다

### 4단계: index.html에 URL 업데이트

1. GitHub 저장소에서 `index.html` 파일 열기
2. 약 548번째 줄의 `GAS_URL` 변수 찾기:
   ```javascript
   const GAS_URL = 'https://script.google.com/macros/s/AKfycbzmhsrMJu9eZhZ35bnHL76Gow4vMm6qFS0L5P72OYyd2kMdObiF-tcnuhwM1Bg5UiL8RA/exec';
   ```
3. 복사한 **새로운 배포 URL**로 교체
4. **커밋 및 푸시**:
   ```bash
   git add index.html
   git commit -m "Update GAS_URL for CORS fix"
   git push
   ```

### 5단계: GitHub Pages 새로고침

1. GitHub Pages 사이트 접속: `https://a01090082687-code.github.io`
2. **브라우저 캐시 삭제**:
   - `Ctrl+Shift+Delete` (Windows)
   - `Cmd+Shift+Delete` (Mac)
   - 또는 **시크릿 모드**로 접속
3. 페이지 새로고침: `Ctrl+F5` (강제 새로고침)

### 6단계: 확인

1. 브라우저 개발자 도구 열기 (`F12`)
2. **Console** 탭 확인
3. 다음 메시지가 보이면 성공:
   - `✅ Google Sheets 데이터 로드 성공`
   - CORS 오류가 사라짐

---

## 문제가 계속되면 확인할 사항

### 1. 배포 권한 확인
- **"액세스 권한: 모든 사용자"**로 설정되어 있는지 확인
- "나" 또는 "내 조직"으로 설정되어 있으면 CORS 오류 발생

### 2. 배포 버전 확인
- Apps Script에서 **배포 관리** → **활성 배포** 확인
- 최신 버전이 배포되어 있는지 확인
- 필요시 **새 버전으로 배포** 클릭

### 3. URL 확인
- `index.html`의 `GAS_URL`이 올바른지 확인
- URL 끝에 `/exec`가 있는지 확인

### 4. 브라우저 캐시
- 강제 새로고침: `Ctrl+F5`
- 시크릿 모드로 테스트
- 다른 브라우저로 테스트

---

## 빠른 체크리스트

- [ ] `Code.gs`에 `doOptions` 함수가 있음
- [ ] `doOptions`에 `Access-Control-Allow-Origin: *` 헤더가 있음
- [ ] Google Apps Script가 **웹 앱으로 배포**됨
- [ ] 배포 시 **"액세스 권한: 모든 사용자"** 선택됨
- [ ] `index.html`의 `GAS_URL`이 최신 배포 URL과 일치함
- [ ] GitHub에 변경사항 푸시됨
- [ ] 브라우저 캐시 삭제 후 테스트함

---

## 추가 팁

### 배포 URL이 변경되지 않는 경우

Google Apps Script는 같은 프로젝트에서 새로 배포해도 URL이 변경되지 않을 수 있습니다. 이 경우:
1. 기존 배포를 **삭제**하지 마세요
2. **새 버전으로 배포**만 하면 됩니다
3. URL은 그대로 사용하면 됩니다

### 테스트 방법

브라우저 주소창에 직접 입력하여 테스트:
```
https://script.google.com/macros/s/YOUR_GAS_URL/exec
```

- 정상: JSON 데이터가 표시됨
- 오류: 에러 메시지가 표시됨

---

이 가이드를 따라하시면 CORS 오류가 해결됩니다!
