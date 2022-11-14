const { response } = require("express");
const getLiveData = require("./getLiveData.js");
module.exports = {
  
  /**
   * 웹 사이트의 헤더 부분 (statusbar + 링크들)
   * @param {*} loginOrLogout 로그인과 로그아웃 링크
   * @param {*} text 로그인과 로그아웃 텍스트
   * @param {*} statusbar 상태바
   * @returns 
   */
  header: (statusbar = "알람이 없습니다.", loginOrLogout="login", text="로그인") => {
    if (statusbar === "undefined undefined undefined") {
      statusbar = "알람이 없습니다."
    }
    return `
            ${statusbar}
            <ul>
                <li><a href="/${loginOrLogout}">${text} 페에지 링크</a></li>
                <li><a href="/profile">프로필 페에지 링크</a></li>
                <li><a href="/alarm">알람 페에지 링크</a></li>
                <li><a href="/live">실시간 페에지 링크</a></li>
            </ul>
            `;
  },

  /**
   * 비로그인시 사용자에게 보여지는 body 부분
   * @returns HTML 코드
   */
  body: () => {
    return `
            this is empty. edit template object body method.
            `;
  },

  /**
   * 웹 사이트의 틀을 구성하는 메서드 
   * @param {*} title 웹 브라우저의 탭 이름 (문자열)
   * @param {*} header 상태바와 링크 부분 (HTML 코드)
   * @param {*} body 본문 부분 (HTML 코드)
   * @returns HTML 코드
   */
  HTML: (title, header, body) => {
    
    return `
            <!doctype html>
            <html>
            <head>
            <title>${title}</title>
            <meta charset="utf-8"> 
            </head>
            <body>
            ${header}
            ${body}
            </body>
            </html>
            `;
  },

  
  funcname : (user_id, nick ,adress) => {
    let userID = user_id;
    let len = nick.length;
    let nick_adress_form = ``;
    for (let i = 0; i < len; i++) {
      nick_adress_form += `<p><div>${nick[i]}</div><div> ${adress[i]}</div></p>`;
    }
    return `
      <div>
          <p><span>${userID}</span><span>님</span></p>
          <div>${nick_adress_form}</div>
      </div>
      <p><input type="button" value="사용자 정의 위치 생성" onClick="location.href='/create_userloc'"></p>
      <button name="edit_delete_userlocation" onClick="location.href='/edit_delete_userlocation'">수정,삭제</button>
  `;
  },

  /**
   * 사용자가 저장한 위치 정보를 수정 삭제가 가능한 HTML 코드를 반환하는 로직
   * @param {*} user_id 접속한 사용자의 세션 userid 
   * @param {*} nickList 해당되는 사용자의 위치 별명 리스트
   * @param {*} adressList 해당되는 사용자의 주소 리스트
   * @returns HTML 코드
   */
  edit_delete_userlocation : (user_id, nickList ,adressList) => {
    let userID = user_id;
    let len = nickList.length;
    let nick_adress_form = ``;
    for (let i = 0; i < len; i++) {
      nick_adress_form += `<form name="edit" action="/update_userlocation" method="post">
                            <input type="submit" value="수정" onclick="check()">
                            <input type="hidden" name="userlocation_row" value="${i}"></form>`;
      nick_adress_form += `<div>${nickList[i]}</div><div> ${adressList[i]}</div>`;
      nick_adress_form += `<form name="delete" action="/delete_userlocation_process" method="post">
                            <input type="submit" value="삭제" onclick="check()">
                            <input type="hidden" name="userlocation_row" value="${i}">
                            </form><br>`;
    }
    return `
      <div>
          <p><span>${userID}</span><span>님</span></p>
          <div>${nick_adress_form}</div>
      </div>`;
  },


  /**
   * 알람 틀을 제공하는 메서드
   * @param {*} alarms 일람내용 (HTML 코드)
   * @returns HTML 코드
   */
  alarm : (alarms) => {
    return `
    ${alarms} 
    <p><input type="button" name="redirect_create_alarm" onClick="location.href='/create_alarm'" value="알람 생성 버튼"></p><br>
    
    <button name="edit_delete_alarm" onClick="location.href='/edit_delete_alarm'">수정,삭제</button>`;
  },
  
  /**
   * 주소를 입력받을 수 있는 틀을 제공하는 메서드
   * @returns HTML 코드
   */
  create_userLoc: function () {
    const APIkey = "6c2ba4ae316b4be8e59c17b0af464fec"; //kakao

    const getAdressScript = `
      let xpos; 
      let ypos;
      var mapContainer = document.getElementById('map'), // 지도를 표시할 div
      mapOption = {
          center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
          level: 5 // 지도의 확대 레벨
      };

      //지도를 미리 생성
      var map = new daum.maps.Map(mapContainer, mapOption);
      //주소-좌표 변환 객체를 생성
      var geocoder = new daum.maps.services.Geocoder();
      //마커를 미리 생성
      var marker = new daum.maps.Marker({
          position: new daum.maps.LatLng(37.537187, 127.005476),
          map: map
      });

      function sample5_execDaumPostcode() {
          new daum.Postcode({
              oncomplete: function(data) {
                  var addr = data.address; // 최종 주소 변수

                  
                  // 주소 정보를 해당 필드에 넣는다.
                  document.getElementById("sample5_address").value = addr;
                  document.getElementById("adresss").value = addr;
                  // 주소로 상세 정보를 검색
                  geocoder.addressSearch(data.address, function(results, status) {
                      // 정상적으로 검색이 완료됐으면
                      if (status === daum.maps.services.Status.OK) {

                          var result = results[0]; //첫번째 결과의 값을 활용
                          console.log(result.road_address.x);
                          console.log(result.road_address.y);
                          
                          // xy 좌표값
                          xpos = result.road_address.x;
                          ypos = result.road_address.y;
                          
                          document.getElementById("xpos").value = xpos;
                          document.getElementById("ypos").value = ypos;
                          // 해당 주소에 대한 좌표를 받아서
                          var coords = new daum.maps.LatLng(result.y, result.x);
                          // 지도를 보여준다.
                          mapContainer.style.display = "block";
                          map.relayout();
                          // 지도 중심을 변경한다.
                          map.setCenter(coords);
                          // 마커를 결과값으로 받은 위치로 옮긴다.
                          marker.setPosition(coords)
                      }
                  });
                  
              }
          }).open();
        } 
    `;
    return `
    <input type="text" id="sample5_address" placeholder="주소">
        <input type="button" onclick="sample5_execDaumPostcode()" value="주소 검색"><br>
        <div id="map" style="width:300px;height:300px;margin-top:10px;display:none"></div>
   
        <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
        <script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${APIkey}&libraries=services"></script>
        <script>${getAdressScript}</script>
    <form action="create_userloc_process" method="post">
      
      <input type="hidden" id="adresss" name="adress" >
      <input type="hidden" id="xpos" name="xpos" >
      <input type="hidden" id="ypos" name="ypos" >
      <p>지역 별명 : <input type="text" name="location_nickname" ></p> 
      <p><input type="submit" value="확인"></p>
    </form>`;
  },

  /**
   * 주소를 입력받을 수 있는 틀을 제공하는 메서드 (수정용)
   * @returns HTML 코드
   */
  edit_userLoc: function (selectedRow) {
    const APIkey = "6c2ba4ae316b4be8e59c17b0af464fec"; //kakao

    const getAdressScript = `
      let xpos; 
      let ypos;
      var mapContainer = document.getElementById('map'), // 지도를 표시할 div
      mapOption = {
          center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
          level: 5 // 지도의 확대 레벨
      };

      //지도를 미리 생성
      var map = new daum.maps.Map(mapContainer, mapOption);
      //주소-좌표 변환 객체를 생성
      var geocoder = new daum.maps.services.Geocoder();
      //마커를 미리 생성
      var marker = new daum.maps.Marker({
          position: new daum.maps.LatLng(37.537187, 127.005476),
          map: map
      });

      function sample5_execDaumPostcode() {
          new daum.Postcode({
              oncomplete: function(data) {
                  var addr = data.address; // 최종 주소 변수

                  
                  // 주소 정보를 해당 필드에 넣는다.
                  document.getElementById("sample5_address").value = addr;
                  document.getElementById("adresss").value = addr;
                  // 주소로 상세 정보를 검색
                  geocoder.addressSearch(data.address, function(results, status) {
                      // 정상적으로 검색이 완료됐으면
                      if (status === daum.maps.services.Status.OK) {

                          var result = results[0]; //첫번째 결과의 값을 활용
                          console.log(result.road_address.x);
                          console.log(result.road_address.y);
                          
                          // xy 좌표값
                          xpos = result.road_address.x;
                          ypos = result.road_address.y;
                          
                          document.getElementById("xpos").value = xpos;
                          document.getElementById("ypos").value = ypos;
                          // 해당 주소에 대한 좌표를 받아서
                          var coords = new daum.maps.LatLng(result.y, result.x);
                          // 지도를 보여준다.
                          mapContainer.style.display = "block";
                          map.relayout();
                          // 지도 중심을 변경한다.
                          map.setCenter(coords);
                          // 마커를 결과값으로 받은 위치로 옮긴다.
                          marker.setPosition(coords)
                      }
                  });
                  
              }
          }).open();
        } 
    `;
    return `
    <input type="text" id="sample5_address" placeholder="주소">
        <input type="button" onclick="sample5_execDaumPostcode()" value="주소 검색"><br>
        <div id="map" style="width:300px;height:300px;margin-top:10px;display:none"></div>
   
        <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
        <script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${APIkey}&libraries=services"></script>
        <script>${getAdressScript}</script>
    <form action="/update_userlocation_process" method="post">
      <input type="hidden" name="origin" value = ${selectedRow}>
      <input type="hidden" id="adresss" name="adress" >
      <input type="hidden" id="xpos" name="xpos" >
      <input type="hidden" id="ypos" name="ypos" >
      <p>지역 별명 : <input type="text" name="location_nickname" ></p> 
      <p><input type="submit" value="확인"></p>
    </form>`;
  },




  liveForm : function (estimated_time) {
    let mock_start_time = "8:00";
    let mock_arrival_time = "계산로직 구현";
    return `<form method="post">
    <div>
      <p>예상 소요 시간:${estimated_time}</p>
      <div>
        <p>출발시간:${mock_start_time}</p>
        <p>도착시간:${mock_arrival_time}</p>
      </div>
    </div>
  </form>`;
  },
  liveBeforeProcess : function (request, response) {
    const title = "live_before_process";
    const getLD = getLiveData.getLiveData(request, response, title);
    return getLD;
  }
};
