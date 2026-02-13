# 랭킹 시스템 CORS 오류 수정 완료 ✅

## 수정 내용

### 1. 프론트엔드 (health-catch-game.html) ✅

**수정 전:**
```javascript
fetch(GAS_URL, {
    method: 'POST',
    body: JSON.stringify({...})
})
```

**수정 후:**
```javascript
fetch(GAS_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain;charset=utf-8'  // Preflight 방지
    },
    body: JSON.stringify({...})
})
```

### 2. 백엔드 (Code.gs) ✅

**doPost 함수 개선:**
- `text/plain`과 `application/json` 모두 처리 가능하도록 수정
- 안전한 JSON 파싱 및 에러 처리 추가

**doOptions 함수:**
- 이미 올바르게 구현되어 있음 (CORS 프리플라이트 처리)

**createJsonResponse 함수:**
- 이미 올바르게 구현되어 있음 (JSON 응답 반환)

---

## 적용 방법

### 1단계: Code.gs 업데이트

1. Google Sheets → **확장 프로그램** → **Apps Script**
2. `Code.gs` 파일 열기
3. **전체 코드 선택** (Ctrl+A) → **삭제**
4. 로컬 `Code.gs` 파일 내용을 **복사** → **붙여넣기**
5. **저장** (Ctrl+S)

### 2단계: Google Apps Script 재배포

1. **배포** → **배포 관리** 클릭
2. 기존 배포 옆의 **수정** 버튼 클릭
3. **새 버전으로 배포** 선택
4. **설정 확인**:
   - 실행할 함수: `doGet`
   - 액세스 권한이 있는 사용자: **"모든 사용자"** ⚠️ 필수!
5. **배포** 버튼 클릭

### 3단계: health-catch-game.html 확인

- 파일이 이미 업데이트되었습니다
- GitHub에 푸시하면 적용됩니다

---

## 수정된 코드 상세

### 프론트엔드 변경사항

**랭킹 등록 함수 (`registerRanking`):**
- `Content-Type: text/plain;charset=utf-8` 헤더 추가
- Preflight 요청 방지

### 백엔드 변경사항

**doPost 함수:**
```javascript
function doPost(e) {
  // text/plain으로 받은 데이터를 JSON으로 파싱
  var params = {};
  try {
    if (e && e.postData && e.postData.contents) {
      var contentType = e.postData.type || '';
      var contents = e.postData.contents;
      
      // text/plain 또는 application/json 모두 처리
      if (contentType.indexOf('application/json') !== -1 || contentType.indexOf('text/plain') !== -1) {
        params = JSON.parse(contents);
      } else {
        // 기본적으로 JSON 파싱 시도
        params = JSON.parse(contents);
      }
    }
  } catch (err) {
    return createJsonResponse({ ok: false, message: 'Invalid JSON: ' + err.toString() });
  }
  
  var action = params.action;
  var payload = params.payload || {};
  // ... 나머지 로직
}
```

---

## 테스트 방법

1. **게임 플레이** → 점수 획득
2. **게임 오버** → 랭킹 표시 확인
3. **이름 입력** → "랭킹 등록" 버튼 클릭
4. **성공 메시지 확인** → "랭킹 등록 완료!" 표시
5. **랭킹 새로고침 확인** → 자신의 이름과 점수가 표시되는지 확인
6. **Google Sheets 확인** → GameRankings 시트에 데이터 저장 확인

---

## 문제 해결

### 여전히 오류가 발생하는 경우

1. **브라우저 캐시 삭제**
   - 강제 새로고침: `Ctrl+Shift+R`
   - 시크릿 모드로 테스트

2. **Google Apps Script 재배포 확인**
   - "새 버전"으로 배포되었는지 확인
   - "모든 사용자" 권한 확인

3. **브라우저 콘솔 확인**
   - 개발자 도구 (F12) → Console 탭
   - 오류 메시지 확인

4. **GAS_URL 확인**
   - `health-catch-game.html`의 `GAS_URL`이 올바른지 확인

---

## 예상 결과

- ✅ CORS 오류 해결
- ✅ 랭킹 등록 성공
- ✅ 모든 직원들이 문제없이 랭킹 등록 가능
- ✅ Google Sheets에 데이터 정상 저장

---

**이제 Code.gs를 재배포하면 랭킹 등록이 정상 작동합니다!** 🎉
