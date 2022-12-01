const access = require("./DB/access");
const validation = require("./validation");

/**
 * 사용자의 알람 내역을 렌더링하는 로직
 * @param {*} request 
 * @param {*} response 
 * @returns HTML코드
 */
 exports.getAlarmData = (request, response) => {
  const alarmData = this.parseAlarmTable(request, response)

  let data ="";
  
  parseTime = (time) => {
    for (let col = 0; col < time.length ;col++) {
      if (time.substring(col,col+1) === ":") {
        let hour = parseInt(time.substring(0,col)); 
        let min = parseInt(time.substring(col+1,parseInt(time.length + 1)))
        return {hour, min}
      }
    }
  }

  let departTime = {
    hour : 0,
    min : 0
  }

  let alarmTime = {
    hour : 0,
    min : 0
  }

  changeKo = (hour) => {
    if(hour >= 12) {
      departTime.hour = "오후 " + (hour -12);
    } else {
      departTime.hour = "오전 " + hour;
    }
  }
  
  change = (hour) => {
    if(hour >= 12) {
      alarmTime.hour = `<div class = "alarmhour">오후</div>` + (hour -12);
    } else {
      alarmTime.hour = `<div class = "alarmhour">오전</div>` + hour;
    }
  }
  
  for (let row = 0;row < alarmData.length; row++){
    changeKo (parseTime(alarmData[row].departure_time).hour);
    change(parseTime(alarmData[row].alarm_time).hour)
    let alarmdays = "";
    for (let col = 0; col < alarmData[row].alarm_day.length ;col++) {
      alarmdays += `<div class = "alarm_day">` + alarmData[row].alarm_day.substring(col, col+1) + `</div>`
    }
    let on_off = ""
    if (alarmData[row].on_off == 1) on_off = 'checked';
    data += `<div class = "alarms">`
    data += `<div class = "alarm_time">` + alarmTime.hour + ":" + parseTime(alarmData[row].alarm_time).min + `</div>`
    data += `<div class = "inner_container">`
    data += `<div class = "inner_container_top">`
    data += `<div class = "departrue_adress">` + alarmData[row].departrue_adress + `</div>`
    data += `<div class = "arrive_adress">` + alarmData[row].arrive_adress + `</div></div>`
    data += `<div class = "departure_time">` + departTime.hour + "시 " + parseTime(alarmData[row].departure_time).min + "분" + `</div>`
    data += `<div class = "alarm_days">` + alarmdays + `</div></div>`
    data += `<input type="checkbox" name="alarm_id" value="${alarmData[row].alarm_id}" class="alarm_checkbox alarmOnOff${alarmData[row].alarm_id}" ${on_off}>`
    data += `</div>`  
    data += `<form action="turnOnOffAlarm" method="post">
              <input type="hidden" name="alarm_id" value="${alarmData[row].alarm_id}">
              <input type="hidden" name="onOff" value="${on_off}">
              <input type="submit" class="button${alarmData[row].alarm_id}" style="display: none;">
            </form>`
    data += `<script>
              const checkBox${alarmData[row].alarm_id} = document.querySelector('.alarmOnOff${alarmData[row].alarm_id}');
              checkBox${alarmData[row].alarm_id}.addEventListener('click', () => {
                if (checkBox${alarmData[row].alarm_id}.checked) {
                  document.querySelector('.button${alarmData[row].alarm_id}').click();
                } else {
                  document.querySelector('.button${alarmData[row].alarm_id}').click();
                }
              });
            </script>`
            
  }
  return data;
};

/**
 * 로그인된 유저의 알람 테이블을 리턴하는 로직
 * @param {*} request 
 * @param {*} response 
 * @returns 로그인된 유저의 알람 테이블을 리턴
 */
 exports.getAlarmTable = (request, response) => {
    let userid = request.session.userid;
    let alarmTable = access.query(request, response, `SELECT * FROM Alert.alarm where user_id = '${userid}';`);
    return  alarmTable;
};

