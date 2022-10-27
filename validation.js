const access = require("./DB/access");

exports.Login = async function (request, response) {
  const object = access.userData(request, response);
  const user_data = object.user_data;
  const id_list = object.id_list;
  const rows = object.count_user_datas_row;
  // form에서 입력한 값 로드
  
  async function getData () {
    let login_data = "";
    let userInputData = {};
    let ID = "null";
    let password = "null";

    let getFromForm = new Promise((resolve, reject) => {
      request.on("data", (data) => {
        resolve(login_data += data);
      });
    });

    let parseData = new Promise((resolve, reject) => {
      request.on("end", () => {
        const userdata = new URLSearchParams(login_data);
        userInputID = userdata.get("ID");
        userInputPassword = userdata.get("PW");
        resolve();
      });
    });

    await getFromForm;
    await parseData;

    userInputData = {
      ID : userInputID,
      password : userInputPassword,
    }

    return userInputData;

  }

  function backEndlogic (userInputData) {
    const ID = userInputData.ID;
    const password = userInputData.password;

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
  }

  async function run () {
    

    const userInputData = await getData ();
    return backEndlogic(userInputData);
    
  }
  
  return await run();

};

















































// exports.Login = function (request, response) {
//   const object = access.userData(request, response);
//   const user_data = object.user_data;
//   const id_list = object.id_list;
//   const rows = object.count_user_datas_row;
//   // form에서 입력한 값 로드
//   let login_data = "";
//   request.on("data", function (data) {
//     login_data += data;
//   });
//   request.on("end", function () {
//     const userdata = new URLSearchParams(login_data);
//     const ID = userdata.get("ID");
//     const password = userdata.get("PW");
//     for (let i = 0; i < rows; i++) {
//       if (ID === id_list[i]) {
//         if (password === user_data[i].user_password) {
//           console.log("아이디 비밀번호 일치");
//           response.writeHead(302, { Location: "/live" });
//           response.end("");
//           break;
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
//   });
// };

