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
  config: 'Config',
  gameRankings: 'GameRankings'
};

function doGet(e) {
  try {
    var action = e.parameter.action;
    
    // 게임 랭킹 조회
    if (action === 'getRankings') {
      var rankings = getRankings();
      return createJsonResponse({ ok: true, rankings: rankings });
    }
    
    // 기본 데이터 조회
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
  // text/plain으로 받은 데이터를 JSON으로 파싱
  var params = {};
  try {
    if (e && e.postData && e.postData.contents) {
      var contentType = e.postData.type || '';
      var contents = e.postData.contents;
      
      // text/plain 또는 application/json 모두 처리
      if (contentType.indexOf('application/json') !== -1 || contentType.indexOf('text/plain') !== -1) {
        params = JSON.parse(contents);
      } else {
        // 기본적으로 JSON 파싱 시도
        params = JSON.parse(contents);
      }
    }
  } catch (err) {
    return createJsonResponse({ ok: false, message: 'Invalid JSON: ' + err.toString() });
  }
  
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
      case 'saveRanking':
        saveRanking(ss, payload.name, payload.score);
        out.ok = true;
        out.message = 'Ranking saved successfully';
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
    } catch (e) {}
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
  var rows = arr.map(function(m) {
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
  var rows = arr.map(function(item) {
    return columns.map(function(col) { return item[col] !== undefined ? item[col] : ''; });
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
    monthlyExpenses.forEach(function(me) {
      var month = me.month;
      (me.items || []).forEach(function(item) {
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
  for (var i = 1; i < data.length; i++) {
    var key = String(data[i][0] || '').trim();
    var val = data[i][1];
    if (!key) continue;
    try {
      if (typeof val === 'string' && val.trim() !== '' && (val.indexOf('[') === 0 || val.indexOf('{') === 0)) {
        val = JSON.parse(val);
      }
    } catch (e) {}
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
    medicine_survey_url: '',
    stretchingVideos: [],
    floorplans: {}
  };
}

function writeConfigKey(ss, key, value) {
  var sh = getOrCreateSheet(ss, SHEET_NAMES.config);
  var data = sh.getDataRange().getValues();
  if (data.length < 1 || !data[0] || data[0][0] !== 'key') {
    sh.clear();
    sh.getRange(1, 1, 1, 2).setValues([['key', 'value']]);
    data = [['key', 'value']];
  }
  var found = false;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0] || '').trim() === key) {
      var valToWrite = typeof value === 'object' ? JSON.stringify(value) : (value !== undefined && value !== null ? String(value) : '');
      sh.getRange(i + 1, 2).setValue(valToWrite);
      found = true;
      break;
    }
  }
  if (!found) {
    var nextRow = data.length + 1;
    sh.getRange(nextRow, 1).setValue(key);
    var valToWrite = typeof value === 'object' ? JSON.stringify(value) : (value !== undefined && value !== null ? String(value) : '');
    sh.getRange(nextRow, 2).setValue(valToWrite);
  }
}

function getOrCreateSheet(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

// ========== 게임 랭킹 관련 함수 ==========

function getRankings() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = getOrCreateSheet(ss, SHEET_NAMES.gameRankings);
  var data = sh.getDataRange().getValues();
  
  if (data.length < 2) {
    return [];
  }
  
  var rankings = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0] && row[1] !== undefined) {
      rankings.push({
        name: String(row[0] || '').trim(),
        score: Number(row[1]) || 0,
        date: row[2] || new Date().toISOString()
      });
    }
  }
  
  // 점수 내림차순 정렬
  rankings.sort(function(a, b) {
    return b.score - a.score;
  });
  
  // Top 10만 반환
  return rankings.slice(0, 10);
}

function saveRanking(ss, name, score) {
  if (!name || !name.trim()) {
    throw new Error('Name is required');
  }
  if (score === undefined || score === null || isNaN(score)) {
    throw new Error('Score is required');
  }
  
  var sh = getOrCreateSheet(ss, SHEET_NAMES.gameRankings);
  var data = sh.getDataRange().getValues();
  
  // 헤더가 없으면 추가
  if (data.length < 1 || !data[0] || data[0][0] !== 'name') {
    sh.clear();
    sh.getRange(1, 1, 1, 3).setValues([['name', 'score', 'date']]);
    data = [['name', 'score', 'date']];
  }
  
  // 새 랭킹 추가
  var now = new Date();
  sh.appendRow([name.trim().substring(0, 10), Number(score), now]);
  
  // 전체 랭킹 가져오기
  var allRankings = getRankings();
  
  // Top 10만 유지 (나머지 삭제)
  if (allRankings.length > 10) {
    sh.clear();
    sh.getRange(1, 1, 1, 3).setValues([['name', 'score', 'date']]);
    for (var i = 0; i < 10; i++) {
      var rank = allRankings[i];
      sh.appendRow([rank.name, rank.score, rank.date]);
    }
  }
}
