const access = require("./DB/access");

module.exports = {
  /**
   * Form 에서 데이터를 받아 객체를 리턴하는 메서드
   * @param {*} request 
   * @param {*} response 
   * @param {*} ID form 태그의 name속성 값1
   * @param {*} password form 태그의 name속성 값2
   * @returns 객체타입의 값을 리턴 {ID : userInputID, password : userInputPassword }
   */
  async getFormData (request, response, ID, password) {
    let input_data = "";

    // reject 구현 필요
    await new Promise((resolve, reject) => {
      request.on("data", (data) => {
        resolve(input_data += data);
      });
    });

    await new Promise((resolve, reject) => {
      request.on("end", () => {
        const userdata = new URLSearchParams(input_data);
        userInputID = userdata.get(ID);
        userInputPassword = userdata.get(password);
        resolve();
      });
    });

    return {ID : userInputID, password : userInputPassword };

  },

  /**
   * Form 에서 데이터를 받아 객체를 리턴하는 메서드
   * @param {*} request 
   * @param {*} response 
   * @param {*} ID form 태그의 name속성 값1
   * @param {*} password form 태그의 name속성 값2
   * @param {*} contrastPassword form 태그의 name속성 값3
   * @returns 객체타입의 값을 리턴 {ID : userInputID, password : userInputPassword }
   */
  async getFormData (request, response, ID, password, contrastPassword) {
    let input_data = "";

    await new Promise((resolve, reject) => {
      request.on("data", (data) => {
        resolve(input_data += data);
      });
    });

    await new Promise((resolve, reject) => {
      request.on("end", () => {
        const userdata = new URLSearchParams(input_data);
        userInputID = userdata.get(ID);
        userInputPassword = userdata.get(password);
        userInputContrastPassword = userdata.get(contrastPassword);
        resolve();
      });
    });

    return {ID : userInputID, password : userInputPassword, contrastPassword : userInputContrastPassword};

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
    const password = userInput.password;

    for (let i = 0; i < rows; i++) {
      if (ID === id_list[i]) {
        if (password === user_data[i].user_password) {
          console.log("아이디 비밀번호 일치");
          response.writeHead(302, { Location: "/live" });
          response.end("");
          return { userIndex : i,  loginStatus : true};
        } else {
          console.log("비밀번호가 잘못 되었습니다.");
          response.writeHead(302, { Location: "/login" });
          response.end("");
          break;
        }
      } else if (rows - 1 == i) {
        console.log("아이디가 잘못 되었습니다.");
        response.writeHead(302, { Location: "/login" });
        response.end("");
        break;
      }
    }
  },

  /**
   * 아직 구현 안됨 사용 불가!!!!!!!!!!!
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
    const password = userInput.password;
    const contrastPassword = userInput.contrastPassword;

    // 비밀번호 일치
    if (password === contrastPassword) {
      console.log("비밀번호 일치");
      // 아이디 중복 확인 로직
      
    
    
    
    }
    else {
      console.log("비밀번호 불일치");
    }

  }
}








// exports.Login = async function (request, response) {
//   const object = access.userData(request, response);
//   const user_data = object.user_data;
//   const id_list = object.id_list;
//   const rows = object.count_user_datas_row;
//   // form에서 입력한 값 로드
  
//   async function getData () {
//     let login_data = "";
//     let userInputData = {};

//     let getFromForm = new Promise((resolve, reject) => {
//       request.on("data", (data) => {
//         resolve(login_data += data);
//       });
//     });

//     let parseData = new Promise((resolve, reject) => {
//       request.on("end", () => {
//         const userdata = new URLSearchParams(login_data);
//         userInputID = userdata.get("ID");
//         userInputPassword = userdata.get("PW");
//         resolve();
//       });
//     });

//     await getFromForm;
//     await parseData;

//     userInputData = {
//       ID : userInputID,
//       password : userInputPassword,
//     }

//     return userInputData;

//   }

//   function backEndlogic (userInputData) {
//     const ID = userInputData.ID;
//     const password = userInputData.password;

//     for (let i = 0; i < rows; i++) {
//       if (ID === id_list[i]) {
//         if (password === user_data[i].user_password) {
//           console.log("아이디 비밀번호 일치");
//           response.writeHead(302, { Location: "/live" });
//           response.end("");
//           return { userIndex : i,  loginStatus : true};
//         } else {
//           console.log("비밀번호가 잘못 되었습니다.");
//           response.writeHead(302, { Location: "/login" });
//           response.end("");
//           break;
//         }
//       } else if (rows - 1 == i) {
//         console.log("아이디가 잘못 되었습니다.");
//         response.writeHead(302, { Location: "/login" });
//         response.end("");
//         break;
//       }
//     }
//   }

//   async function run () {
    

//     const userInputData = await getData ();
//     return backEndlogic(userInputData);
    
//   }
  
//   return await run();

// };