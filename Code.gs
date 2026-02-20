/**
 * G-SYSTEM Google Apps Script Backend
 * 
 * 기능:
 * 1. doGet: 모든 시트 데이터 읽기 (JSON 반환)
 * 2. doPost: 데이터 저장 (Rankings, Members, Risks, Innovations, 등)
 * 3. CORS 해결: 모든 응답에 헤더 추가
 */

const SCRIPT_PROP = PropertiesService.getScriptProperties();

// 필수 시트 이름 목록
const SHEET_NAMES = {
  MEMBERS: 'Members',        // 명단/상담
  RISKS: 'Risks',            // 유해인자
  NOISE: 'Noise',            // 소음
  INNOVATIONS: 'Innovations',// 혁신성과
  EXPENSES: 'Expenses',      // 병원비
  RANKINGS: 'Rankings',      // 게임 랭킹
  CONFIG: 'Config',          // 설정 (영상, 도면, URL 등)
  DUTY: 'Duty'               // 주말/휴일 당직 근무표
};

/**
 * 초기 설정: 시트가 없으면 생성
 */
function setup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  Object.values(SHEET_NAMES).forEach(sheetName => {
    if (!doc.getSheetByName(sheetName)) {
      doc.insertSheet(sheetName);
      // 헤더 초기화 예시 (필요 시 구체화 가능)
      const sheet = doc.getSheetByName(sheetName);
      if (sheetName === SHEET_NAMES.RANKINGS) {
        sheet.appendRow(['Timestamp', 'Game', 'Name', 'Score']);
      } else if (sheetName === SHEET_NAMES.CONFIG) {
        sheet.appendRow(['Key', 'Value', 'Updated At']);
        // 기본 키 세팅
        sheet.appendRow(['medicineSurveyUrl', '', new Date()]);
        sheet.appendRow(['floorplan1', '', new Date()]);
        sheet.appendRow(['floorplan2', '', new Date()]);
      }
    }
  });
}

/**
 * GET 요청 처리: 시트의 모든 데이터를 JSON으로 반환
 */
function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const result = { ok: true, data: {} };
    
    // 1. Members
    result.data.members = getSheetData(doc, SHEET_NAMES.MEMBERS);
    
    // 2. Risks
    result.data.risks = getSheetData(doc, SHEET_NAMES.RISKS);
    
    // 3. Noise
    result.data.noise = getSheetData(doc, SHEET_NAMES.NOISE);
    
    // 4. Innovations
    result.data.innovations = getSheetData(doc, SHEET_NAMES.INNOVATIONS);
    
    // 5. Expenses
    result.data.expenses = getSheetData(doc, SHEET_NAMES.EXPENSES);
    
    // 6. Config (Key-Value 쌍으로 변환하여 전달)
    const configData = getSheetData(doc, SHEET_NAMES.CONFIG);
    const configMap = {};
    configData.forEach(row => {
      // Key가 있는 경우만. row[0]=Key, row[1]=Value
      if (row.Key) configMap[row.Key] = row.Value; 
    });
    result.data.config = configMap;
    
    // 7. Rankings (게임별 분류는 프론트에서 처리하거나 여기서 분류 가능. 일단 전체 전달)
    result.data.rankings = getSheetData(doc, SHEET_NAMES.RANKINGS);

    // 8. Duty (주말/휴일 당직 근무표)
    result.data.duty = getSheetData(doc, SHEET_NAMES.DUTY);

    
    // 8. Stretching (Config 시트에 JSON string으로 저장하거나 별도 시트로 관리할 수 있음. 
    //    현재 요구사항에는 'saveStretchingVideos'가 있으므로 Config에 저장된 JSON을 파싱해서 줄 수도 있고,
    //    별도 시트 'Stretching'을 만들어도 됨. 
    //    *간단하게 Config에 저장된 JSON 문자열을 그대로 주거나, 별도 시트 사용 권장.*
    //    여기서는 'Stretching' 시트가 있다면 가져오고, 없으면 Config에서 찾도록 구현 유연성 확보.
    if (doc.getSheetByName('Stretching')) {
        result.data.stretching = getSheetData(doc, 'Stretching');
    }

    return responseJSON(result);
    
  } catch (e) {
    return responseJSON({ ok: false, error: e.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * POST 요청 처리: 데이터 저장
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // 10초 대기
  
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const action = e.parameter.action;
    
    // POST 데이터 파싱 (JSON body 또는 form-data)
    let payload = {};
    try {
      if (e.postData && e.postData.contents) {
        payload = JSON.parse(e.postData.contents);
      }
    } catch (err) {
      // form-data일 경우 e.parameter 사용
      payload = e.parameter;
    }
    
    // action이 payload 내부에 있을 수도 있음 (JSON body의 경우)
    const activeAction = action || payload.action;
    const activePayload = payload.payload || payload; // payload 안에 또 payload가 있을 수 있음

    if (activeAction === 'saveRanking') {
      // 게임 랭킹 저장
      // payload: { game: 'immunity-war', name: '홍길동', score: 100 }
      const sheet = getOrCreateSheet(doc, SHEET_NAMES.RANKINGS);
      sheet.appendRow([
        new Date(),
        activePayload.game || 'unknown',
        activePayload.name,
        activePayload.score
      ]);
      return responseJSON({ ok: true, message: 'Ranking saved' });
    }
    
    else if (activeAction === 'saveMembers') {
      // 전체 멤버 리스트 덮어쓰기 (Admin 모드에서 저장 시 보통 전체 데이터를 줌)
      // payload: [ { name: '...', ... }, ... ]
      const sheet = getOrCreateSheet(doc, SHEET_NAMES.MEMBERS);
      saveAllData(sheet, activePayload);
      return responseJSON({ ok: true, message: 'Members saved' });
    }
    
    else if (activeAction === 'saveRisks') {
        const sheet = getOrCreateSheet(doc, SHEET_NAMES.RISKS);
        saveAllData(sheet, activePayload);
        return responseJSON({ ok: true, message: 'Risks saved' });
    }
    
    else if (activeAction === 'saveInnovations') {
        const sheet = getOrCreateSheet(doc, SHEET_NAMES.INNOVATIONS);
        saveAllData(sheet, activePayload);
        return responseJSON({ ok: true, message: 'Innovations saved' });
    }
    
    else if (activeAction === 'saveNoise') {
        const sheet = getOrCreateSheet(doc, SHEET_NAMES.NOISE);
        saveAllData(sheet, activePayload);
        return responseJSON({ ok: true, message: 'Noise saved' });
    }

    else if (activeAction === 'saveExpenses') { // 병원비
        const sheet = getOrCreateSheet(doc, SHEET_NAMES.EXPENSES);
        saveAllData(sheet, activePayload);
        return responseJSON({ ok: true, message: 'Expenses saved' });
    }

    else if (activeAction === 'saveMedicineSurveyUrl') {
        // Config 시트에 업데이트 (Key: medicineSurveyUrl)
        updateConfig(doc, 'medicineSurveyUrl', activePayload.url);
        return responseJSON({ ok: true, message: 'URL saved' });
    }
    
    else if (activeAction === 'saveFloorplans') {
        // Config 시트에 업데이트
        // payload: { floor: 1, image: 'base64...' }
        const key = 'floorplan' + activePayload.floor;
        updateConfig(doc, key, activePayload.image);
        return responseJSON({ ok: true, message: 'Floorplan saved' });
    }
    
    else if (activeAction === 'saveStretchingVideos') {
        // 스트레칭 비디오 목록 저장
        // 별도 시트 'Stretching'에 저장하거나 Config에 JSON으로 저장
        // 여기서는 'Stretching' 시트를 새로 덮어쓰는 방식으로 구현
        const sheet = getOrCreateSheet(doc, 'Stretching');
        saveAllData(sheet, activePayload); // activePayload should be array of objects
        return responseJSON({ ok: true, message: 'Stretching videos saved' });
    }
    
    else {
      return responseJSON({ ok: false, error: 'Unknown action: ' + activeAction });
    }
    
  } catch (e) {
    return responseJSON({ ok: false, error: e.toString() });
  } finally {
    lock.releaseLock();
  }
}

// --------------------------------------------------------------------------
// Helper Functions
// --------------------------------------------------------------------------

function getOrCreateSheet(doc, name) {
  let sheet = doc.getSheetByName(name);
  if (!sheet) {
    sheet = doc.insertSheet(name);
  }
  return sheet;
}

/**
 * 시트의 모든 데이터를 읽어 객체 배열로 반환
 * 첫 번째 행을 헤더(Key)로 사용
 */
function getSheetData(doc, sheetName) {
  const sheet = doc.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return []; // 헤더만 있거나 비어있음
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      // 빈 헤더는 건너뜀
      if (header) {
        obj[header] = row[index];
      }
    });
    return obj;
  });
}

