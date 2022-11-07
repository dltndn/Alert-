const access = require("./DB/access");

module.exports = {
  parsingAlarmData (request, response) {
    let userid = request.session.userid;
    let part = "";

    let count = access.query( request, response, `SELECT count(*) as count FROM Alert.alarm where user_id = '${userid}';`)[0].count;
    let data = access.query(request, response, `SELECT * FROM Alert.alarm where user_id = '${userid}';`);

    for (let i = 0; i < count; i++) {
      let day_of_week = data[i].day_of_week;
      let day = "";
      for (let i = 0; i < day_of_week.length; i++) {
        let consider = day_of_week.substring(i, i + 1);
        switch (consider) {
          case "0":
            day += "일";
            break;
          case "1":
            day += "월";
            break;
          case "2":
            day += "화";
            break;
          case "3":
            day += "수";
            break;
          case "4":
            day += "목";
            break;
          case "5":
            day += "금";
            break;
          case "6":
            day += "토";
            break;
        }
      }
      part += `<div>`;
      part += day + " ";
      part += data[i].departure_time + " ";
      part += data[i].alarm_time + " ";
      part += data[i].departrue_adress + " ";
      part += data[i].arrive_adress;
      part += `</div><br>`;
    }
    return part;
  },

  createAlarm (request, response, alarmData) {
    let day_of_week = "";
    let Day_of_the_week = alarmData.Day_of_the_week

  for (let i = 0; i < Day_of_the_week.length;i++) {
    if (i === 0 )
      day_of_week += Day_of_the_week[i]
    else 
      day_of_week += Day_of_the_week[i]
  }

  let departrue_adress = alarmData.출발지
  let arrive_adress = alarmData.도착지
  let departure_time = parseInt(alarmData.depart_time_hour) + ":" + parseInt(alarmData.depart_time_min);
  let alarm_time = parseInt(alarmData.alarm_time_hour) + ":" + parseInt(alarmData.alarm_time_min);
  
// 중복 확인 작업 

  let loginUser = access.query(request, response, `select * from Alert.alarm where user_id = '${request.session.userid}';`);
  
  if (loginUser.length === 0) {
    access.InsertQuery(request, response, 
      `INSERT INTO Alert.alarm (user_id, day_of_week, departure_time, alarm_time, departrue_adress, arrive_adress) 
        VALUES ('${request.session.userid}', '${day_of_week}', '${departure_time}', '${alarm_time}', '${departrue_adress}', '${arrive_adress}');`)
    
    let alarm_id = access.query(request, response, 
      `select Max(alarm_id) as alarm_id from Alert.alarm where user_id = '${request.session.userid}';`)[0].alarm_id

    access.InsertQuery(request, response, 
      `INSERT INTO Alert.connect (user_id, alarm_id) 
        VALUES ('${request.session.userid}', '${alarm_id}');`)

    response.redirect('/alarm');
  }
  else {
    for (let i = 0; i < loginUser.length;i++) {
      let data = loginUser[i]
      
      if (data.user_id === request.session.userid && data.day_of_week === day_of_week && 
        data.departure_time === departure_time && data.alarm_time === alarm_time &&
        data.departrue_adress === departrue_adress && data.arrive_adress === arrive_adress)  {
          console.log("중복");
          response.redirect('back');
          break;
        }
        else if (i === loginUser.length - 1) {
          access.InsertQuery(request, response, 
            `INSERT INTO Alert.alarm (user_id, day_of_week, departure_time, alarm_time, departrue_adress, arrive_adress) 
          VALUES ('${request.session.userid}', '${day_of_week}', '${departure_time}', '${alarm_time}', '${departrue_adress}', '${arrive_adress}');`)
      
        let alarm_id = access.query(request, response, 
            `select Max(alarm_id) as alarm_id from Alert.alarm where user_id = '${request.session.userid}';`)[0].alarm_id
        
          access.InsertQuery(request, response, 
            `INSERT INTO Alert.connect (user_id, alarm_id) 
              VALUES ('${request.session.userid}', '${alarm_id}');`)
    
        response.redirect('/alarm');
        break;
      }
    }
  }
  },


};
