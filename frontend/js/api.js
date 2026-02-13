/**
 * G-System API 통신 모듈
 * Python 백엔드와 통신하는 모든 함수를 여기에 모음
 */

const API_BASE_URL = window.location.origin; // 개발: http://localhost:8000, 프로덕션: 실제 도메인

// ========================================
// 인증 관련 API
// ========================================

/**
 * 관리자 로그인
 * @param {string} password - 관리자 비밀번호
 * @returns {Promise<{ok: boolean, session_id?: string}>}
 */
async function apiLogin(password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // 쿠키 포함
            body: JSON.stringify({ password })
        });
        return await response.json();
    } catch (error) {
        console.error('로그인 오류:', error);
        return { ok: false, message: '서버 연결 오류' };
    }
}

/**
 * 로그아웃
 * @returns {Promise<{ok: boolean}>}
 */
async function apiLogout() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error('로그아웃 오류:', error);
        return { ok: false };
    }
}

/**
 * 인증 상태 확인
 * @returns {Promise<{is_admin: boolean}>}
 */
async function apiCheckAuth() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error('인증 확인 오류:', error);
        return { is_admin: false };
    }
}

// ========================================
// 데이터 조회 API
// ========================================

/**
 * 모든 데이터 가져오기 (Google Sheets 연동)
 * @returns {Promise<Object>}
 */
async function apiGetAllData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/data`, {
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error('데이터 조회 오류:', error);
        return {};
    }
}

/**
 * 통계 데이터 가져오기
 * @returns {Promise<Object>}
 */
async function apiGetStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/stats`, {
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error('통계 조회 오류:', error);
        return { total_members: 0, counseled_rate: 0 };
    }
}

/**
 * 안전 명언 가져오기
 * @returns {Promise<{quote: string}>}
 */
async function apiGetSafetyQuote() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/safety-quote`);
        return await response.json();
    } catch (error) {
        console.error('명언 조회 오류:', error);
        return { quote: '안전은 하루아침에 이루어지지 않습니다.' };
    }
}

/**
 * 연도별 병원비 지출 데이터
 * @param {number} year - 연도
 * @returns {Promise<Object>}
 */
async function apiGetExpenses(year) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/expenses/${year}`, {
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error('병원비 조회 오류:', error);
        return { monthly: {}, details: [] };
    }
}

// ========================================
// 데이터 수정 API (관리자 전용)
// ========================================

/**
 * 집중관리 대상자 추가
 * @param {Object} member - 대상자 정보
 * @returns {Promise<{ok: boolean}>}
 */
async function apiAddMember(member) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(member)
        });
        if (response.status === 403) {
            return { ok: false, message: '관리자 권한이 필요합니다.' };
        }
        return await response.json();
    } catch (error) {
        console.error('대상자 추가 오류:', error);
        return { ok: false, message: '서버 연결 오류' };
    }
}

/**
 * 집중관리 대상자 수정
 * @param {number} memberIdx - 대상자 인덱스
 * @param {Object} member - 수정할 정보
 * @returns {Promise<{ok: boolean}>}
 */
async function apiUpdateMember(memberIdx, member) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/members/${memberIdx}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(member)
        });
        if (response.status === 403) {
            return { ok: false, message: '관리자 권한이 필요합니다.' };
        }
        return await response.json();
    } catch (error) {
        console.error('대상자 수정 오류:', error);
        return { ok: false, message: '서버 연결 오류' };
    }
}

/**
 * 집중관리 대상자 삭제
 * @param {number} memberIdx - 대상자 인덱스
 * @returns {Promise<{ok: boolean}>}
 */
async function apiDeleteMember(memberIdx) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/members/${memberIdx}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.status === 403) {
            return { ok: false, message: '관리자 권한이 필요합니다.' };
        }
        return await response.json();
    } catch (error) {
        console.error('대상자 삭제 오류:', error);
        return { ok: false, message: '서버 연결 오류' };
    }
}

/**
 * 상담 기록 업데이트
 * @param {Object} counseling - 상담 정보
 * @returns {Promise<{ok: boolean}>}
 */
async function apiUpdateCounseling(counseling) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/counseling`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(counseling)
        });
        if (response.status === 403) {
            return { ok: false, message: '관리자 권한이 필요합니다.' };
        }
        return await response.json();
    } catch (error) {
        console.error('상담 기록 업데이트 오류:', error);
        return { ok: false, message: '서버 연결 오류' };
    }
}

// ========================================
// 설문조사 API
// ========================================

/**
 * 설문조사 제출
 * @param {Object} survey - 설문 응답 데이터
 * @returns {Promise<{ok: boolean}>}
 */
async function apiSubmitSurvey(survey) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/survey`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(survey)
        });
        return await response.json();
    } catch (error) {
        console.error('설문 제출 오류:', error);
        return { ok: false, message: '서버 연결 오류' };
    }
}

/**
 * 설문조사 결과 조회 (관리자 전용)
 * @returns {Promise<{responses: Array}>}
 */
async function apiGetSurveyResults() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/survey/results`, {
            credentials: 'include'
        });
        if (response.status === 403) {
            return { responses: [], error: '관리자 권한이 필요합니다.' };
        }
        return await response.json();
    } catch (error) {
        console.error('설문 결과 조회 오류:', error);
        return { responses: [] };
    }
}
