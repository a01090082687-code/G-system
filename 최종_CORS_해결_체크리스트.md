# 🎯 CORS 오류 최종 해결 체크리스트

## ✅ 현재 상태 확인

### 1. Code.gs 파일 확인 완료 ✅

**`doOptions` 함수:**
```javascript
function doOptions(e) {
  // CORS 프리플라이트 요청 처리 (GitHub Pages 등 크로스 오리진 요청 허용)
  // Google Apps Script는 "모든 사용자"로 배포하면 자동으로 CORS가 처리됩니다.
  // 주의: ContentService에는 .addHeader() 메서드가 없습니다. 사용 시 에러가 발생하여 CORS 오류의 원인이 됩니다.
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}
```
✅ `addHeader` 제거됨

**`createJsonResponse` 함수:**
```javascript
function createJsonResponse(obj) {
  var json = JSON.stringify(obj);
  // Google Apps Script는 "모든 사용자"로 배포하면 자동으로 CORS가 처리됩니다
  // ContentService는 직접 CORS 헤더를 설정할 수 없지만(addHeader 없음), 배포 설정으로 해결됩니다
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
```
✅ `addHeader` 제거됨

### 2. index.html 파일 확인 완료 ✅

**`loadDataFromSheets` 함수:**
```javascript
return fetch(GAS_URL + '?t=' + Date.now(), {
    method: 'GET'
    // headers 속성 제거: Preflight 요청을 방지하기 위해
})
```
✅ `headers` 제거됨

---

## 🚀 최종 배포 단계

### 1단계: Google Apps Script에 코드 복사

1. Google Sheets 열기
2. **확장 프로그램** → **Apps Script** 클릭
3. `Code.gs` 파일 열기
4. **전체 코드 선택** (Ctrl+A) → **삭제**
5. 로컬 `Code.gs` 파일 내용을 **복사** → **붙여넣기**
6. **저장** (Ctrl+S)

### 2단계: 새 버전으로 배포 (매우 중요!)

⚠️ **단순히 저장만 하면 반영되지 않습니다. 반드시 새 버전으로 배포해야 합니다!**

1. Apps Script 편집기에서 **배포** → **배포 관리** 클릭
2. 기존 배포 옆의 **수정** 버튼 클릭 (연필 아이콘)
3. **버전**: **"새 버전"** 선택 ⚠️ 필수!
   - 기존 버전 번호를 선택하지 마세요
   - 반드시 **"새 버전"**을 선택해야 합니다
4. **설명**: "CORS Fix - Headers Removed" 입력 (선택사항)
5. **설정 확인**:
   - 실행할 함수: `doGet` 선택
   - 다음 사용자 인증 정보로 실행: **"나"** 선택
   - 액세스 권한이 있는 사용자: **"모든 사용자"** ⚠️ 필수!
6. **배포** 버튼 클릭
7. 권한 승인 (처음 한 번만)

### 3단계: 배포 URL 확인

배포 완료 후:
- 웹 앱 URL이 표시됩니다
- `index.html`의 `GAS_URL`과 비교:
  - ✅ **URL이 같으면**: 그대로 사용
  - ❌ **URL이 다르면**: `index.html` 업데이트 필요

### 4단계: GitHub에 푸시 (필요시)

`index.html`이 수정되었다면:
```bash
git add index.html
git commit -m "Fix CORS: Remove headers from fetch request"
git push
```

---

## ✅ 최종 확인 사항

### Code.gs 확인:
- [ ] `doOptions` 함수에 `addHeader` 없음
- [ ] `createJsonResponse` 함수에 `addHeader` 없음
- [ ] Google Apps Script에 코드 복사 완료
- [ ] 저장 완료

### 배포 확인:
- [ ] **"새 버전"**으로 배포됨 (기존 버전 X)
- [ ] **"액세스 권한이 있는 사용자"**가 **"모든 사용자"**로 설정됨
- [ ] 배포 URL 확인 완료

### index.html 확인:
- [ ] `loadDataFromSheets` 함수에서 `headers` 제거됨
- [ ] `GAS_URL`이 배포 URL과 일치함
- [ ] GitHub에 푸시 완료 (변경사항이 있다면)

---

## 🧪 테스트 방법

### 1. 브라우저 캐시 삭제
- 강제 새로고침: `Ctrl+Shift+R` (Windows) 또는 `Cmd+Shift+R` (Mac)
- 또는 시크릿 모드로 테스트

### 2. GitHub Pages 접속
- `https://a01090082687-code.github.io` 접속
- 개발자 도구 (F12) → Console 탭 확인

### 3. 확인할 메시지
- ✅ `✅ Google Sheets 데이터 로드 성공` 메시지 확인
- ✅ CORS 오류가 사라졌는지 확인
- ✅ 데이터가 정상적으로 표시되는지 확인

### 4. 다른 기기에서 테스트
- 핸드폰이나 다른 컴퓨터에서 접속
- 의약품 설문, 스트레칭 영상, 소음 배치도가 정상 표시되는지 확인

---

## 🎯 핵심 포인트 요약

1. ❌ **`addHeader()` 사용 금지** - Google Apps Script에서 지원하지 않음
2. ❌ **`headers` 속성 제거** - Preflight 요청을 방지하기 위해
3. ✅ **"새 버전"으로 배포** - 단순 저장만으로는 반영되지 않음
4. ✅ **"모든 사용자" 권한** - 필수 설정

---

## 예상 결과

- ✅ CORS 오류 해결
- ✅ Google Sheets 데이터 정상 로드
- ✅ 다른 기기에서도 정상 작동
- ✅ 의약품 설문, 스트레칭 영상, 소음 배치도 모두 정상 표시

---

**이제 "새 버전"으로 배포하고 테스트해보세요!** 🚀
