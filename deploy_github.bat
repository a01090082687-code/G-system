@echo off
chcp 65001 > nul
echo ===================================================
echo   G-SYSTEM GitHub Pages 배포 자동화
echo ===================================================

:: 1. Git 초기화
if not exist .git (
    echo [1/5] Git 저장소 초기화 중...
    git init
) else (
    echo [1/5] 이미 Git 저장소가 있습니다.
)

:: 2. 모든 파일 추가
echo [2/5] 변경된 파일 스테이징...
git add .
if %ERRORLEVEL% neq 0 (
    echo 오류: 파일을 추가할 수 없습니다. Git이 설치되어 있는지 확인하세요.
    pause
    exit /b
)

:: 3. 커밋
echo [3/5] 커밋 생성 중...
git commit -m "Deploy G-SYSTEM V1 (Backend Connected)"
if %ERRORLEVEL% neq 0 (
    echo 커밋할 변경 사항이 없거나 오류가 발생했습니다. 계속 진행합니다.
)

:: 4. 브랜치 이름 변경
echo [4/5] 브랜치 이름 'main'으로 설정...
git branch -M main

:: 5. 안내 메시지
echo.
echo ===================================================
echo [!] 중요: 원격 저장소 연결이 필요합니다.
echo 아래 명령어를 복사하여 본인의 리포지토리 주소로 실행하세요:
echo.
echo git remote add origin https://github.com/사용자명/리포지토리명.git
echo git push -u origin main
echo ===================================================
echo.
pause