/**
 * 현재시간과 비교하여 가장 가까운 알람의 데이터를 반환하는 로직
 * @param {*} request 
 * @param {*} response 
 * @returns 현재시간과 비교하여 가장 가까운 알람의 정보를 객체로 리턴
 */
 exports.getNearTime = (request, response) => {
  
  
  let browserDate = new Date().getDay();
  // DB에서 테이블 가지고온 후 요일 문자열 비교 => 출발 시간 비교
  let alarmTable = this.getAlarmTable(request, response);

  let alarmList = []

  recall = (browserDate) => {
    for (let row = 0; row < alarmTable.length ;row++) {
      for (let col = 0; col < alarmTable[row].day_of_week.length ;col++) {
        if (browserDate === parseInt(alarmTable[row].day_of_week.substring(col,col+1)) && alarmTable[row].on_off === 1) {
          alarmList.push(alarmTable[row])
          break;
        }
      }
    }  
  }

  cleanMinTime = (alarmTimeList, alarmTimeid) => {
    for (let index = 0; index < alarmList.length;index++) {
      for (let col = 0; col < alarmList[index].departure_time.length ;col++) {
        if (alarmList[index].departure_time.substring(col,col+1) === ":") {
          let hour = parseInt(alarmList[index].departure_time.substring(0,col)); 
          let min = parseInt(alarmList[index].departure_time.substring(col+1,parseInt(alarmList[index].departure_time.length + 1)))
          alarmTimeList.push(hour*100 + min)
          alarmTimeid.push(alarmList[index].alarm_id)
          break;
        }
      }
    }
    return {"alarmTimeList" : alarmTimeList, "alarmTimeid" : alarmTimeid};
  }

  findMinTime = (alarmTimeList, alarmTimeid) => {
    let minDepartTime = Math.min.apply(null, alarmTimeList);
    let minIndex;
    for (let index = 0; index <alarmTimeList.length ;index++) {
      if (minDepartTime === alarmTimeList[index]) {
        minIndex = index;
      }
    }
    return alarmTimeid[minIndex];
  }

  let alarmTimeList = [];
  let alarmTimeid = [];
  
  let minAlarmId;
  // 초회
  recall(browserDate);

  for (let index = 0; index < alarmList.length;index++) {
    if (validation.isOverTime(alarmList[index])) {
      alarmList.splice(index,1);
      index--;
    }
  }
  if (!(alarmList.length === 0)) {
    // 최저시간찾기
    let minTimeObject = cleanMinTime(alarmTimeList, alarmTimeid);
    minAlarmId = findMinTime (minTimeObject.alarmTimeList, minTimeObject.alarmTimeid);
  }
  else if (alarmList.length === 0) {
    // 사이클 한번 돌아야함
    for (let day = 0; day < 9;day++) {
      console.log(browserDate)
      browserDate++;
      if (browserDate === 7) browserDate = 0; 
      recall(browserDate);
      if (!(alarmList.length === 0)) {
        //최저시간찾기
        let minTimeObject = cleanMinTime(alarmTimeList, alarmTimeid);
        minAlarmId = findMinTime (minTimeObject.alarmTimeList, minTimeObject.alarmTimeid);
        break;
      }
    }
  } 

  return access.query(request, response, `select * from Alert.alarm where user_id = '${request.session.userid}' and alarm_id = '${minAlarmId}';`)[0];
};

/**
 * Form 데이터를 받아와 가공하는 후 알람이 겹치는지 확인, 테이블에 행을 추가하는 로직
 * @param {*} request 
 * @param {*} response 
 * @param {*} formData Form으로 받은 객체타입의 데이터
 */
 exports.createAlarm = (request, response, formData) => {
  let dayOfWeek = "";
  let dayList = formData.Day_of_the_week

  for (let i = 0; i < dayList.length;i++) {
    if (i === 0 )
      dayOfWeek += dayList[i]
    else 
      dayOfWeek += dayList[i]
  }
  
  let departureTime = parseInt(formData.depart_time_hour) + ":" + parseInt(formData.depart_time_min);
  let alarmTime = parseInt(formData.alarm_time_hour) + ":" + parseInt(formData.alarm_time_min);
  let departrueAdress = formData.출발지
  let arriveAdress = formData.도착지
  
  // 중복 확인 작업 
  
  let alarmTable = this.getAlarmTable(request, response);
  
  if (alarmTable.length === 0) {
    access.insertAlarmData(request, response, dayOfWeek, departureTime, alarmTime, departrueAdress, arriveAdress);
    this.alertRedirect(request, response, "알림이 생성되었습니다." , "/alarm")
  }
  else {
    for (let row = 0; row < alarmTable.length;row++) {
      let alarmTableData = alarmTable[row]
      if (alarmTableData.user_id === request.session.userid && alarmTableData.day_of_week === dayOfWeek && 
        alarmTableData.departure_time === departureTime && alarmTableData.alarm_time === alarmTime &&
        alarmTableData.departrue_adress === departrueAdress && alarmTableData.arrive_adress === arriveAdress)  {
          this.alertRedirect(request, response, "중복된 알림이 있습니다." , "/create_alarm")
          break;
        } else if (row === alarmTable.length - 1) {
          access.insertAlarmData(request, response, dayOfWeek, departureTime, alarmTime, departrueAdress, arriveAdress);
          this.alertRedirect(request, response, "알람이 생성되었습니다." , "/alarm")
          break;
        }
      }
    }
};

