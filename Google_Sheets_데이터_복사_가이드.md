# Google Sheets 데이터 복사 가이드

## 중요: 기존 시트 사용 가능

**기존 시트를 버릴 필요는 없습니다!** 
- 시트가 없으면 자동으로 생성됩니다
- 시트 이름만 정확히 맞추면 됩니다
- 헤더(첫 번째 행)만 올바르게 설정하면 데이터는 자동으로 읽어옵니다

## 빠른 복사 방법

**`Google_Sheets_복사용_데이터.txt` 파일을 열어서 각 시트별로 복사하세요!**
- 탭(탭 키)으로 구분되어 있어 Excel/Google Sheets에 바로 붙여넣을 수 있습니다
- 각 행을 복사해서 붙여넣으면 자동으로 열이 구분됩니다

## 시트 구조 및 복사 방법

### 1. Members 시트 (집중관리 명단)

**시트 이름**: `Members` (정확히 일치해야 함)

**헤더 (1행)**:
```
A1: name
B1: dept
C1: risk
D1: note
E1: isIntensiveCare
F1: counseling
```

**데이터 예시 (2행부터)**:
```
A2: 김규주
B2: 1공장
C2: Highest
D2: 소음성 난청 (양측)
E2: TRUE
F2: {"1":{"date":"01/15","count":1},"2":{"date":"02/10","count":1},"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null}}
```

**주의사항**:
- `E열 (isIntensiveCare)`: `TRUE` 또는 `FALSE` (대문자)
- `F열 (counseling)`: JSON 형식 문자열 (예: `{"1":{"date":"01/15","count":1},"2":null,...}`)
- 상담이 없으면 `null`, 있으면 `{"date":"01/15","count":1}` 형식

---

### 2. Risks 시트 (유해인자 관리)

**시트 이름**: `Risks` (정확히 일치해야 함)

**헤더 (1행)**:
```
A1: type
B1: dept
C1: health
D1: action
E1: level
```

**데이터 예시 (2행부터)**:
```
A2: 밀폐공간(질식)
B2: 전 공정
C2: 산소결핍, 유해가스
D2: 복합가스측정기 구매 완료
E2: Critical
```

**level 값**: `Critical`, `High`, `Mid` 중 하나

---

### 3. Noise 시트 (소음 측정 데이터)

**시트 이름**: `Noise` (정확히 일치해야 함)

**헤더 (1행)**:
```
A1: factory
B1: processName
C1: processDept
D1: measuredDb
E1: standardDb
F1: result
G1: protectionGear
```

**데이터 예시 (2행부터)**:
```
A2: 1공장
B2: 프레스
C2: 1공장
D2: 96.4
E2: 87.7
F2: 초과
G2: 귀마개
```

**주의사항**:
- `D열 (measuredDb)`, `E열 (standardDb)`: 숫자 (소수점 가능)
- `F열 (result)`: `초과` 또는 `적합`
- `G열 (protectionGear)`: `귀마개` 또는 `-`

---

### 4. Expenses 시트 (병원비 지출)

**시트 이름**: `Expenses` (정확히 일치해야 함)

**헤더 (1행)**:
```
A1: year
B1: month
C1: name
D1: amount
E1: hospital
```

**데이터 예시 (2행부터)**:
```
A2: 2025
B2: 1
C2: 이영준
D2: 251860
E2: 병원
```

**주의사항**:
- `A열 (year)`: 연도 (예: 2025, 2026)
- `B열 (month)`: 월 (1~12)
- `D열 (amount)`: 금액 (숫자만, 콤마 없이)
- 같은 연도/월에 여러 항목이 있으면 여러 행으로 입력

---

### 5. Innovations 시트 (혁신 성과)

**시트 이름**: `Innovations` (정확히 일치해야 함)

**헤더 (1행)**:
```
A1: category
B1: title
C1: desc
D1: date
E1: imageUrl
F1: savings
```

