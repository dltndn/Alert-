const access = require("./DB/access");
const backEnd = require("./backendlogics")


  /**
   * 로그인 검증 로직
   * @param {*} request 
   * @param {*} response 
   * @param {*} userInput : 유저정보에 대한 객체를 매개변수로 추가 getFormData() 사용 
   */
   exports.verifyLogin = (request, response, userInput) => {
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
        response.redirect("/live_before_process");
        break; 
      } else if (rows - 1 == i) {
        response.send("<script>alert('아이디가 혹은 패스워드가 잘못 되었습니다.');window.location=\"/\"</script>");
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
   exports.verifySignup = (request, response, userInput) => {
     const userData = access.userData(request, response);
     const idList = userData.idList;
     const rows = userData.userDataTableRowsCount;
     const ID = userInput.ID;
     const password = userInput.pwd;
     const contrastPassword = userInput.contrastPwd;

     if (password === contrastPassword) {
       for (let i = 0; i < rows; i++) {
         if (ID === idList[i]) {
           backEnd.alertRedirect(request, response, "사용중인 아이디 입니다.", "/signUp")
           break;
         } else if (rows - 1 == i) {
           access.insertQuery(request, response, `INSERT INTO Alert.user_data (user_id, user_password) VALUES ('${ID}', '${password}');`);
           request.session.is_logined = true;
           request.session.userid = ID;
           backEnd.alertRedirect(request, response, "회원가입이 완료되었습니다.", "/profile")
           break;
         }
       }
     } else {
      backEnd.alertRedirect(request, response, "비밀번호가 불일치 합니다.", "/signUp")
     }
   },

  /**
   * 현재 시간과 출발시간을 비교하여 시간을 넘겼는지 넘기지 않았는지 알려주는 로직
   * @param {*} alarmTime 
   * @returns boolean
   */
   exports.isOverTime = (alarmTime) => {
    let browserTime = new Date();

    for (let col = 0; col < alarmTime.alarm_time.length ;col++) {
      if (alarmTime.alarm_time.substring(col,col+1) === ":") {
        let hour = parseInt(alarmTime.alarm_time.substring(0,col)); 
        let min = parseInt(alarmTime.alarm_time.substring(col+1,parseInt(alarmTime.alarm_time.length + 1)))
        console.log("alarm : " + (hour * 100 + min))
        console.log(hour)
        console.log(min);
        console.log("browser : " + (browserTime.getHours() * 100 + browserTime.getMinutes()))
        console.log(browserTime.getHours())
        console.log(browserTime.getMinutes());
        if (hour * 100 + min >= browserTime.getHours() * 100 + browserTime.getMinutes()) {
          
          return false;
        }
        else {
          return true;
        }
      }
    }
  },

  /**
   * 사용자가 저장하려는 별명과 같은 별명이 있는지 알려주는 로직
   * @param {*} request 
   * @param {*} response 
   * @param {*} nickname 별명 (String)
   * @returns boolean
   */
   exports.isExistUserAdressNickname = (request, response, nickname) => {
    
    const userLocationNicknameList = access.query(request, response, `
    SELECT nickname FROM Alert.user_location WHERE user_id = '${request.session.userid}';`)
    
    for (let index = 0 ; index < userLocationNicknameList.length ;index++) {
      if (userLocationNicknameList[index].nickname === nickname) {
        return true;
      }
      else if (index === userLocationNicknameList.length -1) {
        return false;
      }
    }

  }

