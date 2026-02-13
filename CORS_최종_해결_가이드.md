# CORS 오류 최종 해결 가이드

## 문제 확인

콘솔에 다음과 같은 오류가 나타납니다:
```
Access to fetch at 'https://script.google.com/...' from origin 'https://a01090082687-code.github.io' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## 해결 방법: Code.gs 수정 및 재배포

### 1단계: Code.gs 파일 수정 완료 ✅

`Code.gs` 파일에 CORS 헤더를 추가했습니다:
- `doOptions` 함수에 CORS 헤더 추가
- `createJsonResponse` 함수에 CORS 헤더 추가
- `addHeader` 메서드 사용 (올바른 방법)

### 2단계: Google Apps Script에 코드 복사

1. Google Sheets 열기
2. **확장 프로그램** → **Apps Script** 클릭
3. `Code.gs` 파일 열기
4. **전체 코드를 선택** (Ctrl+A) → **삭제**
5. 로컬 `Code.gs` 파일 내용을 **복사** → **붙여넣기**
6. **저장** (Ctrl+S)

### 3단계: 웹 앱 재배포 (매우 중요!)

1. Apps Script 편집기에서 **배포** → **배포 관리** 클릭
2. 기존 배포 옆의 **수정** 버튼 클릭 (연필 아이콘)
3. **새 버전으로 배포** 선택
4. **설정 확인**:
   - 실행할 함수: `doGet` (또는 자동 선택됨)
   - 액세스 권한이 있는 사용자: **"모든 사용자"** ⚠️ 필수!
   - 실행 주체: "나"
5. **배포** 버튼 클릭

### 4단계: 배포 URL 확인

- 배포 후 표시되는 웹 앱 URL 확인
- `index.html`의 `GAS_URL`과 일치하는지 확인
- URL이 변경되지 않았으면 그대로 사용

### 5단계: 테스트

1. GitHub Pages 사이트 접속: `https://a01090082687-code.github.io`
2. 브라우저 개발자 도구 열기 (F12)
3. **Console** 탭 확인
4. 다음 메시지가 보이면 성공:
   ```
   ✅ Google Sheets 데이터 로드 성공
   ```
5. CORS 오류가 사라졌는지 확인

---

## 중요 사항

### "모든 사용자" 권한이 필수입니다!

Google Apps Script 웹 앱을 배포할 때:
- ❌ "나" 또는 "내 조직" → CORS 오류 발생
- ✅ **"모든 사용자"** → CORS 오류 해결

### addHeader vs setHeader

Google Apps Script에서는:
- ❌ `setHeader()` → 작동하지 않음
- ✅ `addHeader()` → 올바른 방법

---

## 빠른 체크리스트

- [ ] `Code.gs` 파일에 `doOptions` 함수가 있고 CORS 헤더가 있음
- [ ] `Code.gs` 파일에 `createJsonResponse` 함수에 CORS 헤더가 있음
- [ ] Google Apps Script에 수정된 코드가 저장됨
- [ ] 웹 앱으로 재배포됨
- [ ] 배포 시 **"모든 사용자"** 권한 선택됨
- [ ] 브라우저에서 CORS 오류가 사라짐
- [ ] `✅ Google Sheets 데이터 로드 성공` 메시지 확인

---

## 문제가 계속되면

### 1. 배포 버전 확인
- Apps Script에서 **배포 관리** → **활성 배포** 확인
- 최신 버전이 배포되어 있는지 확인

### 2. 브라우저 캐시 삭제
- `Ctrl+Shift+Delete` (Windows)
- 캐시 삭제 후 다시 테스트
- 시크릿 모드로 테스트

### 3. URL 직접 테스트
브라우저 주소창에 직접 입력:
```
https://script.google.com/macros/s/AKfycbwbgaXrWpSQaDVYd0pwSkBc1uD1f3dOhZuu4XGQMDi69ecDXz5CcUjzXVeSuZKVMHYBBA/exec
```
- 정상: JSON 데이터가 표시됨
- 오류: 에러 메시지가 표시됨

---

이제 `Code.gs`를 Google Apps Script에 복사하고 재배포하시면 CORS 오류가 해결됩니다!