**데이터 예시 (2행부터)**:
```
A2: Cost
B2: 근골격계 조사 자체 수행
C2: 외부 위탁 없이 직접 실시하여 500만원 예산 절감
D2: 2024.12
E2: (비어있어도 됨)
F2: 5000000
```

**주의사항**:
- `F열 (savings)`: 절감액 (숫자만, 콤마 없이, 없으면 비워두기)
- `E열 (imageUrl)`: 이미지 URL (없으면 비워두기)

---

### 6. Config 시트 (설정 데이터)

**시트 이름**: `Config` (정확히 일치해야 함)

**헤더 (1행)**:
```
A1: key
B1: value
```

**데이터 형식 (2행부터)**:
각 행마다 하나의 설정 항목을 key-value 쌍으로 저장

**예시 데이터**:

**응급연락망 (emergencyContacts)**:
```
A2: emergencyContacts
B2: [{"id":1,"category":"응급실","name":"구영테크 인근 응급실","phone":"119","description":"화재/응급상황","icon":"fa-phone","color":"red","order":1}]
```

**스트레칭 영상 (stretchingVideos)**:
```
A3: stretchingVideos
B3: [{"id":1,"title":"구영테크 스트레칭 영상","description":"근골격계 부담 예방을 위한 실전 스트레칭 가이드","videoUrl":"https://youtu.be/oYmiL6Bh_ak","thumbnail":"","duration":"","category":"전체","createdAt":"2026-02-12"}]
```

**의약품 설문조사 URL (medicine_survey_url)**:
```
A4: medicine_survey_url
B4: https://docs.google.com/forms/d/e/1FAIpQLSc8GB-tbu8QhWnoItYi7lS26tyLX0KzQvNZ-bwc-Cqw-bHpsQ/viewform?usp=sharing&ouid=110501763882946908099
```

**배치도면 (floorplans)**:
```
A5: floorplans
B5: {"factory1":"data:image/png;base64,iVBORw0KGgoAAAANS...","factory2":"data:image/png;base64,iVBORw0KGgoAAAANS..."}
```

**주의사항**:
- `B열 (value)`: 배열이나 객체는 JSON 문자열로 저장 (큰따옴표 포함)
- 문자열은 그대로 저장
- 배치도면은 base64 인코딩된 이미지 데이터 (관리자 모드에서 업로드하면 자동 생성)

---

## 빠른 복사용 템플릿

### Members 시트 (집중관리 명단)

