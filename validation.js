const access = require("./DB/access");

exports.Login = function (request, response) {
  const object = access.userData(request, response);
  const user_data = object.user_data;
  const id_list = object.id_list;
  const rows = object.count_user_datas_row;
  let login_data = "";
  request.on("data", function (data) {
    login_data += data;
  });
  request.on("end", function () {
    const userdata = new URLSearchParams(login_data);
    const ID = userdata.get("ID");
    const password = userdata.get("PW");
    for (let i = 0; i < rows; i++) {
      if (ID === id_list[i]) {
        if (password === user_data[i].user_password) {
          console.log("아이디 비밀번호 일치");
          response.writeHead(302, { Location: "/live" });
          response.end("");
          break;
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
  });
};