/**
 * Form 데이터를 받아와 사용자가 지정한 위치를 DB에 저장하는 로직
 * @param {*} request 
 * @param {*} response 
 * @param {*} formData Form으로 받은 객체타입의 데이터
 */
exports.createLocation = (request, response, formData) => {
let adress = formData.adress;
let xpos = formData.xpos;
let ypos = formData.ypos;
let nickname = formData.location_nickname;
// 검증로직
const result = validation.isExistUserAdressNickname(request,response,nickname)
if (result) {
  response.redirect('/create_userloc')
}
else {
  access.insertQuery(request,response, 
    `INSERT INTO Alert.user_location (user_id, nickname, adress, xpos, ypos) 
    VALUES ('${request.session.userid}', '${nickname}', '${adress}', '${xpos}', '${ypos}');`)
  response.redirect('/profile')
}
};

/**
 * DB의 알람 테이블의 주중 요일을 분석하여 한글로 변환하는 로직
 * @param {*} request 
 * @param {*} response 
 * @param {*} alarmTable 
 * @returns 알람테이블의 알람 정보를 리스트 내부의 객체로 리턴 (요일이 숫자에서 한글로 변환됨)
 */
exports.parseAlarmTable = (request, response) => {
  let alarmTable = this.getAlarmTable(request, response);
  let alarms = "";
  let rowCount = alarmTable.length
  let resultList = [];

  for (let row = 0; row < rowCount; row++) {
    let dayOfWeek = alarmTable[row].day_of_week;
    let alarmDay = "";
    for (let col = 0; col < dayOfWeek.length; col++) {
      let dayOfWeekPart = dayOfWeek.substring(col, col + 1);
      switch (dayOfWeekPart) {
        case "0":
          alarmDay += "일";
          break;
        case "1":
          alarmDay += "월";
          break;
        case "2":
          alarmDay += "화";
          break;
        case "3":
          alarmDay += "수";
          break;
        case "4":
          alarmDay += "목";
          break;
        case "5":
          alarmDay += "금";
          break;
        case "6":
          alarmDay += "토";
          break;
      }
    }
    // 하나의 알람 객체로 리턴
    resultList.push({
      alarm_id: alarmTable[row].alarm_id,
      alarm_day: alarmDay,
      departure_time: alarmTable[row].departure_time,
      alarm_time: alarmTable[row].alarm_time,
      departrue_adress: alarmTable[row].departrue_adress,
      arrive_adress: alarmTable[row].arrive_adress,
      on_off : alarmTable[row].on_off
    });
  }
  return resultList;
};

/**
 * 알람 수정 삭제 HTML을 보내는 로직
 * @param {*} request 
 * @param {*} response 
 * @returns HTML코드
 */
