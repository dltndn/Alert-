//const liveData = require('getLiveData.js');

module.exports = {
  header: function () {
    return `
    
            statusbar section
            <ul>
                <li><a href="/login">로그인 페에지 링크</a></li>
                <li><a href="/profile">프로필 페에지 링크</a></li>
                <li><a href="/alarm">알람 페에지 링크</a></li>
                <li><a href="/live">실시간 페에지 링크</a></li>
            </ul>
            `;
  },

  body: function () {
    return `
            this is empty. edit template object body method.
            `;
  },

  HTML: function (title, header, body) {
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

  profile_body: function () {
    let userID = "mockID";
    let mock_nick_adress = {
      nick: ["mock1", "mock2"],
      adress: ["경기도", "서울시"],
    };
    let len = mock_nick_adress.nick.length;
    let nick_adress_form = ``;
    for (let i = 0; i < len; i++) {
      nick_adress_form += `<p><div>${mock_nick_adress.nick[i]}</div><div> ${mock_nick_adress.adress[i]}</div></p>`;
    }
    return `<form method="post" action="">
      <div>
          <p><span>ID</span>${userID}<span>님</span></p>
          <div>${nick_adress_form}</div>
      </div>
      <p><input type="button" value="사용자 정의 위치 생성" onClick="location.href='/create_userloc'"></p>
      <button>수정,삭제</button>
  </form>`;
  },

  alarm_body: function () {
    let mock_user_id = "su";
    let mock_alarm_data = [
      {
        alarm_time: "오전 7시",
        departure_time: "오전 8시",
        departure_address: "집",
        arrival_adress: "학교",
        day: "월,화,일",
        work_bool: true,
      },
      {
        alarm_time: "오전 9시",
        departure_time: "오전 9시20분",
        departure_address: "집",
        arrival_adress: "회사",
        day: "월,수,금",
        work_bool: true,
      },
    ];

    const day_check = function (arr) {
      let day_bool_clone = day_bool;
      arr.forEach((element) => {
        switch (element) {
          case "일":
            day_bool_clone[0] = element;
            break;
          case "월":
            day_bool_clone[1] = element;
            break;
          case "화":
            day_bool_clone[2] = element;
            break;
          case "수":
            day_bool_clone[3] = element;
            break;
          case "목":
            day_bool_clone[4] = element;
            break;
          case "금":
            day_bool_clone[5] = element;
            break;
          case "토":
            day_bool_clone[6] = element;
            break;
          default:
            console.log("감지x");
        }
      });
      return day_bool_clone;
    };
    let len = mock_alarm_data.length;

    let day_bool = [0, 0, 0, 0, 0, 0, 0, 0];
    let alarm_form = ``;
    for (let i = 0; i < len; i++) {
      let dataObj = mock_alarm_data[i];
      let day_arr = dataObj.day.split([","]);
      day_arr = day_check(day_arr);
      alarm_form += `<p>알람시간: ${dataObj.alarm_time}, 출발시간: ${dataObj.departure_time}, 출발지: ${dataObj.departure_address}, 도착지: ${dataObj.arrival_adress}, 활성화: ${dataObj.work_bool}<br>
                      활성화 요일: ${day_arr}</p>`;
    }
    return `<form method="post" action="">
      <div>
          <p><span>ID</span>${mock_user_id}<span>님</span></p>
          <div>${alarm_form}</div>
      </div>
      <button>수정,삭제 버튼</button>
      <p><input type="button" name="redirect_create_alarm" onClick="location.href='/create_alarm'" value="알람 생성 버튼"></p>
  </form>`;
  },
  create_userLoc: function () {
    const APIkey = "6c2ba4ae316b4be8e59c17b0af464fec"; //kakao

    const getAdressScript = `
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
                // 주소로 상세 정보를 검색
                geocoder.addressSearch(data.address, function(results, status) {
                    // 정상적으로 검색이 완료됐으면
                    if (status === daum.maps.services.Status.OK) {

                        var result = results[0]; //첫번째 결과의 값을 활용
                        console.log(result.road_address.x);
                        console.log(result.road_address.y);
                        localStorage.setItem('userLocX', result.road_address.x);
                        localStorage.setItem('userLocY', result.road_address.y);

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
    <p>지역 별명 : <input type="text" name="location_nickname" ></p> 
    <p><input type="submit" value="확인"></p>
</form>`;
  },
  liveForm : function (estimated_time) {
    let mock_start_time = "8:00";
    let mock_arrival_time = "8:45";
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
  cctvForm : function (cctvUrl) {
    return`<embed src=${cctvUrl} width="320px" height="280px">`;
  },
  liveProcess : function () {
    return``;
  },
};
