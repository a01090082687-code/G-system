# CORS 오류 해결 방법

## 문제 상황

콘솔에 다음과 같은 오류가 나타납니다:
```
Access to fetch at 'https://script.google.com/...' from origin 'null' has been blocked by CORS policy
```

**원인**: 로컬 파일(`file:///C:/Users/...`)에서 Google Apps Script에 접근하려고 할 때 브라우저의 보안 정책 때문에 차단됩니다.

## 해결 방법 (3가지)

### 방법 1: 로컬 웹 서버 실행 (가장 빠름) ⭐ 추천

#### Python이 설치되어 있는 경우:
1. 터미널(CMD 또는 PowerShell) 열기
2. 프로젝트 폴더로 이동:
   ```bash
   cd C:\Users\user\Desktop\홈페이지
   ```
3. Python 웹 서버 실행:
   ```bash
   python -m http.server 8000
   ```
4. 브라우저에서 접속:
   ```
   http://localhost:8000
   ```

#### Node.js가 설치되어 있는 경우:
1. 터미널에서 프로젝트 폴더로 이동
2. 간단한 서버 실행:
   ```bash
   npx http-server -p 8000
   ```
3. 브라우저에서 `http://localhost:8000` 접속

### 방법 2: GitHub Pages에 배포 (실제 사용 환경)

1. GitHub 저장소 생성
2. 파일 업로드 (`index.html`, `style.css`, `Code.gs` 등)
3. Settings → Pages → Source 선택
4. `https://사용자명.github.io/저장소명` 으로 접속

### 방법 3: Google Apps Script CORS 헤더 확인

`Code.gs` 파일에 CORS 헤더가 올바르게 설정되어 있는지 확인:

```javascript
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .setHeader('Access-Control-Max-Age', '86400');
}

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

---

## 빠른 해결 (지금 바로)

**Python이 있다면:**

1. **터미널 열기** (Windows 키 + R → `cmd` 입력)
2. **프로젝트 폴더로 이동**:
   ```
   cd C:\Users\user\Desktop\홈페이지
   ```
3. **웹 서버 실행**:
   ```
   python -m http.server 8000
   ```
4. **브라우저에서 접속**:
   ```
   http://localhost:8000
   ```

이렇게 하면 `origin 'null'` 대신 `http://localhost:8000`으로 접속되어 CORS 오류가 해결됩니다!

---

## 추가 확인 사항

### 이미지 파일 오류
```
GET noise-floorplan-1factory.png:1 file:///... net::ERR_FILE_NOT_FOUND
```

이 오류는 배치도면 이미지 파일이 없어서 발생합니다. 
- 관리자 모드에서 배치도면을 업로드하면 자동으로 생성됩니다.
- 또는 `images` 폴더에 `noise-floorplan-1factory.png` 파일을 추가하세요.

---

## 확인 방법

로컬 서버로 접속한 후:
1. 콘솔에서 CORS 오류가 사라졌는지 확인
2. `✅ Google Sheets 데이터 로드 성공` 메시지 확인
3. 페이지가 정상적으로 작동하는지 확인
