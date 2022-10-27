const asyncDB = require("./DBhostdata");
const syncDB = require("./DBhostdata");

/**Alert 데이터베이스의 user_data 테이블에 대한 정보
 * @param {*} request 
 * @param {*} response 
 * @returns 객체타입 (사용자 테이블, 인스턴스의 개수, 아이디 리스트)
 */

exports.userData = function (request, response) {
  let object = {};
  let id_list = [];
  const user_data = syncDB.query(`SELECT * FROM Alert.user_data;`);
  const rows = syncDB.query(`SELECT COUNT(user_id) as count FROM user_data;`)[0]
    .count;
  for (let i = 0; i < rows; i++) {
    id_list.push(user_data[i].user_id);
  }

  object = {
    "user_data": user_data,
    "count_user_datas_row": rows,
    "id_list": id_list,
  };

  return object;
};
