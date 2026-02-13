# Google Sheets 설정 단계별 가이드

## 1단계: Google 스프레드시트 생성 및 데이터 붙여넣기

### 1-1. 새 Google 스프레드시트 만들기
1. [Google Drive](https://drive.google.com) 접속
2. **새로 만들기** → **Google 스프레드시트** 클릭
3. 스프레드시트 이름 지정 (예: "G-System 데이터")

### 1-2. 시트 탭 생성 및 데이터 붙여넣기

**각 시트를 하나씩 만들어서 데이터를 붙여넣으세요:**

#### Members 시트 만들기
1. 하단 시트 탭에서 **"시트1"** 우클릭 → **이름 변경** → `Members` 입력
2. `Google_Sheets_복사용_데이터.txt` 파일에서 Members 섹션의 헤더와 데이터 복사
3. A1 셀에 붙여넣기 (자동으로 열이 나뉩니다)

#### Risks 시트 만들기
1. 하단 **+** 버튼 클릭하여 새 시트 추가
2. 시트 이름을 `Risks`로 변경
3. Risks 섹션의 헤더와 데이터 복사 → A1 셀에 붙여넣기

#### Noise 시트 만들기
1. 새 시트 추가 → 이름을 `Noise`로 변경
2. Noise 섹션의 헤더와 데이터 복사 → A1 셀에 붙여넣기

#### Expenses 시트 만들기
1. 새 시트 추가 → 이름을 `Expenses`로 변경
2. Expenses 섹션의 헤더와 데이터 복사 → A1 셀에 붙여넣기

#### Innovations 시트 만들기
1. 새 시트 추가 → 이름을 `Innovations`로 변경
2. Innovations 섹션의 헤더와 데이터 복사 → A1 셀에 붙여넣기

#### Config 시트 만들기
1. 새 시트 추가 → 이름을 `Config`로 변경
2. Config 섹션의 헤더와 데이터 복사 → A1 셀에 붙여넣기

**시트 이름 확인** (대소문자 정확히 일치해야 함):
- ✅ `Members`
- ✅ `Risks`
- ✅ `Noise`
- ✅ `Expenses`
- ✅ `Innovations`
- ✅ `Config`

---

## 2단계: Google Apps Script 코드 배포

### 2-1. Apps Script 편집기 열기
1. 스프레드시트 메뉴에서 **확장 프로그램** → **Apps Script** 클릭
2. 새 탭이 열리며 코드 편집기가 나타납니다

### 2-2. Code.gs 파일 내용 붙여넣기
1. 편집기에서 기본 생성된 코드(`function myFunction() {}`)를 **모두 삭제**
2. 프로젝트의 **`Code.gs`** 파일 내용을 **전체 복사**
3. 편집기에 **전체 붙여넣기**
4. **저장** (Ctrl+S 또는 Cmd+S, 또는 상단 저장 아이콘)

### 2-3. 웹 앱으로 배포
1. 상단 메뉴에서 **배포** → **새 배포** 클릭
2. **유형 선택** 옆의 **⚙️ 설정** 클릭
3. **유형**: **웹 앱** 선택
4. **설명**: (선택사항) "G-System Backend v1.0" 등
5. **실행할 함수**: `doGet` 선택
6. **액세스 권한**: **"모든 사용자"** 선택 (매우 중요!)
7. **배포** 버튼 클릭

### 2-4. 권한 승인 (처음 한 번만)
1. **권한 확인** 버튼 클릭
2. Google 계정 선택
3. **"이 앱이 확인되지 않았습니다"** 경고가 나오면:
   - **고급** 클릭
   - **안전하지 않은 페이지로 이동** 클릭
4. **허용** 클릭

### 2-5. 배포 URL 복사
1. 배포 완료 후 **웹 앱 URL**이 표시됩니다
2. 형식: `https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec`
3. 이 URL을 **복사**해 둡니다

---

## 3단계: index.html에 URL 설정

### 3-1. index.html 파일 열기
1. 프로젝트 폴더에서 `index.html` 파일 열기

### 3-2. GAS_URL 찾기 및 업데이트
1. `index.html` 파일에서 `GAS_URL` 검색 (Ctrl+F 또는 Cmd+F)
2. 약 548번째 줄에 다음과 같은 코드가 있습니다:
   ```javascript
   const GAS_URL = 'https://script.google.com/macros/s/AKfycbwHEFK5PcLh_RG2tycyOqwan0OE9uos3wZZ-nc2GPoHv2l6C53TZ0pxIlebOqu2gcHCeg/exec';
   ```
3. 기존 URL을 지우고 **2-5에서 복사한 새 URL**로 교체:
   ```javascript
   const GAS_URL = '여기에_복사한_URL_붙여넣기';
   ```
4. **저장**

---

## 4단계: 테스트

### 4-1. 브라우저에서 확인
1. `index.html` 파일을 브라우저에서 열기
2. **F12** 키로 개발자 도구 열기
3. **콘솔** 탭 확인
4. 다음 메시지가 보이면 성공:
   ```
   📡 Google Sheets 데이터 로드 시도: https://script.google.com/...
   ✅ Google Sheets 데이터 로드 성공: {members: [...], ...}
   ```

### 4-2. 관리자 모드에서 저장 테스트
1. 관리자 모드로 로그인 (비밀번호: 8078)
2. 아무 데이터나 수정 후 저장
3. 콘솔에서 다음 메시지 확인:
   ```
   💾 Google Sheets에 저장 시도: saveXXX {...}
   ✅ Google Sheets 저장 성공: saveXXX
   ```

### 4-3. Google Sheets에서 확인
1. Google 스프레드시트를 다시 열기
2. 각 시트 탭에서 데이터가 저장되었는지 확인

---

## 문제 해결

### 데이터가 안 보이는 경우
1. **시트 이름 확인**: 대소문자 정확히 일치하는지 확인
2. **헤더 확인**: 첫 번째 행이 정확한지 확인
3. **브라우저 콘솔 확인**: 에러 메시지 확인

### 저장이 안 되는 경우
1. **GAS_URL 확인**: 올바른 URL인지 확인
2. **권한 확인**: "모든 사용자"로 배포되었는지 확인
3. **브라우저 콘솔 확인**: 에러 메시지 확인

### 여전히 문제가 있는 경우
- `Google_Sheets_연결_문제_해결.md` 파일 참고

---

## 완료 체크리스트

- [ ] Google 스프레드시트 생성 완료
- [ ] 6개 시트 모두 생성 및 데이터 붙여넣기 완료
- [ ] Apps Script 코드 배포 완료
- [ ] "모든 사용자" 권한으로 배포 완료
- [ ] 배포 URL 복사 완료
- [ ] index.html의 GAS_URL 업데이트 완료
- [ ] 브라우저에서 데이터 로드 확인 완료
- [ ] 관리자 모드에서 저장 테스트 완료

---

## 다음 단계

모든 설정이 완료되면:
1. GitHub Pages에 업로드
2. 다른 사용자들이 접속하여 데이터 확인
3. 관리자 모드에서 데이터 수정 시 자동으로 Google Sheets에 저장됨
