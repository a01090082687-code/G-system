// 알림: Netlify 대시보드 > Site Settings > Forms > Form notifications 에서 이메일 알림을 설정해야 데이터가 전송됩니다.

// ===== 건강상담 일정 데이터 (V3.8 NEW) =====
const CONSULTATION_SCHEDULE = {
    currentFactory: 1,
    factory1: [
        "김민수", "이영희", "박철수", "정수진", "최동욱",
        "강미영", "조성호", "윤지혜", "한상철", "신동욱",
        "장민재", "임수진", "황지민", "오태양", "배수현",
        "서준호", "권나영", "송재윤", "유하늘", "문정호"
    ],
    factory2: [
        "김태희", "이준서", "박지민", "정하늘", "최민석",
        "강서연", "조윤아", "윤재현", "한지우", "신민주",
        "장수빈", "임서연", "황태민", "오승환", "배하은",
        "서유나", "권지훈", "송민지", "유재석", "문소희"
    ]
};

// 공장 선택
function showFactory(factoryNum) {
    CONSULTATION_SCHEDULE.currentFactory = factoryNum;

    // 탭 스타일 업데이트
    document.querySelectorAll('.factory-tab').forEach(tab => {
        tab.classList.remove('active', 'bg-purple-500', 'text-white');
        tab.classList.add('bg-slate-100', 'text-slate-600');
    });
    const activeTab = document.getElementById(`factory-tab-${factoryNum}`);
    activeTab.classList.add('active', 'bg-purple-500', 'text-white');
    activeTab.classList.remove('bg-slate-100', 'text-slate-600');

    // 검색어 초기화
    document.getElementById('schedule-search').value = '';

    // 리스트 렌더링
    renderSchedule();
}

// 실시간 검색
function searchSchedule() {
    renderSchedule();
}

// 명단 렌더링
function renderSchedule() {
    const currentFactory = CONSULTATION_SCHEDULE.currentFactory;
    const list = currentFactory === 1 ? CONSULTATION_SCHEDULE.factory1 : CONSULTATION_SCHEDULE.factory2;
    const searchTerm = document.getElementById('schedule-search').value.toLowerCase();

    // 검색 필터링
    const filtered = list.filter(name => name.toLowerCase().includes(searchTerm));

    // 카운트 업데이트
    document.getElementById('schedule-count').textContent = `${filtered.length}명`;

    // 리스트 HTML 생성
    const html = filtered.length > 0
        ? filtered.map((name, index) => `
                    <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-purple-50 transition-colors">
                        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-xs">
                            ${index + 1}
                        </div>
                        <div class="font-bold text-slate-700">${name}</div>
                        <div class="ml-auto text-xs text-slate-500">${currentFactory}공장</div>
                    </div>
                `).join('')
        : '<p class="text-center text-slate-400 py-8 text-sm font-bold">검색 결과가 없습니다.</p>';

    document.getElementById('schedule-list').innerHTML = html;
}

// ===== V3.9: 관리자 편집 가능한 시스템 설정 데이터 =====
let SYSTEM_CONFIG = {
    // 응급 연락망 (실제 데이터 기반)
    emergencyContacts: [
        {
            id: 1,
            category: "응급구조",
            name: "119 응급구조",
            phone: "119",
            description: "중증 응급상황 즉시 신고",
            icon: "fa-ambulance",
            color: "red",
            order: 1
        },
        {
            id: 2,
            category: "내부",
            name: "박기태 선임 (응급의료 최우선)",
            phone: "010-9008-2687",
            description: "사고 발생 시 즉시 유선 보고 필수",
            icon: "fa-user-md",
            color: "red",
            order: 2
        },
        {
            id: 3,
            category: "내부",
            name: "조철제 팀장 (비상 총괄)",
            phone: "010-7557-6887",
            description: "비상 총괄 관리",
            icon: "fa-user-tie",
            color: "orange",
            order: 3
        },
        {
            id: 4,
            category: "내부",
            name: "박원석 (안전관리)",
            phone: "010-8495-1318",
            description: "안전관리 담당",
            icon: "fa-shield-alt",
            color: "blue",
            order: 4
        },
        {
            id: 5,
            category: "내부",
            name: "김수민 (안전관리)",
            phone: "010-6564-5027",
            description: "안전관리 담당",
            icon: "fa-shield-alt",
            color: "blue",
            order: 5
        }
    ],

    // 협력병원 (MOU) - 실제 데이터 기반
    hospitals: [
        {
            id: 1,
            name: "우리허브병원",
            phone: "053-716-6330",
            emergencyPhone: "053-716-6330",
            address: "대구시 현풍/구지",
            mapUrl: "https://map.kakao.com",
            website: "",
            specialty: "일반 공상 및 응급 상황",
            note: "우선 이송, 자정(24:00) 마감, 거리 가깝고 진료가 빠른 병원",
            isMOU: true,
            priority: 1,
            color: "teal",
            estimatedTime: "20분",
            benefits: "입원·외래 진료비(비급여) 우대, 건강검진 시 수면료(진정료) 우대"
        },
        {
            id: 2,
            name: "W병원",
            phone: "053-550-5000",
            emergencyPhone: "053-550-5000",
            address: "대구시 달서구",
            mapUrl: "https://map.kakao.com",
            website: "",
            specialty: "수지접합 전문",
            note: "24시간 수술 가능, 절단 사고 등 중증 외상 시 이송",
            isMOU: true,
            priority: 2,
            color: "blue",
            estimatedTime: "35분",
            benefits: "입원·외래 진료비(비급여) 우대, 미가입자 대상"
        },
        {
            id: 3,
            name: "대구푸른병원",
            phone: "053-471-2800",
            emergencyPhone: "053-471-2800",
            address: "",
            mapUrl: "https://map.kakao.com",
            website: "",
            specialty: "화상 전문센터",
            note: "화학 화상(질산) 등 화상 전문, 24시간 운영",
            isMOU: false,
            priority: 3,
            color: "orange",
            estimatedTime: "40분"
        },
        {
            id: 4,
            name: "영남대병원",
            phone: "053-623-8001",
            emergencyPhone: "053-623-8001",
            address: "",
            mapUrl: "https://map.kakao.com",
            website: "",
            specialty: "권역응급센터",
            note: "심정지·의식불명 등 중증 응급 시, 즉시 119 신고 후 이송",
            isMOU: false,
            priority: 4,
            color: "red",
            estimatedTime: "45분"
        },
        {
            id: 5,
            name: "봄이오는안과",
            phone: "053-614-7778",
            emergencyPhone: "053-614-7778",
            address: "",
            mapUrl: "https://map.kakao.com",
            website: "",
            specialty: "안구 손상 (이물질)",
            note: "18:30 진료 종료",
            isMOU: false,
            priority: 5,
            color: "purple",
            estimatedTime: "20분"
        }
    ],

    // 상담 일정 (기존 데이터 확장)
    consultationScheduleDetailed: [
        { id: 1, name: "김민수", factory: 1, date: "2026-02-15", time: "14:00", location: "보건실", status: "예정", memo: "" },
        { id: 2, name: "이영희", factory: 1, date: "2026-02-16", time: "10:30", location: "보건실", status: "예정", memo: "" },
        { id: 3, name: "박철수", factory: 1, date: "2026-02-17", time: "15:00", location: "보건실", status: "예정", memo: "" },
        { id: 4, name: "정수진", factory: 1, date: "2026-02-18", time: "11:00", location: "보건실", status: "예정", memo: "" },
        { id: 5, name: "최동욱", factory: 1, date: "2026-02-19", time: "13:30", location: "보건실", status: "예정", memo: "" },
        { id: 6, name: "강미영", factory: 1, date: "2026-02-20", time: "14:30", location: "보건실", status: "예정", memo: "" },
        { id: 7, name: "조성호", factory: 1, date: "2026-02-21", time: "10:00", location: "보건실", status: "예정", memo: "" },
        { id: 8, name: "윤지혜", factory: 1, date: "2026-02-22", time: "15:30", location: "보건실", status: "예정", memo: "" },
        { id: 9, name: "한상철", factory: 1, date: "2026-02-24", time: "11:30", location: "보건실", status: "예정", memo: "" },
        { id: 10, name: "신동욱", factory: 1, date: "2026-02-25", time: "13:00", location: "보건실", status: "예정", memo: "" },
        { id: 11, name: "장민재", factory: 1, date: "2026-02-26", time: "14:00", location: "보건실", status: "예정", memo: "" },
        { id: 12, name: "임수진", factory: 1, date: "2026-02-27", time: "10:30", location: "보건실", status: "예정", memo: "" },
        { id: 13, name: "황지민", factory: 1, date: "2026-02-28", time: "15:00", location: "보건실", status: "예정", memo: "" },
        { id: 14, name: "오태양", factory: 1, date: "2026-03-03", time: "11:00", location: "보건실", status: "예정", memo: "" },
        { id: 15, name: "배수현", factory: 1, date: "2026-03-04", time: "13:30", location: "보건실", status: "예정", memo: "" },
        { id: 16, name: "서준호", factory: 1, date: "2026-03-05", time: "14:30", location: "보건실", status: "예정", memo: "" },
        { id: 17, name: "권나영", factory: 1, date: "2026-03-06", time: "10:00", location: "보건실", status: "예정", memo: "" },
        { id: 18, name: "송재윤", factory: 1, date: "2026-03-07", time: "15:30", location: "보건실", status: "예정", memo: "" },
        { id: 19, name: "유하늘", factory: 1, date: "2026-03-10", time: "11:30", location: "보건실", status: "예정", memo: "" },
        { id: 20, name: "문정호", factory: 1, date: "2026-03-11", time: "13:00", location: "보건실", status: "예정", memo: "" },
        { id: 21, name: "김태희", factory: 2, date: "2026-02-15", time: "14:00", location: "보건실", status: "예정", memo: "" },
        { id: 22, name: "이준서", factory: 2, date: "2026-02-16", time: "10:30", location: "보건실", status: "예정", memo: "" },
        { id: 23, name: "박지민", factory: 2, date: "2026-02-17", time: "15:00", location: "보건실", status: "예정", memo: "" },
        { id: 24, name: "정하늘", factory: 2, date: "2026-02-18", time: "11:00", location: "보건실", status: "예정", memo: "" },
        { id: 25, name: "최민석", factory: 2, date: "2026-02-19", time: "13:30", location: "보건실", status: "예정", memo: "" },
        { id: 26, name: "강서연", factory: 2, date: "2026-02-20", time: "14:30", location: "보건실", status: "예정", memo: "" },
        { id: 27, name: "조윤아", factory: 2, date: "2026-02-21", time: "10:00", location: "보건실", status: "예정", memo: "" },
        { id: 28, name: "윤재현", factory: 2, date: "2026-02-22", time: "15:30", location: "보건실", status: "예정", memo: "" },
        { id: 29, name: "한지우", factory: 2, date: "2026-02-24", time: "11:30", location: "보건실", status: "예정", memo: "" },
        { id: 30, name: "신민주", factory: 2, date: "2026-02-25", time: "13:00", location: "보건실", status: "예정", memo: "" },
        { id: 31, name: "장수빈", factory: 2, date: "2026-02-26", time: "14:00", location: "보건실", status: "예정", memo: "" },
        { id: 32, name: "임서연", factory: 2, date: "2026-02-27", time: "10:30", location: "보건실", status: "예정", memo: "" },
        { id: 33, name: "황태민", factory: 2, date: "2026-02-28", time: "15:00", location: "보건실", status: "예정", memo: "" },
        { id: 34, name: "오승환", factory: 2, date: "2026-03-03", time: "11:00", location: "보건실", status: "예정", memo: "" },
        { id: 35, name: "배하은", factory: 2, date: "2026-03-04", time: "13:30", location: "보건실", status: "예정", memo: "" },
        { id: 36, name: "서유나", factory: 2, date: "2026-03-05", time: "14:30", location: "보건실", status: "예정", memo: "" },
        { id: 37, name: "권지훈", factory: 2, date: "2026-03-06", time: "10:00", location: "보건실", status: "예정", memo: "" },
        { id: 38, name: "송민지", factory: 2, date: "2026-03-07", time: "15:30", location: "보건실", status: "예정", memo: "" },
        { id: 39, name: "유재석", factory: 2, date: "2026-03-10", time: "11:30", location: "보건실", status: "예정", memo: "" },
        { id: 40, name: "문소희", factory: 2, date: "2026-03-11", time: "13:00", location: "보건실", status: "예정", memo: "" }
    ],

    // 공지사항 (관리자 편집 가능)
    announcements: {
        title: "11월·12월 공상비 '0원' 달성",
        description: "2025년 하반기 무재해 목표 달성 완료",
        imageUrl: "" // base64 이미지 또는 URL
    },

    // 시스템 메타데이터
    metadata: {
        lastUpdated: "2026-02-12T16:56:00",
        updatedBy: "박기태 선임",
        version: "3.9"
    }
};

