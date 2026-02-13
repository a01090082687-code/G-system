# CORS 오류가 여전히 발생하는 경우 해결 방법

## 현재 상황

`Code.gs`를 수정하고 재배포했지만 여전히 CORS 오류가 발생합니다:
```
Access to fetch at 'https://script.google.com/...' from origin 'https://a01090082687-code.github.io' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## 가능한 원인

1. **배포 설정이 제대로 반영되지 않음**
2. **"모든 사용자" 권한이 제대로 설정되지 않음**
3. **브라우저 캐시 문제**
4. **배포 URL이 변경됨**

---

## 단계별 해결 방법

### 1단계: Google Apps Script 배포 설정 재확인

1. Google Sheets → **확장 프로그램** → **Apps Script**
2. **배포** → **배포 관리** 클릭
3. 현재 활성 배포 확인:
   - 배포 이름 클릭
   - **"구성"** 탭 확인
   - **"액세스 권한이 있는 사용자"** 확인:
     - ✅ **"모든 사용자"**로 설정되어 있어야 함
     - ❌ "나" 또는 "내 조직"이면 CORS 오류 발생

### 2단계: 완전히 새로 배포하기

기존 배포를 수정하는 대신 **완전히 새로 배포**:

1. **배포 관리** 화면에서
2. 기존 배포 옆의 **삭제** 버튼 클릭 (또는 그냥 새로 만들기)
3. **배포** → **새 배포** 클릭
4. **유형 선택**: **웹 앱** 선택
5. **설정**:
   - **설명**: "G-SYSTEM Backend" (아무거나)
   - **실행할 함수**: `doGet` 선택
   - **다음 사용자 인증 정보로 실행**: **"나"** 선택
   - **액세스 권한이 있는 사용자**: **"모든 사용자"** ⚠️ **매우 중요!**
6. **배포** 버튼 클릭
7. 권한 승인 (처음 한 번만)

### 3단계: 배포 URL 확인 및 업데이트

1. 배포 완료 후 **웹 앱 URL** 복사
2. `index.html` 파일에서 `GAS_URL` 확인:
   ```javascript
   const GAS_URL = 'https://script.google.com/macros/s/.../exec';
   ```
3. URL이 다르면 `index.html` 업데이트
4. GitHub에 푸시 (변경사항이 있다면)

### 4단계: 브라우저 캐시 완전 삭제

1. **강제 새로고침**: `Ctrl+Shift+R` (Windows) 또는 `Cmd+Shift+R` (Mac)
2. **캐시 삭제**:
   - `Ctrl+Shift+Delete` (Windows)
   - 캐시된 이미지 및 파일 삭제
3. **시크릿 모드로 테스트**:
   - 시크릿 창 열기
   - GitHub Pages 접속
   - 개발자 도구 (F12) → Console 확인

### 5단계: Code.gs 코드 재확인

Google Apps Script 편집기에서 `Code.gs` 파일 확인:

```javascript
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type')
    .addHeader('Access-Control-Max-Age', '86400');
}

function createJsonResponse(obj) {
  var json = JSON.stringify(obj);
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}
```

**저장** (Ctrl+S) 확인

---

## 빠른 테스트 방법

### 방법 1: URL 직접 접속

브라우저 주소창에 직접 입력:
```
https://script.google.com/macros/s/AKfycbwbgaXrWpSQaDVYd0pwSkBc1uD1f3dOhZuu4XGQMDi69ecDXz5CcUjzXVeSuZKVMHYBBA/exec
```

- ✅ **정상**: JSON 데이터가 표시됨
- ❌ **오류**: 에러 메시지가 표시됨

### 방법 2: curl 명령어로 테스트

터미널에서:
```bash
curl -H "Origin: https://a01090082687-code.github.io" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://script.google.com/macros/s/AKfycbwbgaXrWpSQaDVYd0pwSkBc1uD1f3dOhZuu4XGQMDi69ecDXz5CcUjzXVeSuZKVMHYBBA/exec
```

응답에 `Access-Control-Allow-Origin: *` 헤더가 있어야 합니다.

---

## 가장 중요한 확인 사항

### ✅ "모든 사용자" 권한 확인

배포 관리 화면에서:
- **"액세스 권한이 있는 사용자"**가 **"모든 사용자"**로 설정되어 있는지 확인
- "나" 또는 "내 조직"이면 **반드시 "모든 사용자"로 변경**

### ✅ 배포 버전 확인

- **"새 버전으로 배포"**를 클릭했는지 확인
- 또는 완전히 **새 배포**를 만들었는지 확인

---

## 문제가 계속되면

### 대안 1: Google Apps Script 배포 URL 변경

배포 URL이 변경되지 않았다면, 완전히 삭제하고 새로 배포하여 새로운 URL 생성

### 대안 2: 코드 재확인

Google Apps Script 편집기에서:
1. `Code.gs` 파일 열기
2. `doOptions` 함수가 있는지 확인
3. `addHeader` 메서드가 올바르게 사용되었는지 확인
4. 저장 후 재배포

---

## 체크리스트

- [ ] Google Apps Script에서 `Code.gs` 파일이 올바르게 저장됨
- [ ] `doOptions` 함수에 CORS 헤더가 있음
- [ ] `createJsonResponse` 함수에 CORS 헤더가 있음
- [ ] 웹 앱으로 배포됨
- [ ] **"액세스 권한이 있는 사용자"**가 **"모든 사용자"**로 설정됨
- [ ] 새 버전으로 배포됨 (또는 완전히 새 배포)
- [ ] 브라우저 캐시 삭제 후 테스트함
- [ ] 시크릿 모드로 테스트함
- [ ] URL 직접 접속 시 JSON 데이터가 표시됨

---

**가장 중요한 것은 "모든 사용자" 권한 설정입니다!** 이 설정이 올바르지 않으면 CORS 오류가 계속 발생합니다.
