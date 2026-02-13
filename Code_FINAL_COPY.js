/**
 * G-System Google Sheets Backend
 * 배포: 웹 앱으로 배포 후 "액세스: 모든 사용자" 선택, URL을 index.html의 GAS_URL에 넣으세요.
 */

var SHEET_NAMES = {
    members: 'Members',
    risks: 'Risks',
    noise: 'Noise',
    expenses: 'Expenses',
    innovations: 'Innovations',
    config: 'Config'
};

function doGet(e) {
    try {
        var result = getAllData();
        return createJsonResponse(result);
    } catch (err) {
        return createJsonResponse({ error: err.toString() });
    }
}

function doOptions(e) {
    // CORS 프리플라이트 요청 처리 (GitHub Pages 등 크로스 오리진 요청 허용)
    // Google Apps Script는 "모든 사용자"로 배포하면 자동으로 CORS가 처리됩니다.
    // 주의: ContentService에는 .addHeader() 메서드가 없습니다. 사용 시 에러가 발생하여 CORS 오류의 원인이 됩니다.
    return ContentService
        .createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
    var params = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    var action = params.action;
    var payload = params.payload || {};
    var out = { ok: false, message: '' };

    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();

        switch (action) {
            case 'saveMembers':
                writeMembers(ss, payload);
                out.ok = true;
                break;
            case 'saveRisks':
                writeRisks(ss, payload);
                out.ok = true;
                break;
            case 'saveNoise':
                writeNoise(ss, payload);
                out.ok = true;
                break;
            case 'saveInnovations':
                writeInnovations(ss, payload);
                out.ok = true;
                break;
            case 'saveEmergencyContacts':
                writeConfigKey(ss, 'emergencyContacts', payload);
                out.ok = true;
                break;
            case 'saveStretchingVideos':
                writeConfigKey(ss, 'stretchingVideos', payload);
                out.ok = true;
                break;
            case 'saveMedicineSurveyUrl':
                writeConfigKey(ss, 'medicine_survey_url', payload.url !== undefined ? payload.url : '');
                out.ok = true;
                break;
            case 'saveConsultationSchedule':
                if (payload.factory1) writeConfigKey(ss, 'factory1', payload.factory1);
                if (payload.factory2) writeConfigKey(ss, 'factory2', payload.factory2);
                out.ok = true;
                break;
            case 'saveExpenses':
                writeExpenses(ss, payload.year, payload.expenses || []);
                out.ok = true;
                break;
            case 'saveFloorplans':
                writeConfigKey(ss, 'floorplans', payload);
                out.ok = true;
                break;
            default:
                out.message = 'Unknown action: ' + action;
        }
    } catch (err) {
        out.message = err.toString();
    }

    return createJsonResponse(out);
}

function createJsonResponse(obj) {
    var json = JSON.stringify(obj);
    // Google Apps Script는 "모든 사용자"로 배포하면 자동으로 CORS가 처리됩니다
    // ContentService는 직접 CORS 헤더를 설정할 수 없지만(addHeader 없음), 배포 설정으로 해결됩니다
    return ContentService
        .createTextOutput(json)
        .setMimeType(ContentService.MimeType.JSON);
}

function getAllData() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var config = readConfig(ss);
    // floorplans가 빈 객체가 아닌 경우에만 반환 (factory1 또는 factory2가 있어야 함)
    var floorplans = {};
    if (config.floorplans && typeof config.floorplans === 'object') {
        if (config.floorplans.factory1 || config.floorplans.factory2) {
            floorplans = config.floorplans;
        }
    }
    return {
        members: readMembers(ss),
        risks: readSheet(ss, SHEET_NAMES.risks, ['type', 'dept', 'health', 'action', 'level']),
        noise: readSheet(ss, SHEET_NAMES.noise, ['factory', 'processName', 'processDept', 'measuredDb', 'standardDb', 'result', 'protectionGear']),
        innovations: readSheet(ss, SHEET_NAMES.innovations, ['category', 'title', 'desc', 'date', 'imageUrl', 'savings']),
        expenses_2025: readExpensesByYear(ss, 2025),
        expenses_2026: readExpensesByYear(ss, 2026),
        floorplans: floorplans,
        config: config
    };
}

function readSheet(ss, sheetName, columns) {
    var sh = ss.getSheetByName(sheetName);
    if (!sh) return [];
    var data = sh.getDataRange().getValues();
    if (!data || data.length < 2) return [];
    var headers = data[0];
    var out = [];
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var obj = {};
        for (var c = 0; c < columns.length; c++) {
            var key = columns[c];
            var val = row[c];
            if (key === 'measuredDb' || key === 'standardDb' || key === 'savings') val = typeof val === 'number' ? val : (parseFloat(val) || 0);
            obj[key] = val !== undefined && val !== '' ? val : (key === 'savings' ? undefined : '');
        }
        out.push(obj);
    }
    return out;
}