| name | dept | risk | note | isIntensiveCare | counseling |
|------|------|------|------|-----------------|------------|
| 김규주 | 1공장 | Highest | 소음성 난청 (양측) | TRUE | {"1":{"date":"01/15","count":1},"2":{"date":"02/10","count":1},"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 남덕현 | 1공장 | Highest | 고혈압 (중)당뇨 | TRUE | {"1":{"date":"01/20","count":1},"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 박기태 | 1공장 | Highest | 소음감각 | TRUE | {"1":null,"2":{"date":"02/15","count":1},"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 박태양 | 1공장 | Highest | 당뇨병 | TRUE | {"1":{"date":"01/10","count":1},"2":{"date":"02/20","count":1},"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 송치훈 | 1공장 | Highest | 고혈압 | TRUE | {"1":{"date":"01/12","count":1},"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 양병석 | 1공장 | High | CO2용접 | FALSE | {"1":null,"2":{"date":"02/25","count":1},"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 오지웅 | 1공장 | Highest | 만성신부전 | TRUE | {"1":{"date":"01/18","count":1},"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 제창희 | 1공장 | Highest | 뇌심혈관 고위험 | TRUE | {"1":{"date":"01/25","count":1},"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 하대준 | 1공장 | Highest | 폐기능 저하 | TRUE | {"1":null,"2":{"date":"02/18","count":1},"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 황동민 | 1공장 | High | 관절염/허리부 | FALSE | {"1":{"date":"01/30","count":1},"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 문영채 | 2공장 | Highest | 당뇨 | TRUE | {"1":{"date":"01/22","count":1},"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 백대용 | 2공장 | High | 근골 | FALSE | {"1":null,"2":{"date":"02/12","count":1},"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 안성형 | 2공장 | Highest | 당뇨 | TRUE | {"1":{"date":"01/28","count":1},"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |
| 전영용 | 2공장 | High | 근골 | FALSE | {"1":null,"2":{"date":"02/24","count":1},"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null} |

---

### Risks 시트 (유해인자 관리)

| type | dept | health | action | level |
|------|------|--------|--------|-------|
| 밀폐공간(질식) | 전 공정 | 산소결핍, 유해가스 | 복합가스측정기 구매 완료 | Critical |
| 소음 | 프레스, 용접 | 소음성 난청 | 귀마개 착용 및 특수검진 | Critical |
| 근골격계 부담 | 조립반, 물류 | 요통, 어깨 결림 | 유해요인조사 실시 | High |
| 용접 흄 | 용접반 | 폐기능 저하 | 국소배기, 특급마스크 | High |
| 유기용제 | 도장반 | 간기능 이상 | 밀폐용기 개선, 환기 | Mid |

---

### Noise 시트 (소음 측정 데이터)

| factory | processName | processDept | measuredDb | standardDb | result | protectionGear |
|---------|-------------|-------------|------------|------------|--------|----------------|
| 1공장 | 프레스 | 1공장 | 96.4 | 87.7 | 초과 | 귀마개 |
| 1공장 | 스폿용접 | 1공장 | 89.1 | 87.7 | 초과 | 귀마개 |
| 1공장 | CO2용접 | 1공장 | 88.3 | 87.7 | 초과 | 귀마개 |
| 1공장 | 가공/연마 | 1공장 | 86.2 | 87.7 | 적합 | - |
| 2공장 | 프레스 | 2공장 | 88.1 | 87.7 | 초과 | 귀마개 |
| 2공장 | 가공연마 | 2공장 | 82.8 | 87.7 | 적합 | - |

---

### Expenses 시트 (병원비 지출)

| year | month | name | amount | hospital |
|------|-------|------|--------|----------|
| 2025 | 1 | 이영준 | 251860 | 병원 |
| 2025 | 2 | 이영준 | 15000 | 병원 |
| 2025 | 2 | 하다현 | 427370 | 병원 |
| 2025 | 2 | 박래경 | 491570 | 병원 |
| 2025 | 2 | 김동우 | 513970 | 대학병원 |
| 2025 | 3 | 이주호 | 76300 | 약국 |
| 2025 | 3 | 문영남 | 166780 | 병원 |
| 2025 | 3 | 박래경 | 195470 | 병원 |
| 2025 | 3 | 김동우 | 6541480 | 대학병원 |
| 2025 | 4 | 김동우 | 171620 | 대학병원 |
| 2025 | 4 | 곽용호 | 1474000 | 병원 |
| 2025 | 5 | 김동우 | 2544600 | 대학병원 |
| 2025 | 5 | 경용호 | 660650 | 병원 |
| 2025 | 5 | 김지환 | 412900 | 병원 |
| 2025 | 6 | 김동우 | 67640 | 대학병원 |
| 2025 | 6 | 곽용호 | 321127 | 병원 |
| 2025 | 6 | 김진희 | 189720 | 병원 |
| 2025 | 7 | 곽용호 | 746336 | 병원 |
| 2025 | 7 | 손재웅 | 314400 | 약국 |
| 2025 | 7 | 김종남 | 5297900 | 대학병원 |
| 2025 | 8 | 김종남 | 102800 | 대학병원 |
| 2025 | 9 | 김종남 | 807440 | 대학병원 |
| 2025 | 9 | 문영남 | 4858130 | 병원 |
| 2025 | 9 | 김풍원 | 1235000 | 병원 |
| 2025 | 10 | 김종남 | 59170 | 대학병원 |
| 2025 | 10 | 문영남 | 655320 | 병원 |
| 2025 | 10 | 김풍원 | 923130 | 병원 |

---

### Innovations 시트 (혁신 성과)

| category | title | desc | date | imageUrl | savings |
|----------|-------|------|------|-----------|---------|
| Cost | 근골격계 조사 자체 수행 | 외부 위탁 없이 직접 실시하여 500만원 예산 절감 | 2024.12 | | 5000000 |
| Safety | 화학물질 관리 체계 고도화 | 현장 전수 조사 및 MSDS 보관함 추가 설치, 공정관리 요령 부착 | 2025.02 | | |
| System | 안전보건 방송 시스템 구축 | 1·2·3공장 교육 방송 동시 송출 시스템 완비 | 2025.06 | | |
| Cost | 보건관리 전문기관 대통합 | 영남대→대한산업보건협회 변경으로 연간 5,113,440원 절감 + S등급 달성 | 2025.11 | | 5113440 |
| Health | 근골격계 예방 (2공장) | 유해요인조사 완료 | 2025.01 | | |
| Network | 외부 벤치마킹 | 메가젠 안전보건 교류 | 2025.11 | | |
| Edu | 전문성 강화 | 가스농도 측정평가 교육 이수 | 2025.09 | | |
| System | 법령 대응 강화 | 밀폐공간 법령 개정 대응 측정기 구매 | 2025.11 | | |
| Visual | 조도 측정 결과 보고 및 개선 일정 추진 | 1·2공장 작업장 전 구역 조도 측정 실시. 2공장 전 구역 기준 충족. 1공장 용접부스·축압기 미달 구역 개선 시행. | 2025.09 | | |
| Process | 행정 효율화 | 소모품 결제 통합 (법인카드 월 1회 일괄) | 2026.01 | | |
| Visual | 현장 시각화 개선 | 맨홀·위험구역 황색 삼각형 도색 및 경고 표지 부착 | 2026.01 | | |
| Safety | 비상 대응 프로세스 수립 | 응급상황 Flowchart 및 연락망 신규 정립 | 2026.01 | | |
| System | 자체 보건 전산 시스템 개발 | 웹 기반 보건시스템(G-System) 구축으로 데이터 자동화 및 행정 효율화 | 2026.02 | | 10000000 |
| Cost | 협력병원(W병원, 우리허브) MOU 할인 | 임직원 진료비 10% 할인 혜택 적용 (자동 집계) | 2025.01 | | 0 |

---

### Config 시트 (설정 데이터)

| key | value |
|-----|-------|
| emergencyContacts | [{"id":1,"category":"응급실","name":"구영테크 인근 응급실","phone":"119","description":"화재/응급상황","icon":"fa-phone","color":"red","order":1}] |
| stretchingVideos | [{"id":1,"title":"구영테크 스트레칭 영상","description":"근골격계 부담 예방을 위한 실전 스트레칭 가이드","videoUrl":"https://youtu.be/oYmiL6Bh_ak","thumbnail":"","duration":"","category":"전체","createdAt":"2026-02-12"}] |
| medicine_survey_url | https://docs.google.com/forms/d/e/1FAIpQLSc8GB-tbu8QhWnoItYi7lS26tyLX0KzQvNZ-bwc-Cqw-bHpsQ/viewform?usp=sharing&ouid=110501763882946908099 |
| floorplans | (관리자 모드에서 업로드하면 자동 생성) |

---

## 복사 방법

1. **위의 표를 복사**
2. **Google Sheets에 붙여넣기**
   - 시트 이름이 정확히 일치하는지 확인
   - 첫 번째 행(헤더)이 정확한지 확인
3. **저장**

## 자동 생성 기능

시트가 없거나 헤더가 없으면 **자동으로 생성**됩니다:
- 관리자 모드에서 데이터를 저장하면 시트가 자동 생성됨
- 헤더도 자동으로 생성됨
- 따라서 기존 시트를 버릴 필요는 없지만, 올바른 형식으로 만들어야 함

## 확인 방법

1. Google Sheets에서 각 시트 탭 확인
2. 첫 번째 행(헤더) 확인
3. 데이터가 올바르게 입력되었는지 확인
4. 브라우저에서 페이지 새로고침하여 데이터가 표시되는지 확인
