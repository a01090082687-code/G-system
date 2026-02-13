# GitHub Pages 배포 필수 파일 목록

## ✅ 필수 파일 (반드시 업로드)

### 1. 메인 파일
- **`index.html`** ⭐ (가장 중요!)
- **`style.css`** ⭐ (스타일 파일)

### 2. JavaScript 파일 (있는 경우)
- **`js/app.js`** (JavaScript 로직이 분리되어 있다면)

### 3. 이미지 파일 (있는 경우)
- **`images/`** 폴더 전체 (이미지 파일들이 있다면)

---

## ❌ 불필요한 파일 (업로드 안 해도 됨)

### Google Apps Script 관련
- `Code.gs` (Google Apps Script 파일, GitHub에 올릴 필요 없음)
  - 이 파일은 Google Sheets의 Apps Script 편집기에 직접 복사해서 사용

### 가이드 문서들 (선택사항)
- `*.md` 파일들 (가이드 문서, 올려도 되지만 필수는 아님)

### 로컬 실행 스크립트
- `로컬서버_실행.bat`
- `로컬서버_실행_NodeJS.bat`

### 유틸리티 파일
- `convert_excel_to_json.py` (로컬에서만 사용하는 유틸리티)

### 이전 백엔드 관련 (불필요)
- `frontend/` 폴더
- `static/` 폴더
- `data/` 폴더

---

## 📋 최소 필수 파일 구조

```
홈페이지/
├── index.html          ⭐ 필수
├── style.css           ⭐ 필수
├── js/
│   └── app.js         (JavaScript가 분리되어 있다면)
└── images/            (이미지가 있다면)
    └── ...
```

---

## 🚀 GitHub에 업로드하는 방법

### 방법 1: GitHub 웹사이트에서 직접 업로드

1. GitHub 저장소 페이지 접속
2. **Add file** → **Upload files** 클릭
3. 다음 파일들을 드래그 앤 드롭:
   - `index.html`
   - `style.css`
   - `js/app.js` (있는 경우)
   - `images/` 폴더 (있는 경우)
4. **Commit changes** 클릭

### 방법 2: Git 명령어 사용

```bash
# 필수 파일만 추가
git add index.html style.css

# JavaScript 파일이 있다면
git add js/app.js

# 이미지 폴더가 있다면
git add images/

# 커밋
git commit -m "Add essential files for GitHub Pages"

# 푸시
git push
```

---

## ✅ 확인 사항

업로드 후 확인:
- [ ] `index.html` 파일이 루트에 있음
- [ ] `style.css` 파일이 루트에 있음
- [ ] `index.html`에서 참조하는 모든 파일 경로가 올바름
- [ ] GitHub Pages 설정에서 소스 브랜치가 올바르게 설정됨

---

## 📝 참고사항

- **`Code.gs`는 GitHub에 올릴 필요 없습니다**
  - 이 파일은 Google Sheets의 Apps Script 편집기에 직접 복사해서 사용합니다
  - GitHub에 올려도 작동하지 않습니다

- **CDN 사용**: `index.html`에서 Tailwind, Chart.js, Font Awesome을 CDN으로 사용하므로 별도 설치 불필요

- **상대 경로**: `index.html`에서 `style.css`를 `href="style.css"`로 참조하므로 같은 폴더에 있어야 합니다
