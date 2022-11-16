// 입력부
    let signup_data = "";
    request.on("data", function (data) {
      signup_data += data;
    });
    request.on("end", function () {
      const userdata = new URLSearchParams(signup_data);
      const ID = userdata.get("ID");
      const password = userdata.get("pwd");
      DB.query(`INSERT INTO user_data (user_id, user_password) VALUES(?, ?)`, [ID, password], function (error, result) {
          if (error) {
            throw error;
      }});
    });
    response.writeHead(302, { Location: `/profile` });