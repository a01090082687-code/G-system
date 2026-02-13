@echo off
chcp 65001 >nul
echo ========================================
echo G-SYSTEM 로컬 웹 서버 실행
echo ========================================
echo.

cd /d "%~dp0"

echo 현재 폴더: %CD%
echo.

echo Python이 설치되어 있는지 확인 중...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python 발견됨
    echo.
    echo 웹 서버를 시작합니다...
    echo 브라우저에서 http://localhost:8000 으로 접속하세요.
    echo.
    echo 서버를 종료하려면 Ctrl+C를 누르세요.
    echo.
    python -m http.server 8000
) else (
    echo [오류] Python이 설치되어 있지 않습니다.
    echo.
    echo 해결 방법:
    echo 1. Python 설치: https://www.python.org/downloads/
    echo 2. 또는 Node.js가 있다면: npx http-server -p 8000
    echo.
    pause
)
