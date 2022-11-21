const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

module.exports = {
  /**
   * Form 에서 데이터를 받아 객체를 리턴하는 메서드
   * @param {*} request
   * @param {*} response
   * @returns 객체타입의 값을 리턴
   */
  getFormData(request, response) {
    return request.body;
  },
};