function readMembers(ss) {
    var sh = ss.getSheetByName(SHEET_NAMES.members);
    if (!sh) return [];
    var data = sh.getDataRange().getValues();
    if (!data || data.length < 2) return [];
    var out = [];
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var counseling = {};
        try {
            counseling = row[5] ? JSON.parse(row[5]) : {};
        } catch (e) { }
        for (var m = 1; m <= 12; m++) if (counseling[m] === undefined) counseling[m] = null;
        out.push({
            name: row[0] || '',
            dept: row[1] || '',
            risk: row[2] || '',
            note: row[3] || '',
            isIntensiveCare: row[4] === true || row[4] === 'TRUE' || row[4] === '1',
            counseling: counseling
        });
    }
    return out;
}

function writeMembers(ss, arr) {
    var sh = getOrCreateSheet(ss, SHEET_NAMES.members);
    sh.clear();
    sh.getRange(1, 1, 1, 6).setValues([['name', 'dept', 'risk', 'note', 'isIntensiveCare', 'counseling']]);
    if (!arr || !arr.length) return;
    var rows = arr.map(function (m) {
        return [
            m.name || '',
            m.dept || '',
            m.risk || '',
            m.note || '',
            m.isIntensiveCare === true ? 'TRUE' : 'FALSE',
            JSON.stringify(m.counseling || {})
        ];
    });
    sh.getRange(2, 1, 1 + rows.length, 6).setValues(rows);
}

function writeRisks(ss, arr) {
    writeSheet(ss, SHEET_NAMES.risks, ['type', 'dept', 'health', 'action', 'level'], arr);
}

function writeNoise(ss, arr) {
    writeSheet(ss, SHEET_NAMES.noise, ['factory', 'processName', 'processDept', 'measuredDb', 'standardDb', 'result', 'protectionGear'], arr);
}

function writeInnovations(ss, arr) {
    writeSheet(ss, SHEET_NAMES.innovations, ['category', 'title', 'desc', 'date', 'imageUrl', 'savings'], arr);
}

function writeSheet(ss, sheetName, columns, arr) {
    var sh = getOrCreateSheet(ss, sheetName);
    sh.clear();
    sh.getRange(1, 1, 1, columns.length).setValues([columns]);
    if (!arr || !arr.length) return;
    var rows = arr.map(function (item) {
        return columns.map(function (col) { return item[col] !== undefined ? item[col] : ''; });
    });
    sh.getRange(2, 1, 1 + rows.length, columns.length).setValues(rows);
}

function readExpensesByYear(ss, year) {
    var sh = ss.getSheetByName(SHEET_NAMES.expenses);
    if (!sh) return [];
    var data = sh.getDataRange().getValues();
    if (!data || data.length < 2) return [];
    var byMonth = {};
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (Number(row[0]) !== year) continue;
        var month = Number(row[1]) || 1;
        if (!byMonth[month]) byMonth[month] = [];
        byMonth[month].push({ name: row[2] || '', amount: Number(row[3]) || 0, hospital: row[4] || '' });
    }
    var result = [];
    for (var m = 1; m <= 12; m++) {
        result.push({ month: m, items: byMonth[m] || [] });
    }
    return result;
}

function writeExpenses(ss, year, monthlyExpenses) {
    var sh = getOrCreateSheet(ss, SHEET_NAMES.expenses);
    var data = sh.getDataRange().getValues();
    var newRows = [];
    for (var i = 1; i < data.length; i++) {
        if (Number(data[i][0]) !== year) newRows.push(data[i]);
    }
    if (monthlyExpenses && monthlyExpenses.length) {
        monthlyExpenses.forEach(function (me) {
            var month = me.month;
            (me.items || []).forEach(function (item) {
                newRows.push([year, month, item.name || '', item.amount || 0, item.hospital || '']);
            });
        });
    }
    sh.clear();
    sh.getRange(1, 1, 1, 5).setValues([['year', 'month', 'name', 'amount', 'hospital']]);
    if (newRows.length) sh.getRange(2, 1, 1 + newRows.length, 5).setValues(newRows);
}

