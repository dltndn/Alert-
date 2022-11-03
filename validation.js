const access = require("./DB/access");
var express = require('express')
var bodyParser = require('body-parser')


var app = express()

app.use(bodyParser.urlencoded({ extended: false }))

module.exports = {
  /**
   * Form 에서 데이터를 받아 객체를 리턴하는 메서드
   * @param {*} request 
   * @param {*} response 
   * @returns 객체타입의 값을 리턴 
   */
  getFormData (request, response) {     
    return request.body;
  },

  /**
   * 로그인 검증 로직
   * @param {*} request 
   * @param {*} response 
   * @param {*} userInput : 유저정보에 대한 객체를 매개변수로 추가 getFormData() 사용
   * @returns 
   */
   verifyLogin  (request, response, userInput) {
    const object = access.userData(request, response);
    const user_data = object.user_data;
    const id_list = object.id_list;
    const rows = object.count_user_datas_row;
    const ID = userInput.ID;
    const password = userInput.PW;

    for (let i = 0; i < rows; i++) {
      if (ID === id_list[i] & password == user_data[i].user_password) {
        request.session.is_logined = true;
        request.session.userid = ID;
        response.redirect("/live");
        return; 
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
     const object = access.userData(request, response);
     const user_data = object.user_data;
     const id_list = object.id_list;
     const rows = object.count_user_datas_row;
     const ID = userInput.ID;
     const password = userInput.pwd;
     const contrastPassword = userInput.contrastPwd;

     if (password === contrastPassword) {
       for (let i = 0; i < rows; i++) {
         if (ID === id_list[i]) {
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

  /**
   * 
   * @param {*} trueCode 
   * @param {*} falseCode 
   */
  checkLogin : (request, trueCode, falseCode) => {
    console.log(request.session);
    if (request.session.is_logined === true) {
      console.log("true");
      trueCode
    } else {
      falseCode
    }
  },

  // login () {
  //   <script>
      
  //   </script>
  //   return;
  // }
}