// localStorage 저장
function saveSystemConfig() {
    SYSTEM_CONFIG.metadata.lastUpdated = new Date().toISOString();
    SYSTEM_CONFIG.metadata.updatedBy = "박기태 선임";
    localStorage.setItem('g_system_config', JSON.stringify(SYSTEM_CONFIG));
    console.log('✅ 시스템 설정 저장 완료');
}

// localStorage 불러오기
function loadSystemConfig() {
    const saved = localStorage.getItem('g_system_config');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(SYSTEM_CONFIG, parsed);
            console.log('✅ 시스템 설정 로드 완료');
        } catch (e) {
            console.error('❌ 설정 로드 실패:', e);
        }
    } else {
        // 최초 실행 시 기본값 저장
        saveSystemConfig();
        console.log('✨ 기본 설정 초기화 완료');
    }
}

// ===== 응급 연락망 렌더링 및 관리 =====
function renderEmergencyContacts() {
    const container = document.getElementById('emergency-contacts-container');
    if (!container) return;

    const colorMap = {
        'red': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', textHover: 'hover:text-red-700', textLight: 'text-red-500' },
        'orange': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', textHover: 'hover:text-orange-700', textLight: 'text-orange-500' },
        'blue': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', textHover: 'hover:text-blue-700', textLight: 'text-blue-500' },
        'teal': { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', textHover: 'hover:text-teal-700', textLight: 'text-teal-500' },
        'slate': { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', textHover: 'hover:text-slate-700', textLight: 'text-slate-500' }
    };

    const html = SYSTEM_CONFIG.emergencyContacts
        .sort((a, b) => a.order - b.order)
        .map(contact => {
            const colors = colorMap[contact.color] || colorMap.slate;
            return `
                <div class="p-4 ${colors.bg} rounded-xl border ${colors.border}">
                    <div class="flex items-center gap-2 mb-2 justify-between">
                        <div class="flex items-center gap-2">
                            <i class="fas ${contact.icon} ${colors.text}"></i>
                            <span class="font-black text-sm">${contact.name}</span>
                        </div>
                        ${isAdminLoggedIn() ? `
                            <div class="flex gap-1">
                                <button onclick="openEmergencyModal(${contact.id})" 
                                        class="text-xs text-blue-600 hover:text-blue-800 px-2 py-1">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteEmergencyContact(${contact.id})" 
                                        class="text-xs text-red-600 hover:text-red-800 px-2 py-1">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    <a href="tel:${contact.phone}" 
                       class="text-2xl font-black ${colors.text} ${colors.textHover} underline">
                        ${contact.phone}
                    </a>
                    <p class="text-xs ${colors.textLight} mt-1">${contact.description}</p>
                </div>
            `;
        }).join('');

    container.innerHTML = html;
}

// 응급 연락처 모달 열기 (추가/수정)
function openEmergencyModal(id = null) {
    const modal = document.getElementById('modal-emergency');
    const form = document.getElementById('form-emergency');
    const title = document.getElementById('modal-emergency-title');

    if (id) {
        const contact = SYSTEM_CONFIG.emergencyContacts.find(c => c.id === id);
        if (contact) {
            title.textContent = '연락처 수정';
            form.elements['contact-id'].value = contact.id;
            form.elements['category'].value = contact.category;
            form.elements['name'].value = contact.name;
            form.elements['phone'].value = contact.phone;
            form.elements['description'].value = contact.description;
            form.elements['icon'].value = contact.icon;
            form.elements['color'].value = contact.color;
        }
    } else {
        title.textContent = '연락처 추가';
        form.reset();
        form.elements['contact-id'].value = '';
    }

    modal.classList.remove('hidden');
}

// 응급 연락처 저장
function saveEmergencyContact(event) {
    event.preventDefault();
    const form = event.target;
    const id = form.elements['contact-id'].value;

    const contactData = {
        category: form.elements['category'].value,
        name: form.elements['name'].value,
        phone: form.elements['phone'].value,
        description: form.elements['description'].value,
        icon: form.elements['icon'].value,
        color: form.elements['color'].value
    };

    if (id) {
        // 수정
        const index = SYSTEM_CONFIG.emergencyContacts.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            SYSTEM_CONFIG.emergencyContacts[index] = {
                ...SYSTEM_CONFIG.emergencyContacts[index],
                ...contactData
            };
        }
    } else {
        // 추가
        const newId = Math.max(...SYSTEM_CONFIG.emergencyContacts.map(c => c.id), 0) + 1;
        const newOrder = Math.max(...SYSTEM_CONFIG.emergencyContacts.map(c => c.order), 0) + 1;
        SYSTEM_CONFIG.emergencyContacts.push({
            id: newId,
            ...contactData,
            order: newOrder
        });
    }

    saveSystemConfig();
    renderEmergencyContacts();
    closeModal('emergency');
    alert(id ? '연락처가 수정되었습니다.' : '연락처가 추가되었습니다.');
}

// 응급 연락처 삭제
function deleteEmergencyContact(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    SYSTEM_CONFIG.emergencyContacts = SYSTEM_CONFIG.emergencyContacts.filter(c => c.id !== id);
    saveSystemConfig();
    renderEmergencyContacts();
    alert('연락처가 삭제되었습니다.');
}

// 모달 닫기
function closeModal(type) {
    const modal = document.getElementById(`modal-${type}`);
    if (modal) modal.classList.add('hidden');
}

// 관리자 설정 페이지 열기
function openAdminSettings(tab = 'emergency') {
    // 나중에 시스템 설정 탭이 추가되면 그쪽으로 이동
    alert('시스템 설정 페이지는 곧 추가됩니다. 현재는 각 항목의 관리 버튼을 사용해주세요.');
}

// ===== 공지사항 렌더링 및 관리 =====
function renderAnnouncement() {
    const announcement = SYSTEM_CONFIG.announcements;

    // 제목과 설명 업데이트
    document.getElementById('announcement-title').textContent = announcement.title;
    document.getElementById('announcement-desc').textContent = announcement.description;

    // 이미지 업데이트
    const imageContainer = document.getElementById('announcement-image-container');
    if (announcement.imageUrl) {
        imageContainer.innerHTML = `
                    <div class="p-4 bg-white/10 backdrop-blur-sm">
                        <img src="${announcement.imageUrl}" 
                             alt="공지 이미지" 
                             class="w-full max-h-64 object-cover rounded-lg shadow-lg">
                    </div>
                `;
        imageContainer.classList.remove('hidden');
    } else {
        imageContainer.classList.add('hidden');
    }
}

// 공지사항 모달 열기
function openAnnouncementModal() {
    const modal = document.getElementById('modal-announcement');
    const form = document.getElementById('form-announcement');
    const announcement = SYSTEM_CONFIG.announcements;

    form.elements['announcement-title'].value = announcement.title;
    form.elements['announcement-description'].value = announcement.description;

    // 현재 이미지 미리보기
    const preview = document.getElementById('announcement-image-preview');
    if (announcement.imageUrl) {
        preview.innerHTML = `
                    <img src="${announcement.imageUrl}" class="max-h-40 rounded-lg border-2 border-teal-300">
                    <button type="button" onclick="removeAnnouncementImage()" 
                            class="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded">
                        이미지 삭제
                    </button>
                `;
    } else {
        preview.innerHTML = '<p class="text-xs text-slate-400">이미지 없음</p>';
    }

    modal.classList.remove('hidden');
}

// 공지사항 저장
function saveAnnouncement(event) {
    event.preventDefault();
    const form = event.target;

    SYSTEM_CONFIG.announcements.title = form.elements['announcement-title'].value;
    SYSTEM_CONFIG.announcements.description = form.elements['announcement-description'].value;

    // 파일 업로드 처리
    const fileInput = form.elements['announcement-image'];
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            SYSTEM_CONFIG.announcements.imageUrl = e.target.result;
            saveSystemConfig();
            renderAnnouncement();
            closeModal('announcement');
            alert('공지사항이 저장되었습니다.');
        };

        reader.readAsDataURL(file);
    } else {
        saveSystemConfig();
        renderAnnouncement();
        closeModal('announcement');
        alert('공지사항이 저장되었습니다.');
    }
}

// 공지사항 이미지 삭제
function removeAnnouncementImage() {
    if (!confirm('이미지를 삭제하시겠습니까?')) return;

    SYSTEM_CONFIG.announcements.imageUrl = '';
    saveSystemConfig();
    renderAnnouncement();
    document.getElementById('announcement-image-preview').innerHTML =
        '<p class="text-xs text-slate-400">이미지 없음</p>';
}

// ===== 성과 항목 이미지 관리 =====
function openInnovationImageModal(index) {
    const modal = document.getElementById('modal-innovation-image');
    const form = document.getElementById('form-innovation-image');
    const item = APP_DATA.innovations[index];

    form.elements['innovation-index'].value = index;
    document.getElementById('innovation-title-display').textContent = item.title;

    // 현재 이미지 미리보기
    const preview = document.getElementById('innovation-image-preview');
    if (item.imageUrl) {
        preview.innerHTML = `
                    <img src="${item.imageUrl}" class="max-h-40 rounded-lg border-2 border-indigo-300">
                    <button type="button" onclick="removeInnovationImage(${index})" 
                            class="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded">
                        이미지 삭제
                    </button>
                `;
    } else {
        preview.innerHTML = '<p class="text-xs text-slate-400">이미지 없음</p>';
    }

    modal.classList.remove('hidden');
}

// 성과 이미지 저장
function saveInnovationImage(event) {
    event.preventDefault();
    const form = event.target;
    const index = parseInt(form.elements['innovation-index'].value);

    const fileInput = form.elements['innovation-image'];
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            APP_DATA.innovations[index].imageUrl = e.target.result;
            renderInnovations();
            closeModal('innovation-image');
            alert('이미지가 저장되었습니다.');
        };

        reader.readAsDataURL(file);
    } else {
        alert('이미지 파일을 선택해주세요.');
    }
}

// 성과 이미지 삭제
function removeInnovationImage(index) {
    if (!confirm('이미지를 삭제하시겠습니까?')) return;

    APP_DATA.innovations[index].imageUrl = '';
    renderInnovations();
    document.getElementById('innovation-image-preview').innerHTML =
        '<p class="text-xs text-slate-400">이미지 없음</p>';
}

// ===== 기존 APP_DATA =====
const APP_DATA = {
    stats: {
        total_members: 106,
        consulted_rate: 77.3,
        zero_accident: "2개월"
    },

    expenses_2025: [
        { month: 1, items: [{ name: "이영준", amount: 251860, hospital: "병원" }] },
        { month: 2, items: [{ name: "이영준", amount: 15000, hospital: "병원" }, { name: "하다현", amount: 427370, hospital: "병원" }, { name: "박래경", amount: 491570, hospital: "병원" }, { name: "김동우", amount: 513970, hospital: "대학병원" }] },
        { month: 3, items: [{ name: "이주호", amount: 76300, hospital: "약국" }, { name: "문영남", amount: 166780, hospital: "병원" }, { name: "박래경", amount: 195470, hospital: "병원" }, { name: "김동우", amount: 6541480, hospital: "대학병원" }] },
        { month: 4, items: [{ name: "김동우", amount: 171620, hospital: "대학병원" }, { name: "곽용호", amount: 1474000, hospital: "병원" }] },
        { month: 5, items: [{ name: "김동우", amount: 2544600, hospital: "대학병원" }, { name: "경용호", amount: 660650, hospital: "병원" }, { name: "김지환", amount: 412900, hospital: "병원" }] },
        { month: 6, items: [{ name: "김동우", amount: 67640, hospital: "대학병원" }, { name: "곽용호", amount: 321127, hospital: "병원" }, { name: "김진희", amount: 189720, hospital: "병원" }] },
        { month: 7, items: [{ name: "곽용호", amount: 746336, hospital: "병원" }, { name: "손재웅", amount: 314400, hospital: "약국" }, { name: "김종남", amount: 5297900, hospital: "대학병원" }] },
        { month: 8, items: [{ name: "김종남", amount: 102800, hospital: "대학병원" }] },
        { month: 9, items: [{ name: "김종남", amount: 807440, hospital: "대학병원" }, { name: "문영남", amount: 4858130, hospital: "병원" }, { name: "김풍원", amount: 1235000, hospital: "병원" }] },
        { month: 10, items: [{ name: "김종남", amount: 59170, hospital: "대학병원" }, { name: "문영남", amount: 655320, hospital: "병원" }, { name: "김풍원", amount: 923130, hospital: "병원" }] },
        { month: 11, items: [] },
        { month: 12, items: [] }
    ],

    expenses_2026: [
        { month: 7, items: [] },
        { month: 8, items: [] },
        { month: 9, items: [] },
        { month: 10, items: [] },
        { month: 11, items: [] },
        { month: 12, items: [] }
    ],

    risks: [
        { type: "밀폐공간(질식)", dept: "전 공정", health: "산소결핍, 유해가스", action: "복합가스측정기 구매 완료", level: "Critical" },
        { type: "소음", dept: "프레스, 용접", health: "소음성 난청", action: "귀마개 착용 및 특수검진", level: "Critical" },
        { type: "근골격계 부담", dept: "조립반, 물류", health: "요통, 어깨 결림", action: "유해요인조사 실시", level: "High" },
        { type: "용접 흄", dept: "용접반", health: "폐기능 저하", action: "국소배기, 특급마스크", level: "High" },
        { type: "유기용제", dept: "도장반", health: "간기능 이상", action: "밀폐용기 개선, 환기", level: "Mid" }
    ],

    innovations: [
        // 2024년 성과
        { category: "Cost", title: "근골격계 조사 자체 수행", desc: "외부 위탁 없이 직접 실시하여 500만원 예산 절감", date: "2024.12", savings: 5000000, imageUrl: "" },

        // 2025년 성과
        { category: "Safety", title: "화학물질 관리 체계 고도화", desc: "현장 전수 조사 및 MSDS 보관함 추가 설치, 공정관리 요령 부착", date: "2025.02", imageUrl: "" },
        { category: "System", title: "안전보건 방송 시스템 구축", desc: "1·2·3공장 교육 방송 동시 송출 시스템 완비", date: "2025.06", imageUrl: "" },
        { category: "Cost", title: "보건관리 전문기관 대통합", desc: "영남대→대한산업보건협회 변경으로 연간 5,113,440원 절감 + S등급 달성", date: "2025.11", savings: 5113440, imageUrl: "" },
        { category: "Health", title: "근골격계 예방 (2공장)", desc: "유해요인조사 완료", date: "2025.01", imageUrl: "" },
        { category: "Network", title: "외부 벤치마킹", desc: "메가젠 안전보건 교류", date: "2025.11", imageUrl: "" },
        { category: "Edu", title: "전문성 강화", desc: "가스농도 측정평가 교육 이수", date: "2025.09", imageUrl: "" },
        { category: "System", title: "법령 대응 강화", desc: "밀폐공간 법령 개정 대응 측정기 구매", date: "2025.11", imageUrl: "" },

        // 2026년 성과
        { category: "Process", title: "행정 효율화", desc: "소모품 결제 통합 (법인카드 월 1회 일괄)", date: "2026.01", imageUrl: "" },
        { category: "Visual", title: "현장 시각화 개선", desc: "맨홀·위험구역 황색 삼각형 도색 및 경고 표지 부착", date: "2026.01", imageUrl: "" },
        { category: "Safety", title: "비상 대응 프로세스 수립", desc: "응급상황 Flowchart 및 연락망 신규 정립", date: "2026.01", imageUrl: "" },
        { category: "System", title: "자체 보건 전산 시스템 개발", desc: "웹 기반 보건시스템(G-System) 구축으로 데이터 자동화 및 행정 효율화", date: "2026.02", imageUrl: "" }
    ],

    members: [
        // 1공장 집중관찰 대상자 (10명) - isIntensiveCare: true는 노란색으로 표시되는 집중관찰자
        { name: "김규주", dept: "1공장", risk: "Highest", note: "소음성 난청 (양측)", isIntensiveCare: true, counseling: { 1: { date: "01/15", count: 1 }, 2: { date: "02/10", count: 1 }, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        { name: "남덕현", dept: "1공장", risk: "Highest", note: "고혈압 (중)당뇨", isIntensiveCare: true, counseling: { 1: { date: "01/20", count: 1 }, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        { name: "박기태", dept: "1공장", risk: "Highest", note: "소음감각", isIntensiveCare: true, counseling: { 1: null, 2: { date: "02/15", count: 1 }, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        { name: "박태양", dept: "1공장", risk: "Highest", note: "당뇨병", isIntensiveCare: true, counseling: { 1: { date: "01/10", count: 1 }, 2: { date: "02/20", count: 1 }, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        { name: "송치훈", dept: "1공장", risk: "Highest", note: "고혈압", isIntensiveCare: true, counseling: { 1: { date: "01/12", count: 1 }, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        { name: "양병석", dept: "1공장", risk: "High", note: "CO2용접", isIntensiveCare: false, counseling: { 1: null, 2: { date: "02/25", count: 1 }, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        { name: "오지웅", dept: "1공장", risk: "Highest", note: "만성신부전", isIntensiveCare: true, counseling: { 1: { date: "01/18", count: 1 }, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        { name: "제창희", dept: "1공장", risk: "Highest", note: "뇌심혈관 고위험", isIntensiveCare: true, counseling: { 1: { date: "01/25", count: 1 }, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        { name: "하대준", dept: "1공장", risk: "Highest", note: "폐기능 저하", isIntensiveCare: true, counseling: { 1: null, 2: { date: "02/18", count: 1 }, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        { name: "황동민", dept: "1공장", risk: "High", note: "관절염/허리부", isIntensiveCare: false, counseling: { 1: { date: "01/30", count: 1 }, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        // 2공장 집중관찰 대상자 (4명)
        { name: "문영채", dept: "2공장", risk: "Highest", note: "당뇨", isIntensiveCare: true, counseling: { 1: { date: "01/22", count: 1 }, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        { name: "백대용", dept: "2공장", risk: "High", note: "근골", isIntensiveCare: false, counseling: { 1: null, 2: { date: "02/12", count: 1 }, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        { name: "안성형", dept: "2공장", risk: "Highest", note: "당뇨", isIntensiveCare: true, counseling: { 1: { date: "01/28", count: 1 }, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
        { name: "전영용", dept: "2공장", risk: "High", note: "근골", isIntensiveCare: false, counseling: { 1: null, 2: { date: "02/24", count: 1 }, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } }
    ],

    // 전체 인원명부 (건강검진 관리용)
    // 주의: 인원명부에 있는 사람들이 전체 인원입니다.
    // convert_excel_to_json.py 스크립트를 실행하여 엑셀 파일에서 자동으로 로드할 수 있습니다.
    healthCheckupMembers: [
        // 엑셀 파일 데이터가 필요합니다. 
        // Python 스크립트(convert_excel_to_json.py)를 실행하면 자동으로 채워집니다.
        // 형식: { name: "이름", dept: "부서명", factory: "1공장" 또는 "2공장", checkupDate: null, status: "completed" }
    ],

    // 스트레칭 영상 데이터
    stretchingVideos: [
        {
            id: 1,
            title: "구영테크 스트레칭 영상",
            description: "근골격계 부담 예방을 위한 실전 스트레칭 가이드",
            videoUrl: "videos/stretching.mp4", // 웹 서버에 업로드된 경로로 변경 필요
            thumbnail: "",
            duration: "",
            category: "전체",
            createdAt: "2026-02-12"
        }
    ]
};

// ===== 건강 뉴스 데이터 =====
const HEALTH_NEWS = [
    {
        title: "겨울철 혈압 관리, 직장인에게 특히 중요한 이유",
        summary: "기온이 1℃ 떨어질 때마다 수축기 혈압이 평균 1mmHg 상승한다는 보고가 있습니다. 고혈압·심혈관 질환 병력이 있는 근로자는 보온, 규칙적인 약 복용, 카페인·나트륨 조절이 중요합니다.",
        source: "대한고혈압학회 · 질병관리청 가이드 요약",
        date: "2026-02-10",
        category: "심혈관·고혈압"
    },
    {
        title: "3분 목·어깨 스트레칭으로 근골격계 부담 줄이기",
        summary: "프레스·용접·조립 공정에서 1시간 이상 같은 자세가 지속되면 목·어깨·허리 통증 위험이 크게 증가합니다. 작업 중 1~2시간마다 3분씩 가벼운 스트레칭을 시행하면 통증 호소율을 유의하게 줄일 수 있습니다.",
        source: "산업안전보건공단 KOSHA Guide 요약",
        date: "2026-02-05",
        category: "근골격계 부담"
    },
    {
        title: "야간·교대근무자의 수면 위생 수칙",
        summary: "야간근무 후 90분 낮잠은 피로 회복에 도움이 되지만, 2시간 이상 과다수면은 생체리듬을 더 흐트러뜨릴 수 있습니다. 일정한 기상시간 유지, 카페인 섭취 시간 제한, 수면 전 스마트폰 사용 최소화가 핵심입니다.",
        source: "대한수면의학회 권고안 정리",
        date: "2026-01-28",
        category: "수면·교대근무"
    }
];

function renderHealthNews() {
    const container = document.getElementById('health-news-list');
    if (!container) return;

    const updatedAtEl = document.getElementById('health-news-updated-at');
    if (updatedAtEl && HEALTH_NEWS.length > 0) {
        updatedAtEl.textContent = `${HEALTH_NEWS[0].date} 기준`;
    }

    const html = HEALTH_NEWS.map((item, index) => `
        <article class="flex gap-4 items-start">
            <div class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-sm">
                ${index + 1}
            </div>
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-50 text-emerald-700">${item.category}</span>
                    <span class="text-[11px] font-bold text-slate-400">${item.date}</span>
                </div>
                <h4 class="font-black text-slate-800 mb-1">${item.title}</h4>
                <p class="text-sm text-slate-600 leading-relaxed">${item.summary}</p>
                <p class="mt-1 text-xs text-slate-400">출처: ${item.source}</p>
            </div>
        </article>
    `).join('');

    container.innerHTML = html;
}

function calculateCounselingStats() {
    const total = APP_DATA.members.length;
    let counseled = 0;

    APP_DATA.members.forEach(member => {
        if (!member.counseling) return;
        const hasAny = Object.values(member.counseling).some(c => c && (c.count || 0) > 0);
        if (hasAny) {
            counseled++;
        }
    });

    const rate = total > 0 ? Math.round((counseled / total) * 100) : 0;
    return { total, counseled, rate };
}

function updateCounselingStatsUI() {
    const { total, counseled, rate } = calculateCounselingStats();

    const totalEl = document.getElementById('total-members-count');
    if (totalEl) totalEl.textContent = String(total);

    const counseledEl = document.getElementById('counseled-members-count');
    if (counseledEl) counseledEl.textContent = String(counseled);

    const rateEl = document.getElementById('counseling-completion-rate');
    if (rateEl) rateEl.textContent = String(rate);

    // 대시보드 카드 - 총 관리인원
    const dashTotalEl = document.getElementById('dashboard-total-members');
    if (dashTotalEl) dashTotalEl.textContent = String(total);

    // 대시보드 카드 - 상담 이수율
    const dashRateNumberEl = document.getElementById('dashboard-counseling-rate');
    if (dashRateNumberEl) dashRateNumberEl.textContent = String(rate);

    const dashRateBarEl = document.getElementById('dashboard-counseling-rate-bar');
    if (dashRateBarEl) dashRateBarEl.style.width = `${rate}%`;

    // 리스트 탭 제목과 검색 카운트
    const listTotalEl = document.getElementById('list-total-members');
    if (listTotalEl) listTotalEl.textContent = String(total);

    const searchCountEl = document.getElementById('search-count');
    if (searchCountEl) searchCountEl.textContent = `${total}명`;
}

let currentExpenseYear = 2025;
let chartInstances = {};

// ===== 2월 건강상담 명단 반영 함수 =====
function updateFebruaryCounselingList() {
    // 2공장 2월 건강상담 명단 (2월 26일 방문 예정)
    const february2Factory = [
        "박인학", "전성호", "김성진", "김준영", "김지환", "김진균",
        "김진환", "김찬민", "박원규", "송룡슈", "송영빈", "여동현",
        "오상흠", "윤진영", "이대응"
    ];

    // 전체 2월 건강상담 명단
    const februaryAll = [
        "강민성", "강태호", "고병해", "권유겸", "권은희", "김다솔",
        "김도훈", "김민조", "김병화", "김성호", "감새헌", "김수민",
        "김양식", "김영철", "김영해", "김영환", "김완국", "김전호",
        "김준동"
    ];

    // 모든 2월 상담 대상자 통합 (중복 제거)
    const allFebruaryCounseling = [...new Set([...february2Factory, ...februaryAll])];

    // 기존 members 배열에서 이름으로 찾아서 2월 상담 기록 추가/업데이트
    allFebruaryCounseling.forEach(name => {
        const member = APP_DATA.members.find(m => m.name === name);
        if (member) {
            // 기존 상담 기록이 없거나 날짜가 다른 경우 업데이트
            if (!member.counseling[2] || member.counseling[2].date !== "02/26") {
                member.counseling[2] = { date: "02/26", count: (member.counseling[2]?.count || 0) + 1 };
            }
        } else {
            // members 배열에 없는 경우 새로 추가 (일반 검진 완료자로 간주)
            const dept = february2Factory.includes(name) ? "2공장" : "1공장";
            APP_DATA.members.push({
                name: name,
                dept: dept,
                risk: "Mid",
                note: "일반검진 완료",
                isIntensiveCare: false,
                counseling: {
                    1: null, 2: { date: "02/26", count: 1 }, 3: null, 4: null, 5: null, 6: null,
                    7: null, 8: null, 9: null, 10: null, 11: null, 12: null
                }
            });
        }
    });

    // 통계 UI 업데이트
    updateCounselingStatsUI();
    console.log(`✅ 2월 건강상담 명단 반영 완료: ${allFebruaryCounseling.length}명`);
}

// initApp 제거됨 (index.html의 initApp 사용)

function renderCharts() {
    const monthlyData2025 = Array(12).fill(0);
    APP_DATA.expenses_2025.forEach(m => {
        const total = m.items.reduce((sum, item) => sum + item.amount, 0);
        monthlyData2025[m.month - 1] = total;
    });

    const total2025 = monthlyData2025.reduce((a, b) => a + b, 0);
    document.getElementById('total-2025').textContent = '₩' + total2025.toLocaleString();

    if (chartInstances.cost) chartInstances.cost.destroy();
    chartInstances.cost = new Chart(document.getElementById('costChart'), {
        type: 'line',
        data: {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            datasets: [{
                label: '병원비(원)',
                data: monthlyData2025,
                borderColor: '#0D9488',
                backgroundColor: 'rgba(13,148,136,0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { callback: v => '₩' + v.toLocaleString() } },
                x: { grid: { display: false } }
            }
        }
    });

    const riskCounts = { Highest: 0, High: 0, Mid: 0, Low: 0 };
    APP_DATA.members.forEach(m => riskCounts[m.risk]++);

    if (chartInstances.risk) chartInstances.risk.destroy();
    chartInstances.risk = new Chart(document.getElementById('riskChart'), {
        type: 'doughnut',
        data: {
            labels: ['최고위험', '고위험', '중위험', '저위험'],
            datasets: [{
                data: [riskCounts.Highest, riskCounts.High, riskCounts.Mid, riskCounts.Low],
                backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#10B981'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function renderRiskFactors() {
    const container = document.getElementById('risk-factors-container');
    container.innerHTML = APP_DATA.risks.map(r => `
                <div class="gu-card p-8 border-l-8 ${r.level === 'Critical' ? 'border-l-red-500' : r.level === 'High' ? 'border-l-orange-500' : 'border-l-teal-500'}">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="text-xl font-black">${r.type}</h3>
                            <p class="text-xs font-bold text-slate-400">발생: ${r.dept}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-black ${r.level === 'Critical' ? 'bg-red-100 text-red-600' : r.level === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'}">${r.level}</span>
                    </div>
                    <div class="space-y-3">
                        <div class="p-4 bg-slate-50 rounded-xl">
                            <p class="text-xs font-black text-slate-400">건강영향</p>
                            <p class="text-sm font-bold">${r.health}</p>
                        </div>
                        <div class="p-4 bg-green-50 rounded-xl">
                            <p class="text-xs font-black text-green-600">조치사항</p>
                            <p class="text-sm font-bold text-green-800">${r.action}</p>
                        </div>
                    </div>
                </div>
            `).join('');
}

function renderInnovations() {
    const isAdmin = isAdminLoggedIn();
    const html = APP_DATA.innovations.map((item, i) => `
                <div class="p-4 hover:bg-slate-50 rounded-xl border-b last:border-0">
                    <div class="flex flex-col md:flex-row items-start gap-4">
                        <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold flex-shrink-0 mb-2 md:mb-0">${i + 1}</div>
                        <div class="flex-1 w-full">
                            <div class="flex flex-wrap items-center gap-2 mb-1 justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="px-2 py-0.5 rounded text-xs font-black bg-slate-100">${item.category}</span>
                                    <span class="text-xs font-bold text-slate-400">${item.date}</span>
                                </div>
                                ${isAdmin ? `
                                    <button onclick="openInnovationImageModal(${i})" 
                                            class="text-xs text-blue-600 hover:text-blue-800 px-2 py-1">
                                        <i class="fas fa-image"></i> 이미지
                                    </button>
                                ` : ''}
                            </div>
                            <h4 class="font-black text-slate-800 break-keep leading-tight">${item.title}</h4>
                            <p class="text-sm text-slate-600 break-keep mt-2 leading-relaxed">${item.desc}</p>
                            ${item.imageUrl ? `
                                <div class="mt-3">
                                    <img src="${item.imageUrl}" 
                                         alt="${item.title}" 
                                         class="w-full max-h-48 object-cover rounded-lg border-2 border-indigo-200 shadow-sm">
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
    const innovationTab = document.getElementById('innovation-tab-list');
    if (innovationTab) {
        innovationTab.innerHTML = html;
    }
}

function filterList(type) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.dataset.filter === type) {
            btn.classList.add('active', 'bg-slate-800', 'text-white');
            btn.classList.remove('bg-red-50', 'bg-orange-50', 'bg-slate-200', 'text-red-600', 'text-orange-600', 'text-slate-600');
        } else {
            btn.classList.remove('active', 'bg-slate-800', 'text-white');
        }
    });

    let filtered = APP_DATA.members;
    if (type === 'Highest') filtered = APP_DATA.members.filter(m => m.risk === 'Highest');
    if (type === 'Pending') {
        filtered = APP_DATA.members.filter(m => {
            // 상담 이력이 전혀 없는 경우를 미상담으로 분류
            return !Object.values(m.counseling).some(c => c !== null);
        });
    }

    renderMemberTable(filtered);
}

function searchMembers(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
        filterList('All');
        return;
    }
    const filtered = APP_DATA.members.filter(m =>
        m.name.toLowerCase().includes(searchTerm) ||
        m.dept.toLowerCase().includes(searchTerm) ||
        (m.note && m.note.toLowerCase().includes(searchTerm))
    );
    renderMemberTable(filtered);
    const countEl = document.getElementById('search-count');
    if (countEl) countEl.textContent = filtered.length + '명';
}

function renderMemberTable(members) {
    const tbody = document.getElementById('member-table-body');
    const isAdmin = isAdminLoggedIn();

    // 실제 members 배열에서 인덱스 찾기
    const findMemberIndex = (memberName) => {
        return APP_DATA.members.findIndex(m => m.name === memberName);
    };

    tbody.innerHTML = members.map((m, displayIdx) => {
        const actualIdx = findMemberIndex(m.name);
        const isIntensiveCare = m.isIntensiveCare === true;
        const rowBgClass = isIntensiveCare ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-slate-50';
        const nameBgClass = isIntensiveCare ? 'bg-yellow-200 text-yellow-800 border-2 border-yellow-400' : (m.risk === 'Highest' ? 'bg-red-100 text-red-600' : m.risk === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100');

        return `
                <tr class="${rowBgClass} transition-colors">
                    <td class="p-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${nameBgClass}">${m.name.charAt(0)}</div>
                            <span class="font-bold ${isIntensiveCare ? 'text-yellow-900' : ''}">${m.name}</span>
                            ${isIntensiveCare ? '<span class="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded text-[10px] font-black">집중관찰</span>' : ''}
                        </div>
                    </td>
                    <td class="p-4 text-slate-500 font-bold">${m.dept}</td>
                    <td class="p-4"><span class="status-badge status-${m.risk.toLowerCase()}">${m.risk}</span></td>
                    <td class="p-4 text-xs font-bold text-slate-600">${m.note}</td>
                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => {
            const counseling = m.counseling[month];
            if (counseling && counseling.count > 0) {
                // 상담 이력이 있으면 O 표시
                return `<td class="p-2 text-center">
                                <button onclick="editCounseling(${actualIdx}, ${month})" class="w-8 h-8 rounded-full bg-teal-500 text-white font-black text-sm hover:bg-teal-600 transition-colors shadow-sm" title="상담 완료: ${counseling.date} (${counseling.count}회)">
                                    O
                                </button>
                            </td>`;
            } else {
                // 상담 이력이 없으면 공란
                return `<td class="p-2 text-center">
                                <button onclick="editCounseling(${actualIdx}, ${month})" class="w-8 h-8 rounded-full bg-slate-100 text-slate-300 font-bold hover:bg-slate-200 transition-colors" title="클릭하여 상담 추가">
                                    
                                </button>
                            </td>`;
            }
        }).join('')}
                    ${isAdmin ? `<td class="p-2 text-center">
                        <button onclick="deleteMember(${actualIdx})" class="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200 transition-colors" title="삭제">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>` : ''}
                </tr>
            `;
    }).join('');
}

function editCounseling(memberIdx, month) {
    const member = APP_DATA.members[memberIdx];
    const current = member.counseling[month];

    const action = current ? '수정' : '추가';
    const currentDate = current ? current.date : '';
    const currentCount = current ? current.count : 1;

    const dateInput = prompt(`${member.name} - ${month}월 상담 날짜 ${action} (MM/DD 형식):`, currentDate);
    if (dateInput === null) return; // 취소

    if (dateInput === '') {
        // 빈 문자열이면 삭제
        member.counseling[month] = null;
    } else {
        const countInput = prompt(`${month}월 상담 회수:`, currentCount);
        if (countInput === null) return; // 취소

        member.counseling[month] = {
            date: dateInput,
            count: parseInt(countInput) || 1
        };
    }

    // 테이블 재렌더링
    const searchValue = document.getElementById('search-member')?.value || '';
    if (searchValue) {
        searchMembers(searchValue);
    } else {
        filterList('All');
    }

    updateCounselingStatsUI();
}

function changeExpenseYear(year) {
    currentExpenseYear = year;
    const buttons = document.querySelectorAll('.expense-year-btn');
    buttons.forEach(btn => {
        if (parseInt(btn.dataset.year) === year) {
            btn.classList.add('active', 'bg-teal-500', 'text-white');
            btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
        } else {
            btn.classList.remove('active', 'bg-teal-500', 'text-white');
            btn.classList.add('text-slate-600', 'hover:bg-slate-100');
        }
    });
    renderExpenseData(year);
}

function renderExpenseData(year) {
    const data = year === 2025 ? APP_DATA.expenses_2025 : APP_DATA.expenses_2026;
    const monthlyData = Array(12).fill(0);
    let allItems = [];

    data.forEach(m => {
        const total = m.items.reduce((sum, item) => sum + item.amount, 0);
        monthlyData[m.month - 1] = total;
        m.items.forEach(item => {
            allItems.push({ ...item, month: m.month });
        });
    });

    const totalAmount = monthlyData.reduce((a, b) => a + b, 0);
    const count = allItems.length;
    const avg = count > 0 ? Math.round(totalAmount / count) : 0;

    document.getElementById('expense-total').textContent = '₩' + totalAmount.toLocaleString();
    document.getElementById('expense-count').textContent = count + '건';
    document.getElementById('expense-avg').textContent = '₩' + avg.toLocaleString();

    if (chartInstances.expense) chartInstances.expense.destroy();
    chartInstances.expense = new Chart(document.getElementById('expenseChart'), {
        type: 'line',
        data: {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            datasets: [{
                label: year + '년 공상비용',
                data: monthlyData,
                borderColor: '#14B8A6',
                backgroundColor: 'rgba(20,184,166,0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { callback: v => '₩' + v.toLocaleString() } },
                x: { grid: { display: false } }
            }
        }
    });

    // 월별 뷰 렌더링
    const tbody = document.getElementById('expense-table-body');
    tbody.innerHTML = allItems.map(item => `
                <tr class="border-b hover:bg-slate-50">
                    <td class="p-4 font-bold">${year}.${item.month}</td>
                    <td class="p-4 font-black">${item.name}</td>
                    <td class="p-4 text-right font-black text-lg">₩${item.amount.toLocaleString()}</td>
                    <td class="p-4 text-sm text-slate-600">-</td>
                </tr>
            `).join('');

    // 개인별 집계 계산
    const individualData = {};
    allItems.forEach(item => {
        if (!individualData[item.name]) {
            individualData[item.name] = { count: 0, total: 0 };
        }
        individualData[item.name].count++;
        individualData[item.name].total += item.amount;
    });

    const individualBody = document.getElementById('expense-individual-body');
    individualBody.innerHTML = Object.entries(individualData)
        .sort((a, b) => b[1].total - a[1].total)
        .map(([name, data]) => `
                <tr class="border-b hover:bg-slate-50">
                    <td class="p-4 font-black">${name}</td>
                    <td class="p-4 text-right font-bold">${data.count}건</td>
                    <td class="p-4 text-right font-black text-lg text-red-600">₩${data.total.toLocaleString()}</td>
                    <td class="p-4 text-right font-bold text-slate-600">₩${Math.round(data.total / data.count).toLocaleString()}</td>
                </tr>
            `).join('');
}

function changeExpenseView(view) {
    const monthlyContent = document.getElementById('expense-view-monthly-content');
    const individualContent = document.getElementById('expense-view-individual-content');
    const btnMonthly = document.getElementById('btn-view-monthly');
    const btnIndividual = document.getElementById('btn-view-individual');

    if (view === 'monthly') {
        monthlyContent.classList.remove('hidden');
        individualContent.classList.add('hidden');
        btnMonthly.classList.add('active', 'bg-teal-500', 'text-white');
        btnMonthly.classList.remove('text-slate-600', 'hover:bg-slate-100');
        btnIndividual.classList.remove('active', 'bg-teal-500', 'text-white');
        btnIndividual.classList.add('text-slate-600', 'hover:bg-slate-100');
    } else {
        monthlyContent.classList.add('hidden');
        individualContent.classList.remove('hidden');
        btnIndividual.classList.add('active', 'bg-teal-500', 'text-white');
        btnIndividual.classList.remove('text-slate-600', 'hover:bg-slate-100');
        btnMonthly.classList.remove('active', 'bg-teal-500', 'text-white');
        btnMonthly.classList.add('text-slate-600', 'hover:bg-slate-100');
    }
}

function changeTab(tabId) {
    const isAdmin = isAdminLoggedIn();
    const allowedMenus = isAdmin ? MENU_CONFIG.admin : MENU_CONFIG.public;

    // 일반 모드에서 관리자 전용 탭 접근 시 차단
    if (!allowedMenus.includes(tabId)) {
        alert('관리자 권한이 필요한 메뉴입니다.');
        changeTab('dashboard');
        return;
    }

    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    const targetSection = document.getElementById(tabId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
        el.classList.add('text-slate-500');
    });

    const activeBtn = document.getElementById('nav-' + tabId);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.classList.remove('text-slate-500');
    }

    // 탭별 초기화 작업
    if (tabId === 'survey-results') {
        setTimeout(renderSurveyResults, 50);
    } else if (tabId === 'health-checkup') {
        setTimeout(renderHealthCheckupList, 50);
    } else if (tabId === 'stretching') {
        setTimeout(renderStretchingVideos, 50);
    } else if (tabId === 'list') {
        setTimeout(() => filterList('All'), 50);
    }
}

// ========================================
// 인증 시스템
// ========================================
const AUTH_STORAGE_KEY = 'g_auth_mode';
const AUTH_TIMESTAMP_KEY = 'g_auth_timestamp';

// 권한별 메뉴 정의
const MENU_CONFIG = {
    public: ['dashboard', 'list', 'risk-factors', 'medicine-survey', 'innovation', 'emergency', 'ai-counseling', 'health-checkup', 'stretching'],
    admin: ['dashboard', 'list', 'expense', 'risk-factors', 'medicine-survey', 'innovation', 'emergency', 'survey-results', 'ai-counseling', 'counseling-monitor', 'health-checkup', 'stretching']
};

function toggleAuth() {
    if (isAdminLoggedIn()) {
        logout();
    } else {
        const modal = document.getElementById('auth-modal');
        const pwd = document.getElementById('auth-password');
        const err = document.getElementById('auth-error');
        if (modal) modal.classList.remove('hidden');
        if (pwd) pwd.value = '';
        if (err) err.classList.add('hidden');
        setTimeout(() => pwd && pwd.focus(), 100);
    }
}

function attemptLogin() {
    const password = document.getElementById('auth-password').value;
    if (password === ADMIN_PASSWORD) {
        login();
    } else {
        document.getElementById('auth-error').classList.remove('hidden');
        document.getElementById('auth-password').value = '';
        document.getElementById('auth-password').focus();
    }
}

function login() {
    localStorage.setItem(AUTH_STORAGE_KEY, 'admin');
    localStorage.setItem(AUTH_TIMESTAMP_KEY, new Date().toISOString());
    document.getElementById('auth-modal').classList.add('hidden');
    updateAuthUI();
    renderNavigation();
}

function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    updateAuthUI();
    renderNavigation();
    const currentTab = document.querySelector('.tab-content.active').id;
    if (!MENU_CONFIG.public.includes(currentTab)) {
        changeTab('dashboard');
    }
}

function isAdminLoggedIn() {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'admin';
}

function updateAuthUI() {
    const isAdmin = isAdminLoggedIn();
    const desktopBtn = document.getElementById('auth-btn-desktop');
    const desktopText = document.getElementById('auth-btn-desktop-text');
    const mobileBtn = document.getElementById('auth-btn-mobile');

    if (isAdmin) {
        if (desktopBtn) {
            desktopBtn.classList.remove('bg-teal-500', 'hover:bg-teal-600');
            desktopBtn.classList.add('bg-red-500', 'hover:bg-red-600');
        }
        if (desktopText) {
            desktopText.textContent = '관리자 모드';
        }
        if (mobileBtn) {
            mobileBtn.classList.remove('bg-teal-500', 'hover:bg-teal-600');
            mobileBtn.classList.add('bg-red-500', 'hover:bg-red-600');
            mobileBtn.innerHTML = '<i class="fas fa-unlock"></i>';
        }
    } else {
        if (desktopBtn) {
            desktopBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
            desktopBtn.classList.add('bg-teal-500', 'hover:bg-teal-600');
        }
        if (desktopText) {
            desktopText.textContent = '관리자 로그인';
        }
        if (mobileBtn) {
            mobileBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
            mobileBtn.classList.add('bg-teal-500', 'hover:bg-teal-600');
            mobileBtn.innerHTML = '<i class="fas fa-lock"></i>';
        }
    }
    updateAdminOnlyElements();
}

function renderNavigation() {
    const isAdmin = isAdminLoggedIn();
    const allowedMenus = isAdmin ? MENU_CONFIG.admin : MENU_CONFIG.public;

    // 데스크톱 네비게이션
    const desktopNav = document.querySelector('aside nav');
    if (desktopNav) {
        const navButtons = desktopNav.querySelectorAll('button');
        navButtons.forEach(btn => {
            const tabId = btn.id.replace('nav-', '');
            if (allowedMenus.includes(tabId)) {
                btn.classList.remove('hidden');
            } else {
                btn.classList.add('hidden');
            }
        });
    }

    // 모바일 네비게이션
    const mobileNav = document.querySelector('#mobile-menu nav');
    if (mobileNav) {
        const navButtons = mobileNav.querySelectorAll('button');
        navButtons.forEach(btn => {
            const onClick = btn.getAttribute('onclick');
            if (!onClick) return;
            const match = onClick.match(/changeTab\('([^']+)'\)/);
            if (match && match[1]) {
                const tabId = match[1];
                if (allowedMenus.includes(tabId)) {
                    btn.classList.remove('hidden');
                } else {
                    btn.classList.add('hidden');
                }
            }
        });
    }

    // 일반 모드에서 병원비 지출(expense) 섹션 완전 숨김 (list는 모바일 공개됨)
    const expenseSection = document.getElementById('expense');
    if (expenseSection) {
        if (!isAdmin) {
            expenseSection.style.display = 'none';
        } else {
            expenseSection.style.display = '';
        }
    }
}

// 페이지 로드 시 인증 상태 확인
window.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    renderNavigation();
    updateAdminOnlyElements();
});

// 관리자 전용 요소 표시/숨김
function updateAdminOnlyElements() {
    const isAdmin = isAdminLoggedIn();
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        if (isAdmin) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
}

// ========================================
// 집중관리 명단 CRUD
// ========================================
function addMember() {
    if (!isAdminLoggedIn()) {
        alert('관리자 권한이 필요합니다.');
        return;
    }

    const name = prompt('성명을 입력하세요:');
    if (!name) return;

    const dept = prompt('부서를 입력하세요:');
    if (!dept) return;

    const risk = prompt('위험등급을 입력하세요 (Highest/High/Mid/Low):', 'Mid');
    if (!risk || !['Highest', 'High', 'Mid', 'Low'].includes(risk)) {
        alert('올바른 위험등급을 입력하세요.');
        return;
    }

    const note = prompt('관리 소견을 입력하세요:', '');

    const isIntensiveCare = confirm('집중관찰 대상자로 설정하시겠습니까? (노란색 표시)');

    const newMember = {
        name,
        dept,
        risk,
        note: note || '-',
        isIntensiveCare: isIntensiveCare,
        counseling: {}
    };

    // 12개월 상담 데이터 초기화
    for (let i = 1; i <= 12; i++) {
        newMember.counseling[i] = null;
    }

    APP_DATA.members.push(newMember);
    filterList('All');
    updateCounselingStatsUI();
    alert('대상자가 추가되었습니다.');
}

function deleteMember(idx) {
    if (!isAdminLoggedIn()) {
        alert('관리자 권한이 필요합니다.');
        return;
    }

    const member = APP_DATA.members[idx];
    if (!member) return;

    if (!confirm(`${member.name}님을 삭제하시겠습니까?`)) {
        return;
    }

    APP_DATA.members.splice(idx, 1);
    filterList('All');
    updateCounselingStatsUI();
    alert('대상자가 삭제되었습니다.');
}

// ========================================
// AI 심리상담 시스템
// ========================================
const AI_COUNSELOR_SYSTEM_PROMPT = `
당신은 15년 이상의 경력을 가진 전문 심리상담사입니다.
주요 역할:
- 직장 내 스트레스, 대인관계 고충 상담
- 공감적 경청과 따뜻한 조언 제공
- 비판단적 태도 유지
- 필요 시 전문가 연계 권유
        `;

// AI 상담 개인 인증 시스템
// ========================================
let currentCounselingUser = null;

function loginCounseling() {
    const name = document.getElementById('counseling-name').value.trim();
    const password = document.getElementById('counseling-password').value.trim();

    if (!name || !password) {
        alert('이름과 비밀번호를 모두 입력해주세요.');
        return;
    }

    if (password.length !== 4 || !/^\d{4}$/.test(password)) {
        alert('비밀번호는 4자리 숫자여야 합니다.');
        return;
    }

    const sessionKey = `${name}_${password}`;
    currentCounselingUser = { name, sessionKey };

    // 세션 저장
    sessionStorage.setItem('counseling_session', JSON.stringify(currentCounselingUser));

    // UI 전환
    document.getElementById('counseling-auth-panel').classList.add('hidden');
    document.getElementById('counseling-chat-panel').classList.remove('hidden');
    document.getElementById('current-user-name').textContent = name;

    // 기록 로드 및 렌더링
    loadCounselingHistory();
}

function logoutCounseling() {
    if (confirm('상담 세션을 종료하시겠습니까?')) {
        currentCounselingUser = null;
        sessionStorage.removeItem('counseling_session');

        document.getElementById('counseling-auth-panel').classList.remove('hidden');
        document.getElementById('counseling-chat-panel').classList.add('hidden');
        document.getElementById('counseling-name').value = '';
        document.getElementById('counseling-password').value = '';
    }
}

function getCounselingStorage() {
    return JSON.parse(localStorage.getItem('g_counseling_sessions') || '{}');
}

function saveCounselingStorage(data) {
    localStorage.setItem('g_counseling_sessions', JSON.stringify(data));
}

function loadCounselingHistory() {
    if (!currentCounselingUser) return;

    const allSessions = getCounselingStorage();
    const userHistory = allSessions[currentCounselingUser.sessionKey] || {
        name: currentCounselingUser.name,
        history: [],
        lastAccess: new Date().toISOString()
    };

    renderCounselingChat(userHistory.history);
}

function saveCounselingHistory(history) {
    if (!currentCounselingUser) return;

    const allSessions = getCounselingStorage();
    allSessions[currentCounselingUser.sessionKey] = {
        name: currentCounselingUser.name,
        history: history,
        lastAccess: new Date().toISOString()
    };
    saveCounselingStorage(allSessions);

    // 관리자 모니터링 업데이트 (비밀리에)
    if (isAdminLoggedIn()) {
        updateAdminMonitoring();
    }
}

function renderCounselingChat(history) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    container.innerHTML = `
                <div class="flex gap-3">
                    <div class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">AI</div>
                    <div class="bg-white p-4 rounded-2xl shadow-sm max-w-md">
                        <p class="text-sm text-slate-800 leading-relaxed">
                            안녕하세요. 저는 구영테크 전문 보건 상담 AI입니다.<br><br>
                            보건관리자님의 보조자로서, 근로자 여러분의 직무 스트레스, 대인관계 고민, 
                            개인적인 어려움에 대해 경청하고 실질적인 조언을 드리고자 합니다.<br><br>
                            편안하게 말씀해 주세요. 이 대화는 철저히 비밀이 보장됩니다.
                        </p>
                    </div>
                </div>
            ` + history.map(msg => {
        if (msg.role === 'user') {
            return `
                        <div class="flex gap-3 justify-end">
                            <div class="bg-purple-500 text-white p-4 rounded-2xl shadow-sm max-w-md">
                                <p class="text-sm leading-relaxed">${msg.content}</p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold flex-shrink-0">나</div>
                        </div>
                    `;
        } else {
            return `
                        <div class="flex gap-3">
                            <div class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">AI</div>
                            <div class="bg-white p-4 rounded-2xl shadow-sm max-w-md">
                                <p class="text-sm text-slate-800 leading-relaxed">${msg.content}</p>
                            </div>
                        </div>
                    `;
        }
    }).join('');

    container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
    if (!currentCounselingUser) {
        alert('먼저 로그인해주세요.');
        return;
    }

    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const allSessions = getCounselingStorage();
    const userHistory = allSessions[currentCounselingUser.sessionKey]?.history || [];

    userHistory.push({ role: 'user', content: message, timestamp: new Date().toISOString() });
    input.value = '';

    const aiResponse = generateAIResponse(message);
    userHistory.push({ role: 'ai', content: aiResponse, timestamp: new Date().toISOString() });

    saveCounselingHistory(userHistory);
    renderCounselingChat(userHistory);
}

function generateAIResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    // ===== 고위험 징후 감지 (최우선) =====
    if (msg.includes('자살') || msg.includes('죽고') || msg.includes('자해') ||
        msg.includes('목숨') || msg.includes('살고싶지') || msg.includes('끝내고')) {
        return '⚠️ **긴급 상황 감지**\n\n이 문제는 전문가의 도움이 꼭 필요합니다. ' +
            '즉시 보건관리자(내선: XXX)나 119, 또는 생명의전화(1588-9191)에 연락해 주세요.\n\n' +
            '귀하는 소중한 사람입니다. 반드시 전문가와 상담하시기 바랍니다.';
    }

    // ===== (1) 직무 스트레스 및 업무 과부하 =====
    if (msg.includes('스트레스') || msg.includes('업무') || msg.includes('힘들') ||
        msg.includes('벅차') || msg.includes('과부하') || msg.includes('야근') ||
        msg.includes('밤늦게') || msg.includes('퇴근')) {

        const responses = [
            // 1단계: 공감 + 2단계: 조언 + 3단계: 연계
            '업무량과 압박감 속에서 정말 힘드셨겠습니다. 그 노고를 충분히 인정합니다.\n\n' +
            '**실질적 조언:** 업무 우선순위를 정하는 것이 도움이 됩니다. 긴급하고 중요한 일부터 처리하고, ' +
            '잠깐의 환기 시간(스트레칭, 심호흡 5분)을 가져보세요.\n\n' +
            '피로가 지속된다면 보건관리자님과의 면담을 권장드립니다.',

            '업무 스트레스로 많이 지쳐계시는군요. 몸과 마음이 모두 힘든 상태이실 겁니다.\n\n' +
            '**실질적 조언:** 하루 중 5~10분이라도 완전히 일에서 벗어나는 시간을 가져보세요. ' +
            '물 한 잔 마시며 창밖을 보거나, 간단한 목 스트레칭도 효과적입니다.\n\n' +
            '증상이 계속되면 사내 보건실을 방문해 주세요.',

            '과중한 업무로 인한 스트레스, 충분히 이해합니다. 혼자 감당하기 어려운 상황이시죠.\n\n' +
            '**실질적 조언:** 가능하다면 상사에게 우선순위를 재조정할 수 있는지 상의해보세요. ' +
            '모든 일을 동시에 완벽하게 할 수는 없습니다.\n\n' +
            '필요시 보건관리자가 중재 역할을 해드릴 수 있습니다.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // ===== (2) 직장 내 대인관계/상사와의 갈등 =====
    if (msg.includes('상사') || msg.includes('팀장') || msg.includes('부장') ||
        msg.includes('과장') || msg.includes('갈등') || msg.includes('동료') ||
        msg.includes('싸움') || msg.includes('다툼')) {

        const responses = [
            '대인관계에서의 감정 소모가 크시군요. 정말 힘든 상황이십니다.\n\n' +
            '**실질적 조언:** 감정적으로 대응하기보다는 "나-전달법"을 사용해보세요. ' +
            '"~해주세요" 대신 "제가 ~할 때 ~하게 느껴집니다. ~해주시면 감사하겠습니다"로 표현하는 것입니다.\n\n' +
            '갈등이 지속되면 객관적인 중재가 필요할 수 있으니, 필요시 말씀해 주세요.',

            '직장 내 관계 문제는 매일 함께 일해야 하기에 더욱 스트레스가 크죠. 충분히 이해합니다.\n\n' +
            '**실질적 조언:** 감정이 격해질 때는 잠시 자리를 피해 마음을 가라앉히는 게 중요합니다. ' +
            '화장실이나 휴게실에서 5분 정도 심호흡을 해보세요.\n\n' +
            '이는 어느 한쪽의 잘잘못이 아니라 소통 방식의 차이일 수 있습니다.',

            '팀 내 갈등으로 인한 심리적 부담이 크시겠습니다.\n\n' +
            '**실질적 조언:** 가능하면 업무적인 대화로 한정하고, 감정적인 표현은 잠시 보류하는 게 도움됩니다. ' +
            '필요한 경우 이메일이나 메신저로 정리해서 전달하는 것도 방법입니다.\n\n' +
            '절대 혼자 끙끙 앓지 마시고, 도움이 필요하면 언제든 보건실로 오세요.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // ===== (3) 개인 사생활/가정 문제 =====
    if (msg.includes('가정') || msg.includes('가족') || msg.includes('집') ||
        msg.includes('아이') || msg.includes('부모') || msg.includes('개인적')) {

        const responses = [
            '일과 삶의 균형이 무너진 것 같아 마음이 많이 힘드시겠습니다.\n\n' +
            '**실질적 조언:** 퇴근 후에는 가능한 한 업무 생각을 내려놓고, ' +
            '온전히 가족과 자신을 위한 시간을 가지시길 권합니다.\n\n' +
            '필요하다면 외부 전문 심리상담(EAP)이나 협력 병원 연계가 가능합니다. ' +
            '이 대화는 완전히 비밀이 보장되니 안심하세요.',

            '개인적인 고민을 말씀해주셔서 고맙습니다. 가정과 직장을 동시에 챙기기란 정말 어려운 일입니다.\n\n' +
            '**실질적 조언:** 완벽하려 하지 마세요. 우선순위를 정하고, 할 수 있는 것부터 하나씩 해결하시면 됩니다.\n\n' +
            '심리적 부담이 크다면 전문 상담사와의 연결도 가능하니, 필요시 말씀해 주세요.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // ===== (4) 신체적 증상 호소 =====
    if (msg.includes('아프') || msg.includes('통증') || msg.includes('두통') ||
        msg.includes('어지럽') || msg.includes('불면') || msg.includes('잠') ||
        msg.includes('건강') || msg.includes('피곤')) {

        return '신체적 불편함을 느끼고 계시는군요. 몸이 보내는 신호에 주의를 기울여야 합니다.\n\n' +
            '**중요 안내:** 저는 AI 상담사로서 의학적 진단을 내릴 수 없습니다. ' +
            '증상이 심하거나 지속된다면 즉시 사내 보건실을 방문하시거나, ' +
            '협력 병원(MOU 체결 병원)에서 진료를 받으시길 강력히 권장합니다.\n\n' +
            '**간단한 팁:** 충분한 수분 섭취(하루 1.5L 이상)와 규칙적인 스트레칭이 도움될 수 있습니다.';
    }

    // ===== (5) 안전 보호구 착용 불만 =====
    if (msg.includes('안전모') || msg.includes('귀마개') || msg.includes('보호구') ||
        msg.includes('착용') || msg.includes('답답') || msg.includes('불편')) {

        return '안전 보호구 착용이 더위나 답답함으로 불편하신 것, 충분히 이해합니다.\n\n' +
            '**하지만:** 보건관리자님의 안전 철학에 따라, 이는 단순한 규칙이 아니라 ' +
            '**귀하의 안전과 가족의 행복**을 지키기 위한 필수 조치입니다.\n\n' +
            '착용 상태가 불편하시다면 보건실로 오셔서 점검을 받아보시기 바랍니다. ' +
            '더 편한 제품으로 교체가 가능할 수도 있습니다.';
    }

    // ===== (6) 불안/걱정 =====
    if (msg.includes('불안') || msg.includes('걱정') || msg.includes('무섭') ||
        msg.includes('두렵')) {

        return '불안한 마음이 크시군요. 그런 감정은 매우 자연스러운 반응입니다.\n\n' +
            '**실질적 조언:** 불안할 때는 호흡에 집중해보세요. ' +
            '천천히 4초 들이마시고, 4초 참았다가, 4초 내쉬는 것을 5회 반복하면 도움이 됩니다.\n\n' +
            '불안감이 지속되면 전문 상담이 필요할 수 있으니, 주저하지 마시고 말씀해 주세요.';
    }

    // ===== (7) 우울/무기력 =====
    if (msg.includes('우울') || msg.includes('무기력') || msg.includes('의욕') ||
        msg.includes('슬프')) {

        return '우울한 감정을 말씀해주시는 게 쉽지 않았을 텐데, 용기 내주셔서 감사합니다.\n\n' +
            '**실질적 조언:** 작은 것부터 시작하세요. 오늘 할 수 있는 한 가지만 정하고 실천해보세요. ' +
            '점심 산책 10분, 좋아하는 음악 듣기 등 무엇이든 좋습니다.\n\n' +
            '우울감이 2주 이상 지속된다면 반드시 전문가와 상담하시기 바랍니다. ' +
            '협력 병원 연계가 가능합니다.';
    }

    // ===== (8) 감사 표현 =====
    if (msg.includes('감사') || msg.includes('고마') || msg.includes('도움')) {
        return '제가 조금이라도 도움이 되었다니 다행입니다. 이것이 제 역할입니다.\n\n' +
            '언제든 어려움이 있으시면 다시 찾아와 주세요. ' +
            '보건관리자님과 함께 항상 여러분의 건강을 최우선으로 생각하고 있습니다.';
    }

    // ===== (9) 인사 =====
    if (msg.includes('안녕') || msg.includes('처음') || msg.includes('반가')) {
        return '안녕하세요. 구영테크 보건 상담 AI입니다.\n\n' +
            '직장 생활이나 개인적인 고민, 건강 관련 어려움 등 무엇이든 편하게 말씀해 주세요. ' +
            '경청하고 실질적인 조언을 드리겠습니다.';
    }

    // ===== 기본 응답 (공감 + 경청) =====
    const defaultResponses = [
        '말씀하신 내용을 잘 들었습니다. 그런 상황이셨다면 정말 힘드셨을 것 같습니다.\n\n' +
        '조금 더 구체적으로 말씀해 주시면, 더 실질적인 조언을 드릴 수 있을 것 같습니다. ' +
        '어떤 부분이 가장 힘드셨나요?',

        '충분히 그럴 수 있습니다. 혼자 감당하기 어려운 상황이시군요.\n\n' +
        '더 자세히 말씀해 주시면 함께 해결 방법을 찾아보겠습니다. 편하게 이야기해 주세요.',

        '그러셨군요. 그 상황에서 많이 속상하고 힘드셨을 것 같습니다.\n\n' +
        '어떤 도움이 필요하신지 말씀해 주시면, 최선을 다해 조언 드리겠습니다.'
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// 관리자 모니터링
function updateAdminMonitoring() {
    const allSessions = getCounselingStorage();
    const userFilter = document.getElementById('user-filter');
    const countEl = document.getElementById('total-users-count');
    const container = document.getElementById('all-conversations');

    if (!userFilter || !countEl || !container) return;

    const users = Object.entries(allSessions);
    countEl.textContent = users.length;

    // 필터 옵션 업데이트
    const currentFilter = userFilter.value;
    userFilter.innerHTML = '<option value="all">전체 사용자</option>' +
        users.map(([key, data]) => `<option value="${key}">${data.name}</option>`).join('');
    userFilter.value = currentFilter;

    filterCounselingUsers();
}

function filterCounselingUsers() {
    const allSessions = getCounselingStorage();
    const filter = document.getElementById('user-filter')?.value;
    const container = document.getElementById('all-conversations');
    if (!container) return;

    const filtered = filter === 'all' ?
        Object.entries(allSessions) :
        Object.entries(allSessions).filter(([key]) => key === filter);

    container.innerHTML = filtered.map(([key, data]) => `
                <div class="gu-card p-6 bg-slate-50">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <p class="font-black text-slate-800">${data.name}</p>
                            <p class="text-xs text-slate-500">마지막 접속: ${new Date(data.lastAccess).toLocaleString('ko-KR')}</p>
                        </div>
                    </div>
                    <div class="space-y-3 max-h-96 overflow-y-auto">
                        ${data.history.map(msg => {
        if (msg.role === 'user') {
            return `<div class="bg-purple-100 p-3 rounded-lg"><strong>사용자:</strong> ${msg.content}</div>`;
        } else {
            return `<div class="bg-white p-3 rounded-lg border border-slate-200"><strong>AI:</strong> ${msg.content}</div>`;
        }
    }).join('')}
                    </div>
                </div>
            `).join('');
}

// ========================================
// 설문조사 결과 시각화 (개선)
// ========================================
function renderSurveyResults() {
    const responses = JSON.parse(localStorage.getItem('g_survey_responses') || '[]');

    // 총 응답자 수
    const totalEl = document.getElementById('total-responses');
    if (totalEl) totalEl.textContent = responses.length;

    // 부서별 통계
    const deptCounts = {};
    responses.forEach(r => {
        const dept = r.dept || '미지정';
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    const deptBreakdown = Object.entries(deptCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([dept, count]) => `${dept}: ${count}명`)
        .join(', ') || '-';
    const deptEl = document.getElementById('dept-breakdown');
    if (deptEl) deptEl.textContent = deptBreakdown;

    // 항목별 통계
    const itemCounts = {};
    responses.forEach(r => {
        if (r.items && Array.isArray(r.items)) {
            r.items.forEach(item => {
                itemCounts[item] = (itemCounts[item] || 0) + 1;
            });
        }
    });

    const totalRequests = Object.values(itemCounts).reduce((a, b) => a + b, 0);
    const avgEl = document.getElementById('avg-items');
    if (avgEl) {
        avgEl.textContent = responses.length > 0
            ? (totalRequests / responses.length).toFixed(1)
            : '0';
    }

    // 차트 렌더링 (기존 차트 인스턴스 제거 후 재생성)
    const chartCanvas = document.getElementById('surveyChart');
    if (chartCanvas && window.Chart) {
        // 기존 차트 인스턴스 제거
        if (window.surveyChartInstance) {
            window.surveyChartInstance.destroy();
        }

        const ctx = chartCanvas.getContext('2d');
        const sortedItems = Object.keys(itemCounts).sort((a, b) => itemCounts[b] - itemCounts[a]);
        window.surveyChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedItems,
                datasets: [{
                    label: '요청 횟수',
                    data: sortedItems.map(k => itemCounts[k]),
                    backgroundColor: '#14b8a6',
                    borderColor: '#0d9488',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.parsed.y}회 요청`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 전체 응답 목록 표시 (개선)
    renderSurveyResponseList(responses);
}

function renderSurveyResponseList(responses) {
    const container = document.getElementById('survey-comments');
    if (!container) return;

    if (responses.length === 0) {
        container.innerHTML = '<p class="text-sm text-slate-500 text-center py-8">아직 응답이 없습니다.</p>';
        return;
    }

    // 최신순 정렬
    const sortedResponses = [...responses].sort((a, b) =>
        new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
    );

    const html = `
        <div class="mb-4 flex items-center justify-between">
            <p class="text-sm font-bold text-slate-600">총 ${responses.length}건의 응답</p>
            <button onclick="exportSurveyToCSV()" class="px-4 py-2 bg-teal-500 text-white rounded-lg text-xs font-bold hover:bg-teal-600">
                <i class="fas fa-download"></i> CSV 다운로드
            </button>
        </div>
        <div class="space-y-3 max-h-[600px] overflow-y-auto">
            ${sortedResponses.map((r, idx) => `
                <div class="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 hover:border-teal-300 transition-colors">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <p class="font-black text-slate-800">${r.dept || '미지정'} - ${r.name || '익명'}</p>
                            <p class="text-xs text-slate-500 mt-1">
                                ${r.timestamp ? new Date(r.timestamp).toLocaleString('ko-KR') : '날짜 미기록'}
                            </p>
                        </div>
                        <span class="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-bold">
                            #${responses.length - idx}
                        </span>
                    </div>
                    ${r.items && r.items.length > 0 ? `
                        <div class="mb-3">
                            <p class="text-xs font-bold text-slate-600 mb-2">선택한 항목:</p>
                            <div class="flex flex-wrap gap-2">
                                ${r.items.map(item => `
                                    <span class="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold">
                                        ${item}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${r.comments ? `
                        <div class="mb-2">
                            <p class="text-xs font-bold text-slate-600 mb-1">추가 요청사항:</p>
                            <p class="text-sm text-slate-700 bg-white p-3 rounded-lg">${r.comments}</p>
                        </div>
                    ` : ''}
                    ${r.additionalRequests ? `
                        <div>
                            <p class="text-xs font-bold text-slate-600 mb-1">추가 구급약품:</p>
                            <p class="text-sm text-slate-700 bg-white p-3 rounded-lg">${r.additionalRequests}</p>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = html;
}

// 설문결과 탭 활성화 시 렌더링은 changeTab 함수 내에서 처리됨

// 의약품 설문조사 기간 관리 및 제출
function saveSurveyPeriod() {
    if (!isAdminLoggedIn()) { alert('관리자 권한이 필요합니다.'); return; }
    const s = document.getElementById('survey-start-date').value;
    const e = document.getElementById('survey-end-date').value;
    if (!s || !e) { alert('시작일과 종료일을 모두 입력해주세요.'); return; }
    if (new Date(s) > new Date(e)) { alert('종료일은 시작일 이후여야 합니다.'); return; }
    localStorage.setItem('g_survey_period', JSON.stringify({ startDate: s, endDate: e }));
    alert('설문조사 기간이 저장되었습니다.');
    updateSurveyPeriodStatus();
}

function loadSurveyPeriod() {
    const s = localStorage.getItem('g_survey_period');
    if (s) {
        const p = JSON.parse(s);
        const a = document.getElementById('survey-start-date');
        const b = document.getElementById('survey-end-date');
        if (a) a.value = p.startDate;
        if (b) b.value = p.endDate;
    }
    updateSurveyPeriodStatus();
}

function updateSurveyPeriodStatus() {
    const s = localStorage.getItem('g_survey_period');
    const el = document.getElementById('survey-period-status');
    if (!el) return;
    if (!s) { el.innerHTML = '<i class="fas fa-info-circle text-amber-600"></i> 기간이 설정되지 않았습니다.'; return; }
    const p = JSON.parse(s);
    const n = new Date();
    const a = new Date(p.startDate);
    const b = new Date(p.endDate);
    b.setHours(23, 59, 59, 999);
    if (n < a) el.innerHTML = `<i class="fas fa-clock text-blue-600"></i> 설문 시작 일정: <strong>${p.startDate}</strong> ~ <strong>${p.endDate}</strong>`;
    else if (n > b) el.innerHTML = `<i class="fas fa-ban text-red-600"></i> 설문조사 기간 종료: <strong>${p.startDate}</strong> ~ <strong>${p.endDate}</strong>`;
    else el.innerHTML = `<i class="fas fa-check-circle text-green-600"></i> 설문 진행 중: <strong>${p.startDate}</strong> ~ <strong>${p.endDate}</strong>`;
}

function checkSurveyPeriod() {
    const s = localStorage.getItem('g_survey_period');
    if (!s) return true;
    const p = JSON.parse(s);
    const n = new Date();
    const a = new Date(p.startDate);
    const b = new Date(p.endDate);
    b.setHours(23, 59, 59, 999);
    return n >= a && n <= b;
}

function submitSurvey(e) {
    e.preventDefault();

    // 설문 기간 확인
    if (!checkSurveyPeriod()) {
        alert('현재 설문조사 기간이 아닙니다.');
        return false;
    }

    // 폼 데이터 수집
    const dept = document.getElementById('survey-dept').value.trim();
    const name = document.getElementById('survey-name').value.trim();
    const items = Array.from(document.querySelectorAll('input[name="medicine-item"]:checked')).map(cb => cb.value);
    const comments = document.getElementById('survey-comments').value.trim();
    const add = document.getElementById('survey-additional').value.trim();

    // 유효성 검사
    if (!dept || !name) {
        alert('부서와 성함을 모두 입력해주세요.');
        return false;
    }
    if (items.length === 0 && !comments && !add) {
        alert('하나 이상의 항목을 선택하거나 요청사항을 입력해주세요.');
        return false;
    }

    // 응답 데이터 생성
    const response = {
        timestamp: new Date().toISOString(),
        dept: dept,
        name: name,
        items: items,
        comments: comments,
        additionalRequests: add
    };

    // localStorage에 저장 (관리자가 볼 수 있도록)
    const responses = JSON.parse(localStorage.getItem('g_survey_responses') || '[]');
    responses.push(response);
    localStorage.setItem('g_survey_responses', JSON.stringify(responses));

    // Netlify Forms를 위한 hidden 필드 업데이트 (선택한 항목들을 쉼표로 구분)
    const netlifyItemsField = document.getElementById('netlify-selected-items');
    if (netlifyItemsField) {
        netlifyItemsField.value = items.join(', ');
    }

    // Netlify Forms에 제출하기 위한 hidden 필드 설정
    const form = document.getElementById('medicine-survey-form');
    if (form) {
        // Netlify가 인식할 수 있도록 폼 데이터 설정
        // Netlify는 name 속성을 가진 input을 자동으로 수집합니다
        // 이미 HTML에 name 속성이 있으므로 그대로 제출하면 됩니다

        // 제출 전 사용자에게 알림
        alert('설문 응답이 제출되었습니다. 감사합니다!');

        // Netlify 제출 (onsubmit 이벤트 리스너 제거 후 실제 submit)
        form.onsubmit = null;
        form.submit();
    }

    return false;
}

if (typeof changeTab !== 'undefined') {
    const _ct = changeTab;
    changeTab = function (tid) {
        _ct(tid);
        if (tid === 'survey-results') setTimeout(renderSurveyResults, 100);
        else if (tid === 'medicine-survey') setTimeout(loadSurveyPeriod, 50);
    };
}

// PC/Mobile 뷰 모드 전환
function toggleViewMode(mode) {
    const mobileBtn = document.getElementById('mobile-view-btn');
    const pcBtn = document.getElementById('pc-view-btn');
    const viewport = document.querySelector('meta[name="viewport"]');

    if (mode === 'mobile') {
        mobileBtn.classList.add('active');
        pcBtn.classList.remove('active');
        // 모바일 최적화 viewport
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        document.body.style.fontSize = '14px';
    } else {
        pcBtn.classList.add('active');
        mobileBtn.classList.remove('active');
        // PC 뷰 viewport (확대/축소 가능)
        viewport.setAttribute('content', 'width=1024');
        document.body.style.fontSize = '16px';
    }
}

// ===== 로그인 모드 선택 =====
function selectMode(mode) {
    if (mode === 'visitor') {
        // 일반 모드 선택 - 바로 모달 닫기
        document.getElementById('auth-modal').classList.add('hidden');
        // 일반 모드는 별도 처리 없음 (이미 일반 모드 상태)
    } else if (mode === 'admin') {
        // 관리자 모드 선택 - 비밀번호 입력 단계로 이동
        document.getElementById('mode-selection-step').classList.add('hidden');
        document.getElementById('admin-password-step').classList.remove('hidden');
        document.getElementById('auth-password').value = '';
        document.getElementById('auth-error').classList.add('hidden');
        // 비밀번호 입력 필드에 포커스
        setTimeout(() => document.getElementById('auth-password').focus(), 100);
    }
}

// 모드 선택으로 돌아가기
function backToModeSelection() {
    document.getElementById('admin-password-step').classList.add('hidden');
    document.getElementById('mode-selection-step').classList.remove('hidden');
    document.getElementById('auth-password').value = '';
    document.getElementById('auth-error').classList.add('hidden');
}

// ===== 인증 시스템 =====
const ADMIN_PASSWORD = '8078';

function isAdminLoggedIn() {
    const mode = localStorage.getItem('g_auth_mode');
    const timestamp = localStorage.getItem('g_auth_timestamp');

    if (!mode || mode !== 'admin') return false;

    // 24시간 세션 타임아웃
    if (timestamp) {
        const diff = Date.now() - parseInt(timestamp);
        if (diff > 24 * 60 * 60 * 1000) {
            logout();
            return false;
        }
    }

    return true;
}

function toggleAuth() {
    // 모달 열기 시 항상 모드 선택 단계로 초기화
    document.getElementById('mode-selection-step').classList.remove('hidden');
    document.getElementById('admin-password-step').classList.add('hidden');
    document.getElementById('auth-modal').classList.remove('hidden');
}

function attemptLogin() {
    const password = document.getElementById('auth-password').value;

    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('g_auth_mode', 'admin');
        localStorage.setItem('g_auth_timestamp', Date.now().toString());
        document.getElementById('auth-modal').classList.add('hidden');
        document.getElementById('auth-error').classList.add('hidden');
        updateAuthUI();
        renderNavigation();

        // 동적 렌더링 업데이트
        renderEmergencyContacts();
        renderInnovations();
        renderMemberTable(APP_DATA.members);

        alert('관리자 모드로 로그인되었습니다.');
    } else {
        document.getElementById('auth-error').classList.remove('hidden');
    }
}

function logout() {
    localStorage.removeItem('g_auth_mode');
    localStorage.removeItem('g_auth_timestamp');
    updateAuthUI();
    renderNavigation();

    // 동적 렌더링 업데이트
    renderEmergencyContacts();
    renderInnovations();
    renderMemberTable(APP_DATA.members);

    alert('로그아웃되었습니다.');
}

function updateAuthUI() {
    const isAdmin = isAdminLoggedIn();
    const btnDesktop = document.getElementById('auth-toggle-btn');
    const btnMobile = document.getElementById('auth-btn-mobile');

    if (isAdmin) {
        if (btnDesktop) {
            btnDesktop.innerHTML = '<i class="fas fa-user-shield"></i> 관리자 모드';
            btnDesktop.className = 'px-4 py-2 rounded-lg font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors';
            btnDesktop.onclick = logout;
        }
        if (btnMobile) {
            btnMobile.innerHTML = '<i class="fas fa-user-shield"></i>';
            btnMobile.className = 'px-3 py-1.5 rounded-lg font-bold text-xs bg-red-500 text-white hover:bg-red-600 transition-colors';
            btnMobile.onclick = logout;
        }
    } else {
        if (btnDesktop) {
            btnDesktop.innerHTML = '<i class="fas fa-lock"></i> 관리자 로그인';
            btnDesktop.className = 'px-4 py-2 rounded-lg font-bold text-sm bg-teal-500 text-white hover:bg-teal-600 transition-colors';
            btnDesktop.onclick = toggleAuth;
        }
        if (btnMobile) {
            btnMobile.innerHTML = '<i class="fas fa-lock"></i>';
            btnMobile.className = 'px-3 py-1.5 rounded-lg font-bold text-xs bg-teal-500 text-white hover:bg-teal-600 transition-colors';
            btnMobile.onclick = toggleAuth;
        }
    }
}

function renderNavigation() {
    // 내비게이션 관련 처리 (필요 시 추가)
}

// 페이지 초기화 - 일반 모드로 시작
window.addEventListener('DOMContentLoaded', function () {
    // 로그인하지 않은 상태로 강제 초기화
    if (!isAdminLoggedIn()) {
        localStorage.removeItem('g_auth_mode');
        localStorage.removeItem('g_auth_timestamp');
    }
    updateAuthUI();
    renderNavigation();
    // initApp(); // index.html에서 초기화 담당

    // 관리자 상담 모니터링 업데이트
    if (isAdminLoggedIn()) {
        updateAdminMonitoring();
    }

    // V3.8: 건강상담 일정 초기화
    renderSchedule();

    // V3.9: 시스템 설정 불러오기 및 동적 렌더링
    loadSystemConfig();
    renderEmergencyContacts();
    renderAnnouncement();

    // ===== 페이지 로드 시 자동 모드 선택 모달 =====
    // 로그인되지 않은 상태면 자동으로 모드 선택 창 표시
    if (!isAdminLoggedIn()) {
        setTimeout(() => {
            document.getElementById('mode-selection-step').classList.remove('hidden');
            document.getElementById('admin-password-step').classList.add('hidden');
            document.getElementById('auth-modal').classList.remove('hidden');
        }, 500); // 0.5초 후 모달 표시 (부드러운 UX)
    }
});

// ========================================
// 건강검진 관리 함수
// ========================================
function renderHealthCheckupList() {
    const tbody = document.getElementById('health-checkup-table-body');
    const emptyMsg = document.getElementById('health-checkup-empty-message');
    if (!tbody) return;

    // 전체 인원명부가 비어있으면 안내 메시지 표시
    // 주의: 인원명부에 있는 사람들이 전체 인원입니다.
    // convert_excel_to_json.py 스크립트를 실행하여 엑셀 파일에서 로드해야 합니다.
    if (APP_DATA.healthCheckupMembers.length === 0) {
        if (emptyMsg) emptyMsg.classList.remove('hidden');
        tbody.innerHTML = '';
        updateHealthCheckupStats();
        return;
    }

    // 필터링 적용
    let filtered = [...APP_DATA.healthCheckupMembers];

    // 상태 필터
    if (currentCheckupFilter === 'completed') {
        filtered = filtered.filter(m => m.status === 'completed');
    } else if (currentCheckupFilter === 'pending') {
        filtered = filtered.filter(m => m.status === 'pending');
    }

    // 부서 필터
    if (currentCheckupDept !== 'all') {
        filtered = filtered.filter(m => m.factory === currentCheckupDept);
    }

    // 검색 필터
    if (currentCheckupSearch) {
        filtered = filtered.filter(m =>
            m.name.toLowerCase().includes(currentCheckupSearch) ||
            m.dept.toLowerCase().includes(currentCheckupSearch)
        );
    }

    // 데이터가 없으면 안내 메시지 표시
    if (filtered.length === 0) {
        if (emptyMsg) emptyMsg.classList.remove('hidden');
        tbody.innerHTML = '';
        updateHealthCheckupStats();
        return;
    }

    if (emptyMsg) emptyMsg.classList.add('hidden');

    const isAdmin = isAdminLoggedIn();
    const html = filtered.map((member, idx) => {
        // 원본 배열에서의 인덱스 찾기
        const originalIdx = APP_DATA.healthCheckupMembers.findIndex(m =>
            m.name === member.name && m.dept === member.dept
        );
        return `
        <tr class="hover:bg-slate-50">
            <td class="p-4 font-bold">${member.name}</td>
            <td class="p-4 text-slate-600">${member.dept}</td>
            <td class="p-4 text-slate-600">${member.factory}</td>
            <td class="p-4 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-black ${member.status === 'completed' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'}">
                    ${member.status === 'completed' ? '완료' : '미완료'}
                </span>
            </td>
            <td class="p-4 text-center text-sm text-slate-600">${member.checkupDate || '-'}</td>
            ${isAdmin ? `<td class="p-4 text-center">
                <button onclick="editHealthCheckup(${originalIdx})" class="px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs font-bold hover:bg-blue-200">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteHealthCheckup(${originalIdx})" class="px-3 py-1 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200 ml-2">
                    <i class="fas fa-trash"></i>
                </button>
            </td>` : ''}
        </tr>
    `;
    }).join('');

    tbody.innerHTML = html;
    updateHealthCheckupStats();
}

function updateHealthCheckupStats() {
    const total = APP_DATA.healthCheckupMembers.length;
    const completed = APP_DATA.healthCheckupMembers.filter(m => m.status === 'completed').length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const totalEl = document.getElementById('checkup-total');
    const completedEl = document.getElementById('checkup-completed');
    const pendingEl = document.getElementById('checkup-pending');
    const rateEl = document.getElementById('checkup-rate');

    if (totalEl) totalEl.textContent = total;
    if (completedEl) completedEl.textContent = completed;
    if (pendingEl) pendingEl.textContent = pending;
    if (rateEl) rateEl.textContent = rate + '%';
}


let currentCheckupFilter = 'all';
let currentCheckupDept = 'all';
let currentCheckupSearch = '';

function searchHealthCheckup() {
    currentCheckupSearch = document.getElementById('checkup-search').value.toLowerCase();
    renderHealthCheckupList();
}

function filterHealthCheckupByDept() {
    currentCheckupDept = document.getElementById('checkup-dept-filter').value;
    renderHealthCheckupList();
}

function filterHealthCheckup(type) {
    currentCheckupFilter = type;
    // 필터 버튼 스타일 업데이트
    document.querySelectorAll('.filter-checkup-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-slate-800', 'text-white');
    });

    const activeBtn = type === 'all' ? document.getElementById('btn-checkup-all') :
        type === 'completed' ? document.getElementById('btn-checkup-completed') :
            document.getElementById('btn-checkup-pending');
    if (activeBtn) {
        activeBtn.classList.add('active', 'bg-slate-800', 'text-white');
    }

    renderHealthCheckupList();
}

function addHealthCheckupMember() {
    if (!isAdminLoggedIn()) {
        alert('관리자 권한이 필요합니다.');
        return;
    }

    const name = prompt('성명을 입력하세요:');
    if (!name) return;

    const dept = prompt('부서를 입력하세요:');
    if (!dept) return;

    const factory = prompt('공장을 입력하세요 (1공장/2공장):', '1공장');

    APP_DATA.healthCheckupMembers.push({
        name: name,
        dept: dept,
        factory: factory,
        checkupDate: null,
        status: 'pending'
    });

    renderHealthCheckupList();
    alert('인원이 추가되었습니다.');
}

function editHealthCheckup(idx) {
    if (!isAdminLoggedIn()) {
        alert('관리자 권한이 필요합니다.');
        return;
    }

    const member = APP_DATA.healthCheckupMembers[idx];
    const newDate = prompt('검진일을 입력하세요 (YYYY-MM-DD):', member.checkupDate || '');
    if (newDate === null) return;

    member.checkupDate = newDate || null;
    member.status = newDate ? 'completed' : 'pending';

    renderHealthCheckupList();
    alert('수정되었습니다.');
}

function deleteHealthCheckup(idx) {
    if (!isAdminLoggedIn()) {
        alert('관리자 권한이 필요합니다.');
        return;
    }

    if (!confirm('정말 삭제하시겠습니까?')) return;

    APP_DATA.healthCheckupMembers.splice(idx, 1);
    renderHealthCheckupList();
    alert('삭제되었습니다.');
}

// ========================================
// 스트레칭 영상 함수
// ========================================
function renderStretchingVideos() {
    const container = document.getElementById('stretching-video-list');
    if (!container) return;

    const isAdmin = isAdminLoggedIn();
    const html = APP_DATA.stretchingVideos.map(video => `
        <div class="bg-slate-50 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-orange-300 transition-colors">
            <div class="aspect-video bg-black flex items-center justify-center">
                <video controls class="w-full h-full" style="max-height: 200px;">
                    <source src="${video.videoUrl}" type="video/mp4">
                </video>
            </div>
            <div class="p-4">
                <h4 class="font-black text-slate-800 mb-2">${video.title}</h4>
                <p class="text-xs text-slate-600 mb-2">${video.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-400">${video.category}</span>
                    ${isAdmin ? `<div class="flex gap-2">
                        <button onclick="editStretchingVideo(${video.id})" class="text-xs text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteStretchingVideo(${video.id})" class="text-xs text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function addStretchingVideo() {
    if (!isAdminLoggedIn()) {
        alert('관리자 권한이 필요합니다.');
        return;
    }

    const title = prompt('영상 제목을 입력하세요:');
    if (!title) return;

    const description = prompt('영상 설명을 입력하세요:', '');
    const videoUrl = prompt('영상 파일 경로 또는 URL을 입력하세요:', '');
    if (!videoUrl) return;

    const category = prompt('카테고리를 입력하세요 (전체/목/어깨/허리 등):', '전체');

    const newVideo = {
        id: Math.max(...APP_DATA.stretchingVideos.map(v => v.id), 0) + 1,
        title: title,
        description: description || '',
        videoUrl: videoUrl,
        thumbnail: '',
        duration: '',
        category: category || '전체',
        createdAt: new Date().toISOString().split('T')[0]
    };

    APP_DATA.stretchingVideos.push(newVideo);
    renderStretchingVideos();
    alert('영상이 추가되었습니다.');
}

function editStretchingVideo(id) {
    if (!isAdminLoggedIn()) {
        alert('관리자 권한이 필요합니다.');
        return;
    }

    const video = APP_DATA.stretchingVideos.find(v => v.id === id);
    if (!video) return;

    const title = prompt('영상 제목을 입력하세요:', video.title);
    if (title === null) return;

    video.title = title;
    video.description = prompt('영상 설명을 입력하세요:', video.description) || video.description;

    renderStretchingVideos();
    alert('수정되었습니다.');
}

function deleteStretchingVideo(id) {
    if (!isAdminLoggedIn()) {
        alert('관리자 권한이 필요합니다.');
        return;
    }

    if (!confirm('정말 삭제하시겠습니까?')) return;

    const idx = APP_DATA.stretchingVideos.findIndex(v => v.id === id);
    if (idx !== -1) {
        APP_DATA.stretchingVideos.splice(idx, 1);
        renderStretchingVideos();
        alert('삭제되었습니다.');
    }
}