function readConfig(ss) {
    var sh = getOrCreateSheet(ss, SHEET_NAMES.config);
    var data = sh.getDataRange().getValues();
    var config = defaultConfig();
    if (data.length < 2 || !data[0] || data[0][0] !== 'key') {
        sh.clear();
        sh.getRange(1, 1, 1, 2).setValues([['key', 'value']]);
        return config;
    }

    var rawConfig = {};
    for (var i = 1; i < data.length; i++) {
        var key = String(data[i][0] || '').trim();
        var val = data[i][1];
        if (!key) continue;
        rawConfig[key] = val;
    }

    // 청크 데이터 병합 로직
    var mergedConfig = {};

    // 1. 일반 키 처리
    for (var key in rawConfig) {
        if (key.indexOf('_chunk_') === -1) {
            mergedConfig[key] = rawConfig[key];
        }
    }

    // 2. 청크 키 처리 및 병합 (예: floorplans_chunk_0, floorplans_chunk_1 ...)
    // 청크가 있는 키들을 찾아서 조합
    var chunkKeys = Object.keys(rawConfig).filter(function (k) { return k.indexOf('_chunk_') > -1; });
    var processedBaseKeys = [];

    chunkKeys.forEach(function (k) {
        var parts = k.split('_chunk_');
        var baseKey = parts[0];

        if (processedBaseKeys.indexOf(baseKey) === -1) {
            // 해당 baseKey에 대한 모든 청크를 찾아서 순서대로 병합
            var chunks = [];
            var idx = 0;
            while (rawConfig[baseKey + '_chunk_' + idx] !== undefined) {
                chunks.push(rawConfig[baseKey + '_chunk_' + idx]);
                idx++;
            }
            if (chunks.length > 0) {
                mergedConfig[baseKey] = chunks.join('');
            }
            processedBaseKeys.push(baseKey);
        }
    });

    // 3. JSON 파싱 및 설정 적용
    for (var key in mergedConfig) {
        var val = mergedConfig[key];
        try {
            if (typeof val === 'string' && val.trim() !== '' && (val.indexOf('[') === 0 || val.indexOf('{') === 0)) {
                val = JSON.parse(val);
            }
        } catch (e) { }

        if (val !== undefined && val !== null && val !== '') {
            config[key] = val;
        }
    }

    return config;
}

function defaultConfig() {
    return {
        emergencyContacts: [],
        hospitals: [],
        announcements: { title: '', description: '', imageUrl: '' },
        metadata: {},
        factory1: [],
        factory2: [],
        medicine_survey_url: 'https://naver.me/GT4FBECG',
        stretchingVideos: [],
        floorplans: {}
    };
}

function writeConfigKey(ss, key, value) {
    var sh = getOrCreateSheet(ss, SHEET_NAMES.config);
    var data = sh.getDataRange().getValues();

    // 헤더 확인
    if (data.length < 1 || !data[0] || data[0][0] !== 'key') {
        sh.clear();
        sh.getRange(1, 1, 1, 2).setValues([['key', 'value']]);
        data = [['key', 'value']];
    }

    var valToWrite = typeof value === 'object' ? JSON.stringify(value) : (value !== undefined && value !== null ? String(value) : '');
    const CHUNK_SIZE = 45000; // 구글 시트 셀 한도(50000)보다 약간 작게 설정

    // 기존 데이터 삭제 (해당 키 및 해당 키의 청크들)
    var rowsToDelete = [];
    for (var i = 1; i < data.length; i++) {
        var currentKey = String(data[i][0] || '').trim();
        if (currentKey === key || currentKey.indexOf(key + '_chunk_') === 0) {
            rowsToDelete.push(i + 1); // 1-based row index
        }
    }

    // 뒤에서부터 삭제해야 인덱스가 꼬이지 않음
    rowsToDelete.sort(function (a, b) { return b - a; });
    rowsToDelete.forEach(function (r) { sh.deleteRow(r); });

    // 새 데이터 쓰기
    var newRows = [];
    if (valToWrite.length > CHUNK_SIZE) {
        // 청크로 나누어 저장
        var chunks = [];
        for (var i = 0; i < valToWrite.length; i += CHUNK_SIZE) {
            chunks.push(valToWrite.substring(i, i + CHUNK_SIZE));
        }
        chunks.forEach(function (chunk, idx) {
            newRows.push([key + '_chunk_' + idx, chunk]);
        });
    } else {
        // 단일 셀 저장
        newRows.push([key, valToWrite]);
    }

    if (newRows.length > 0) {
        var lastRow = sh.getLastRow();
        sh.getRange(lastRow + 1, 1, newRows.length, 2).setValues(newRows);
    }
}

function getOrCreateSheet(ss, name) {
    var sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    return sh;
}
