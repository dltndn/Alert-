const access = require("./DB/access");
const { alarm } = require("./template");

module.exports = {
  /**
   * 로그인 검증 로직
   * @param {*} request 
   * @param {*} response 
   * @param {*} userInput : 유저정보에 대한 객체를 매개변수로 추가 getFormData() 사용 
   */
   verifyLogin  (request, response, userInput) {
    const userData = access.userData(request, response);
    const userDataTable = userData.userDataTable;
    const idList = userData.idList;
    const rows = userData.userDataTableRowsCount;
    const ID = userInput.ID;
    const password = userInput.PW;

    for (let i = 0; i < rows; i++) {
      if (ID === idList[i] & password == userDataTable[i].user_password) {
        request.session.is_logined = true;
        request.session.userid = ID;
        response.redirect("/live");
        break; 
      } else if (rows - 1 == i) {
        console.log("아이디가 혹은 패스워드가 잘못 되었습니다.");
        response.redirect('back');
        break;
      }
    }
  },

  /**
   * 회원가입 검증 로직 (아이디 중복확인 로직 구현 안됨)
   * @param {*} request 
   * @param {*} response 
   * @param {*} userInput : 유저정보에 대한 객체를 매개변수로 추가 getFormData() 사용
   * @returns 
   */
   verifySignup  (request, response, userInput) {
     const userData = access.userData(request, response);
     const idList = userData.idList;
     const rows = userData.userDataTableRowsCount;
     const ID = userInput.ID;
     const password = userInput.pwd;
     const contrastPassword = userInput.contrastPwd;

     if (password === contrastPassword) {
       for (let i = 0; i < rows; i++) {
         if (ID === idList[i]) {
           console.log("아이디 중복");
           response.redirect("back");
           break;
         } else if (rows - 1 == i) {
           access.InsertQuery(request, response, `INSERT INTO Alert.user_data (user_id, user_password) VALUES ('${ID}', '${password}');`);
           request.session.is_logined = true;
           request.session.userid = ID;
           response.redirect("/live");
           break;
         }
       }
     } else {
       console.log("비밀번호 불일치");
     }
   },


  isOverTime : (alarmTime) => {
    let browserHours = new Date().getHours(); 
    let browserMinutes = new Date().getMinutes(); 

    console.log("isoverTime")
    let alarmTimes = alarmTime.departure_time
    console.log(alarmTimes)
    for (let col = 0 ;col < alarmTimes.length; col++) {
      if (alarmTimes.substring(col,col+1) === ":") {
        let departureHour = parseInt(alarmTimes.substring(0,col)); 
        let departureMin = parseInt(alarmTimes.substring(col+1,parseInt(alarmTimes.length + 1)))    
        if (browserHours < departureHour) {
          return false;
        } else if (browserHours === departureHour && browserMinutes <= departureMin) {
          return false;
        } else {
          return true;
        }
      }
    }
    


  },

}

