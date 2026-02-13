# 🚨 CORS 오류 최종 해결 가이드

## 원인 진단
사용자님께서 `Code.gs`에 `addHeader`를 추가하셨다고 하셨는데, **Google Apps Script의 `ContentService`는 `addHeader` 메서드를 지원하지 않습니다.** 
이로 인해 스크립트가 실행 중 **에러**를 일으키고, 에러 페이지가 반환되면서 CORS 헤더가 누락되어 브라우저에서 CORS 오류로 표시되는 것입니다.

## ✅ 해결 방법

### 1단계: Google Apps Script 수정 (Code.gs)
웹 브라우저의 전용 편집기(Extensions > Apps Script)에서 `Code.gs`를 열고, `doOptions`와 `createJsonResponse` 함수를 **아래 코드로 정확히 교체**하세요. (`addHeader` 제거)

```javascript
function doOptions(e) {
  // CORS 프리플라이트 요청 처리
  // Google Apps Script는 "모든 사용자" 배포 시 자동으로 헤더를 처리합니다.
  // addHeader()를 사용하면 에러가 발생하므로 사용하지 마세요.
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function createJsonResponse(obj) {
  var json = JSON.stringify(obj);
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// 나머지 함수들(doGet, doPost, writeMembers 등)은 그대로 유지하거나 로컬 파일(Code.gs) 내용을 복사해 넣으세요.
```

### 2단계: "새 버전"으로 배포 (가장 중요!)
코드를 수정했더라도 단순히 저장만 하면 반영되지 않습니다. 반드시 **새 버전**을 생성해야 합니다.

1.  Apps Script 화면 우측 상단 **[배포]** 클릭 -> **[배포 관리]** 선택
2.  상단 연필 아이콘(수정) 클릭
3.  **버전**: "새 버전" 선택 (기존 버전 번호 X)
4.  **설명**: "CORS Fix Version 2" 입력
5.  **액세스 권한이 있는 사용자**: 반드시 **[모든 사용자]** 선택
6.  **[배포]** 클릭

### 3단계: URL 확인
배포 후 나오는 "웹 앱 URL"이 기존과 같은지 확인하세요.
- URL이 바뀌었다면: `index.html` 파일의 `GAS_URL`을 수정하고 GitHub에 푸시하세요.
- URL이 같다면: 그대로 두셔도 됩니다.

### 4단계: 테스트
브라우저 캐시를 비우거나 시크릿 창에서 다시 접속해보세요.
`addHeader` 관련 에러가 사라지면서 정상적으로 데이터를 불러올 것입니다.

---

## 요약
- ❌ `addHeader(...)` 사용 금지 (스크립트 에러 원인)
- ✅ `ContentService`는 기본 기능만 사용
- ✅ 반드시 **"새 버전"**으로 배포
- ✅ **"모든 사용자"** 권한 확인