exports.editAlarmData = (request, response) => {
  const alarmData = this.parseAlarmTable(request, response)
  let data ="";
  
  parseTime = (time) => {
    for (let col = 0; col < time.length ;col++) {
      if (time.substring(col,col+1) === ":") {
        let hour = parseInt(time.substring(0,col)); 
        let min = parseInt(time.substring(col+1,parseInt(time.length + 1)))
        return {hour, min}
      }
    }
  }

  let departTime = {
    hour : 0,
    min : 0
  }

  let alarmTime = {
    hour : 0,
    min : 0
  }

  changeKo = (hour) => {
    if(hour >= 12) {
      departTime.hour = "오후 " + (hour -12);
    } else {
      departTime.hour = "오전 " + hour;
    }
  }
  
  change = (hour) => {
    if(hour >= 12) {
      alarmTime.hour = `<div class = "alarmhour">오후</div>` + (hour -12);
    } else {
      alarmTime.hour = `<div class = "alarmhour">오전</div>` + hour;
    }
  }
  
  for (let row = 0; row < alarmData.length; row++) {
    changeKo (parseTime(alarmData[row].departure_time).hour);
    change(parseTime(alarmData[row].alarm_time).hour)
    let alarmdays = "";
    for (let col = 0; col < alarmData[row].alarm_day.length ;col++) {
      alarmdays += `<div class = "alarm_day">` + alarmData[row].alarm_day.substring(col, col+1) + `</div>`
    }
    data += `<div class = "alarms">
             <form name="edit" action="/update_alarm" method="post">
             <input type="submit" class="edit" value="수정" onclick="check()">
             <input type="hidden" name="alarm_id" value="${alarmData[row].alarm_id}">
             </form>`;
    data += `<div class = "main_container">`
    data += `<div class = "alarm_time">` + alarmTime.hour + ":" + parseTime(alarmData[row].alarm_time).min + `</div>`
    data += `<div class = "inner_container">`
    data += `<div class = "inner_container_top">`
    data += `<div class = "departrue_adress">` + alarmData[row].departrue_adress + `</div>`
    data += `<div class = "arrive_adress">` + alarmData[row].arrive_adress + `</div></div>`
    data += `<div class = "departure_time">` + departTime.hour + "시 " + parseTime(alarmData[row].departure_time).min + "분" + `</div>`
    data += `<div class = "alarm_days">` + alarmdays + `</div></div></div>`
    data += `<form name="delete" action="/delete_alarm_process" method="post">
             <input type="submit" class="delete" value="삭제" onclick="check()">
             <input type="hidden" name="alarm_id" value="${alarmData[row].alarm_id}">
             </form>
             </div>`;
  }
  return data;
};

/**
 * 알람 수정 삭제를 수행하는 로직
 * @param {*} request 
 * @param {*} response 
 * @param {*} formData Form으로 받은 객체타입의 데이터
 */
exports.editAlarm = (request, response, formData) => {
  let alarm_id = formData.exist_alarm_id;
  let dayOfWeek = "";
  let dayList = formData.Day_of_the_week

  for (let i = 0; i < dayList.length;i++) {
    if (i === 0 )
      dayOfWeek += dayList[i]
    else 
      dayOfWeek += dayList[i]
  }
  
  let departureTime = parseInt(formData.depart_time_hour) + ":" + parseInt(formData.depart_time_min);
  let alarmTime = parseInt(formData.alarm_time_hour) + ":" + parseInt(formData.alarm_time_min);
  let departrueAdress = formData.출발지
  let arriveAdress = formData.도착지
  
  // 중복 확인 작업 
  
  let alarmTable = this.getAlarmTable(request, response);
  
  if (alarmTable.length === 0) {
    access.updateAlarmData(alarm_id, request, response, dayOfWeek, departureTime, alarmTime, departrueAdress, arriveAdress);
    this.alertRedirect(request, response, "알림이 생성되었습니다." , "/alarm")
  }
  else {
    for (let row = 0; row < alarmTable.length;row++) {
      let alarmTableData = alarmTable[row]
      if (alarmTableData.user_id === request.session.userid && alarmTableData.day_of_week === dayOfWeek && 
        alarmTableData.departure_time === departureTime && alarmTableData.alarm_time === alarmTime &&
        alarmTableData.departrue_adress === departrueAdress && alarmTableData.arrive_adress === arriveAdress)  {
          this.alertRedirect(request, response, "중복된 알림이 있습니다." , "/create_alarm")
          response.redirect('back');
          break;
        } else if (row === alarmTable.length - 1) {
          access.updateAlarmData(alarm_id, request, response, dayOfWeek, departureTime, alarmTime, departrueAdress, arriveAdress);
          this.alertRedirect(request, response, "알림이 생성되었습니다." , "/alarm")
          break;
        }
      }
    }
};