/**
 * 시트 데이터를 모두 지우고(헤더 제외) 새로운 데이터로 덮어쓰기
 */
function saveAllData(sheet, dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    // 데이터가 비었으면, 헤더 남기고 내용만 삭제
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
    }
    return;
  }
  
  // 1. 헤더 추출 (첫 번째 객체의 키 기준, 또는 기존 시트 헤더 유지?)
  // -> 유연성을 위해 전달받은 데이터의 키를 기준으로 헤더를 다시 씀 (Schema migration 효과)
  const headers = Object.keys(dataArray[0]);
  
  // 2. 시트 초기화
  sheet.clear();
  
  // 3. 헤더 쓰기
  sheet.appendRow(headers);
  
  // 4. 데이터 쓰기
  // 2차원 배열로 변환
  const rows = dataArray.map(obj => {
    return headers.map(header => {
      // 날짜 객체 처리 등 필요 시 여기서 변환
      let val = obj[header];
      if (Array.isArray(val) || (typeof val === 'object' && val !== null && !(val instanceof Date))) {
          // 객체나 배열은 JSON 문자열로 저장
          return JSON.stringify(val);
      }
      return val;
    });
  });
  
  // 대량 쓰기 (setValues가 빠름)
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

/**
 * Config 시트에서 Key에 해당하는 Value 업데이트 (없으면 추가)
 */
function updateConfig(doc, key, value) {
  const sheet = getOrCreateSheet(doc, SHEET_NAMES.CONFIG);
  const data = sheet.getDataRange().getValues();
  let found = false;
  
  // 헤더가 없으면 생성
  if (data.length === 0) {
      sheet.appendRow(['Key', 'Value', 'Updated At']);
  }
  
  // 행 순회하며 Key 찾기
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      // 찾음 -> 업데이트
      sheet.getRange(i + 1, 2).setValue(value); // Value 컬럼
      sheet.getRange(i + 1, 3).setValue(new Date()); // Updated At 컬럼
      found = true;
      break;
    }
  }
  
  // 못 찾음 -> 추가
  if (!found) {
    sheet.appendRow([key, value, new Date()]);
  }
}

/**
 * JSON 응답 생성 (CORS 헤더 포함)
 */
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// OPTIONS 요청 처리 (만약 필요한 경우, 보통 doGet/doPost에서 처리됨)
// Google Web App은 OPTIONS 요청을 직접 제어하기 어려우나, 
// doGet/doPost가 JSON을 반환하면 브라우저가 값을 읽을 수 있음.
