const asyncDB = require("./DBhostdata");
const syncDB = require("./DBhostdata");

/** user_data 테이블에 대한 정보
 * @param {*} request 
 * @param {*} response 
 * @returns 객체 (사용자 테이블, 인스턴스의 개수, 아이디 리스트)
 */
exports.userData = (request, response) => {
  let idList = [];//`SELECT * FROM Alert.user_data;`
  const userDataTable = syncDB.query(`SELECT * FROM Alert.user_data;`);
  const tableRows = syncDB.query(`SELECT COUNT(user_id) as count FROM user_data;`)[0].count;
  for (let row = 0; row < tableRows; row++) {
    idList.push(userDataTable[row].user_id);
  }

  return { "userDataTable": userDataTable, "userDataTableRowsCount": tableRows, "idList": idList,};
};

/**
 * 동기적으로 DB 접근 값을 리턴
 * @param {*} request 
 * @param {*} response 
 * @param {*} query : 쿼리 
 * @returns 쿼리 실행 결과 (SELECT)
 */
exports.query = (request, response, query) => {
  return syncDB.query(query);
};

/**
 * 동기적으로 DB에 행 삽입
 * @param {*} request 
 * @param {*} response 
 * @param {*} query : 쿼리 
 */
exports.insertQuery = (request, response, query) => {
  syncDB.query(query);
};

/**
 * alarm_data 테이블에 행을 추가하는 로직
 * @param {*} request 
 * @param {*} response 
 * @param {*} day_of_week 
 * @param {*} departure_time 
 * @param {*} alarm_time 
 * @param {*} departrue_adress 
 * @param {*} arrive_adress 
 */
exports.insertAlarmData = (request, response, dayOfWeek, departureTime, alarmTime, departrueAdress, arriveAdress) => {
  this.insertQuery(request, response, 
    `INSERT INTO Alert.alarm (user_id, day_of_week, departure_time, alarm_time, departrue_adress, arrive_adress) 
     VALUES ('${request.session.userid}', '${dayOfWeek}', '${departureTime}', '${alarmTime}', '${departrueAdress}', '${arriveAdress}');`)
  
  const alarmID = this.query(request, response, 
    `select Max(alarm_id) as alarm_id from Alert.alarm where user_id = '${request.session.userid}';`)[0].alarm_id

  this.insertQuery(request, response, 
    `INSERT INTO Alert.connect (user_id, alarm_id) 
     VALUES ('${request.session.userid}', '${alarmID}');`)
};

/**
 * alarm_data 테이블에 행을 수정하는 로직
 * @param {*} alarmId 사용자의 id
 * @param {*} request 
 * @param {*} response 
 * @param {*} dayOfWeek 요일
 * @param {*} departureTime 출발시간
 * @param {*} alarmTime 알람시간
 * @param {*} departrueAdress 출발지 주소
 * @param {*} arriveAdress 도착지 주소
 */
exports.updateAlarmData = (alarmId, request, response, dayOfWeek, departureTime, alarmTime, departrueAdress, arriveAdress) => {
  this.insertQuery(request, response,
    `UPDATE Alert.alarm SET day_of_week = '${dayOfWeek}', 
      departure_time = '${departureTime}', 
      alarm_time = '${alarmTime}', 
      departrue_adress = '${departrueAdress}', 
      arrive_adress = '${arriveAdress}'
     WHERE (alarm_id = '${alarmId}');`
  );
};

/**
 * 
 * @param {*} nickname 
 * @param {*} adress 
 */
exports.updateUserLocationData = (nickname , adress) => {
  this.insertQuery(request, response,
    `UPDATE Alert.alarm SET 
      day_of_week = '${dayOfWeek}', 
      departure_time = '${departureTime}', 
      alarm_time = '${alarmTime}', 
      departrue_adress = '${departrueAdress}', 
      arrive_adress = '${arriveAdress}'
     WHERE (alarm_id = '${alarmId}');`
  );
};