/**
 * Form 데이터를 받아와 사용자가 지정한 위치를 DB에 저장하는 로직
 * @param {*} request 
 * @param {*} response 
 * @param {*} formData Form으로 받은 객체타입의 데이터
 */
exports.editLocation = (request, response, formData) => {
  let adress = formData.adress;
  let xpos = formData.xpos;
  let ypos = formData.ypos;
  let nickname = formData.location_nickname;
  
  const user_locationTable = access.query(request, response, `select * from Alert.user_location WHERE user_id = '${request.session.userid}'`)
  let originalUserlocationNickname = user_locationTable[request.body.origin].nickname;
  
  // 검증로직
  const result = validation.isExistUserAdressNickname(request,response,nickname)
  if (result) {
    response.redirect('/create_userloc')
  }
  else {
    access.insertQuery(request,response, 
      `UPDATE Alert.user_location SET 
      user_id = '${request.session.userid}', 
      nickname = '${nickname}', 
      adress = '${adress}', 
      xpos = '${xpos}', 
      ypos = '${ypos}'
     WHERE (user_id = '${request.session.userid}' AND nickname = '${originalUserlocationNickname}');`);
    response.redirect('/profile')
  }
};

/**
 * alert()함수실행 후 페이지를 이동하는 로직 
 * @param {*} request 
 * @param {*} response 
 * @param {*} message alert 메세지
 * @param {*} pageLocation 이동할 페이지
 */
exports.alertRedirect = (request, response, message, pageLocation) => {
  response.send(`<script>alert('${message}');window.location=\"${pageLocation}\"</script>`);
};

exports.turnOnOffAlarm = (request, response, formData) => {
  let on_off = 1;
  if (formData.onOff === 'checked') on_off = 0;
  access.query(request, response, `UPDATE Alert.alarm SET on_off = '${on_off}' WHERE (alarm_id = '${formData.alarm_id}');`)
  response.redirect('/alarm');
};

exports.sendNotification = (request, response) => {
  let nearTime = this.getNearTime(request,response);
  
  if (nearTime === undefined) {
    //?
    return `
      <script>
        //localStorage.removeItem("alerted");

        setInterval(() => {
              notifyMe();
        }, 5000);
        notifyMe = () => {
          if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
          }
          else if (Notification.permission === "granted") {
            let title = "Alert!";
            let body = "출발할 시간입니다.";
            let icon = './images/icon.jpg';
            let sound = './sound/note.mp3';
            
            


            var notification = new Notification(title, {'body': body , 'icon' : icon});
            var promise = new Audio(sound).play();
            
            if (promise !== undefined) {
              promise.then(_ => {
              }).catch(error => {
                console.log(error);
              });
            }
            notification.onclick = (event) => {
                event.preventDefault(); 
                window.open('http://localhost:3000/live', '_blank');
            }
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
              if (permission === "granted") {
                var notification = new Notification("really");
              }
            });
          }
        }
      </script>`;
  }
  else {
    return `
    <script>
      setInterval(() => {
        if (new Date().getHours() +":"+ new Date().getMinutes() === "${nearTime.alarm_time}") {
          if ((localStorage.getItem("alerted") === null)){
            localStorage.setItem("alerted", true);
            notifyMe();
          }
        }
        else {
          localStorage.removeItem("alerted");
        }
      }, 1000);

      notifyMe = () => {
        if (!("Notification" in window)) {
          alert("This browser does not support desktop notification");
        }
        else if (Notification.permission === "granted") {
          let title = "Alert!";
          let body = "출발할 시간입니다.";
          let icon = './images/main-img-1.png';
          //let sound = './sound/note.mp3';
          
          var notification = new Notification(title, {'body': body , 'icon' : icon});
          //var promise = new Audio(sound).play();
          
          notification.onclick = (event) => {
              event.preventDefault(); 
              window.open('http://localhost:3000/live', '_blank');
          }
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
              var notification = new Notification("really");
            }
          });
        }
      }
  </script>`; 
  }
};