# doGet 함수 수정 가이드

## doGet 함수는 어디에 있나요?

`doGet` 함수는 **`Code.gs`** 파일 안에 있습니다.

---

## 수정 방법

### 1단계: Code.gs 파일 열기

1. Google Sheets 열기
2. **확장 프로그램** → **Apps Script** 클릭
3. 왼쪽 파일 목록에서 **`Code.gs`** 클릭
4. 파일이 열리면 코드가 보입니다

### 2단계: doGet 함수 찾기

`Code.gs` 파일에서 다음 부분을 찾으세요:

```javascript
function doGet(e) {
  try {
    var result = getAllData();
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ error: err.toString() });
  }
}
```

이 함수는 보통 파일의 **15번째 줄** 근처에 있습니다.

### 3단계: 수정하기

`doGet` 함수를 수정하려면:

1. 함수 안의 코드를 원하는 대로 변경
2. **저장** 버튼 클릭 (Ctrl+S)
3. **배포** → **새 배포** (또는 **배포 관리** → **수정**)
4. **배포** 버튼 클릭하여 변경사항 반영

---

## 배포 화면에서 "실행할 함수" 선택하기

배포 화면에서 **"실행할 함수"** 드롭다운을 클릭하면:

- `doGet` ← **이것을 선택하세요** (데이터 읽기용)
- `doPost` (데이터 저장용, 선택하지 않음)
- 기타 함수들...

**중요**: 
- **웹 앱 배포**에서는 `doGet`을 선택합니다
- `doGet`은 GitHub Pages에서 데이터를 가져올 때 호출됩니다

---

## doGet 함수의 역할

`doGet` 함수는:
- GitHub Pages에서 Google Sheets 데이터를 **읽어올 때** 호출됩니다
- `getAllData()` 함수를 실행하여 모든 데이터를 가져옵니다
- JSON 형식으로 데이터를 반환합니다

---

## 현재 doGet 함수 코드 (참고)

```javascript
function doGet(e) {
  try {
    var result = getAllData();
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ error: err.toString() });
  }
}
```

이 함수는:
1. `getAllData()`를 호출하여 모든 데이터를 가져옴
2. `createJsonResponse()`를 사용하여 JSON 형식으로 반환
3. 오류가 발생하면 에러 메시지를 반환

---

## 수정 예시

### 예시 1: 특정 데이터만 반환하고 싶을 때

```javascript
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var members = readMembers(ss);
    return createJsonResponse({ members: members });
  } catch (err) {
    return createJsonResponse({ error: err.toString() });
  }
}
```

### 예시 2: 쿼리 파라미터로 필터링하고 싶을 때

```javascript
function doGet(e) {
  try {
    var action = e.parameter.action;
    if (action === 'members') {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var members = readMembers(ss);
      return createJsonResponse({ members: members });
    }
    var result = getAllData();
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ error: err.toString() });
  }
}
```

---

## 주의사항

1. **함수 이름 변경 금지**: `doGet`이라는 이름은 Google Apps Script에서 특별한 의미가 있으므로 변경하면 안 됩니다
2. **저장 후 배포 필수**: 코드를 수정한 후에는 반드시 **배포**해야 변경사항이 적용됩니다
3. **배포 시 "모든 사용자" 선택**: 배포 화면에서 **"액세스 권한이 있는 사용자"**를 **"모든 사용자"**로 설정해야 GitHub Pages에서 접근 가능합니다

---

## 빠른 체크리스트

- [ ] `Code.gs` 파일 열기
- [ ] `doGet` 함수 찾기 (15번째 줄 근처)
- [ ] 코드 수정
- [ ] 저장 (Ctrl+S)
- [ ] 배포 → 새 배포 (또는 배포 관리 → 수정)
- [ ] "실행할 함수": `doGet` 선택
- [ ] "액세스 권한이 있는 사용자": **"모든 사용자"** 선택
- [ ] 배포 버튼 클릭

---

이제 `doGet` 함수를 수정할 수 있습니다!
