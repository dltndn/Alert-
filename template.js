const getLiveData = require("./getLiveData.js");
const getCctvData = require("./getCctvData");
const cookie = require('cookie');
const session = require('express-session');

/**
 * 웹 사이트의 헤더 부분 (statusbar + 링크들)
 * @param {*} loginOrLogout 로그인과 로그아웃 링크
 * @param {*} text 로그인과 로그아웃 텍스트
 * @param {*} statusbar 상태바
 * @returns 
 */
exports.header = (request, statusbar = "알람이 없습니다.", loginOrLogout="login", text="로그인") => {
  console.log(request.session);
  if (statusbar === "undefined undefined undefined") {
    statusbar = "알람이 없습니다."
  }
  let event;
  let script = `  
  <script>
    showPopup = () => {
      const background = document.querySelector('#background');
      background.classList.remove('hide');
    }
    closePopup = () => {
      const background = document.querySelector('#background');
      background.classList.add('hide');
    }
  </script>`;
  if (request.session.is_logined === undefined) {
    event = 'showPopup()';
  }else{
    event = `location.href='/logout_process'`;
  }
  return `
          ${script}
          <link rel="stylesheet" type="text/css" href="./header.css">
          <div class="header_background">
            <div class="headerTop">
              <div class="statusbar">${statusbar}</div>
              <button class="login_button" onclick="${event}" >${text}</button>
            </div>
            <ul>
            <li><a href="/profile">프로필 페에지</a></li>
            <li><a href="/alarm">알람 페에지</a></li>
            <li><a href="/live_before_process">실시간 페에지</a></li>
          </ul>
          </div>
          `;
},

/**
 * 비로그인시 사용자에게 보여지는 body 부분
 * @returns HTML 코드
 */
exports.body = () => {
return `
<link rel="stylesheet" type="text/css" href="./mainPageBody.css">
<div class="icon_img"></div>
<div class="description">

  <h1>Alert!</h1>
  <p>Alert!는 출발지와 도착지간 예상시간을<br>
      사용자에게 미리 알려줍니다.</p>
  <h1>기능</h1>
  <p>Alert!는 다음 기능들을 지원 합니다.</p>

  <h2>프로필</h2>
  <p>사용자가 등록한 위치를 관리할 수 있습니다. <br>
      이러한 위치는 알람을 등록할 때 사용됩니다.</p>

  <h2>알람</h2>
  <p>알람은 알람으로 등록, 수정, 삭제하여<br>
      특정 시간에 사용자에게 알림을 줍니다.</p>

  <h2>실시간 확인</h2>
  <p>실시간 확인은 최적 경로와<br> 현재 교통정보와 CCTV 상황을 알려줍니다.</p>
</div>
<div class="details">
  <h1>프로필 관리</h1>
  <p>사용자가 지정한 위치의 별명을 관리합니다.</p>
  
  
  <h2>알람 등록</h2>
  <p>출발지와 도착지의 예상시간을 바로 알려줍니다.</p>


  <h2>실시간 확인</h2>
  <p>알람을 등록할 수 있습니다.</p>
</div>
<div class="stacks">
  <h1>stacks</h1>
</div>
<div class="developer">
  <div>개발자 1 정보 </div>
  <div>개발자 2 정보 </div>
</div>

        `;
},

/**
 * 웹 사이트의 틀을 구성하는 메서드 
 * @param {*} title 웹 브라우저의 탭 이름 (문자열)
 * @param {*} header 상태바와 링크 부분 (HTML 코드)
 * @param {*} body 본문 부분 (HTML 코드)
 * @returns HTML 코드
 */
  exports.HTML = (title, header, body) => {
  let login = this.login();
  return `
  <!DOCTYPE html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="icon" href="./images/icon.jpg">
    </head>
    <body>
      <header>
        ${header}
      </header>
      <link rel="stylesheet" type="text/css" href="./main.css">
      <main>
        ${body}
      </main>
      <div>
        ${login}
      </div>
    </body>
  </html>
          `;
},

/**
 * 로그인 팝업
 * @returns 로그인 팝업 HTML
 */
exports.login = () => {
  return `
          <link rel="stylesheet" type="text/css" href="./login.css">
          <div id="background" class="hide">
            <div class="container">
              <div id="login" class="login">
              로그인
              </div>
              <form id="inputs" class="loginForm inputs"  action="/login_process" method="post">
                  <input class="textbox" id="id" type="text" name="ID" placeholder="ID">
                  <input class="textbox" id="password" type="password" name="PW" placeholder="PW">
                  <div><a href="http://localhost:3000/signUp" value="회원가입">회원가입</a></div>
                  <input class="button" id="submit" type="submit" value="확인" onclick="closePopup()">
                  <input class="button" id="cancel" type="button" value="취소" onClick="location.href='/';">
              </form>
            </div>
          </div>`
},
  
exports.register = () => {
  return `
  <link rel="stylesheet" type="text/css" href="./register.css">
  <div id="background">
    <div class="container">
      
      <div class="title">회원가입</div>
      <form class="registerForm" name="signup" action="signUp_process" method="post">
        <div><input type="ID" id="id" class="textbox" name="ID" minlength="8" placeholder="아이디를 입력하세요" required>
        <button class="doubleCheck" name="verification" onclick="">중복확인</button></div>
        <input type="password" class="textbox" name="pwd" minlength="4" placeholder="패스워드를 입력해주세요" required>
        <input type="password" class="textbox" name="contrastPwd" minlength="4" placeholder="패스워드를 입력해주세요" required>
        <input type="submit"  id="submit" class="button" value="확인" onclick="">
        <button name="cancel" id="cancel" class="button" onClick="location.href='/'">취소</button>
      </form>
    </div>
  </div>`
},
  
exports.createAlarm = () => {
  return `
         <form action="/create_alarm_process" method="post">
          <input type="button" value="사용자 정의 위치 생성" onClick="location.href='/create_userloc'">
          
            <input type="checkbox" name="Day_of_the_week" value="일" id="일">
            <label for="일">일</label>
            <input type="checkbox" name="Day_of_the_week" value="월" id="월">
            <label for="월">월</label>
            <input type="checkbox" name="Day_of_the_week" value="화" id="화">
            <label for="화">화</label>
            <input type="checkbox" name="Day_of_the_week" value="수" id="수">
            <label for="수">수</label>
            <input type="checkbox" name="Day_of_the_week" value="목" id="목">
            <label for="목">목</label>
            <input type="checkbox" name="Day_of_the_week" value="금" id="금">
            <label for="금">금</label>
            <input type="checkbox" name="Day_of_the_week" value="토" id="토">    
            <label for="토">토</label>
          
              
          
            <select name="출발지">
              <option value="">출발지 선택</option>
              <option value="지역 1">지역 1</option>
              <option value="지역 2">지역 2</option>
              <option value="지역 3">지역 3</option>
            </select>

          =>

            <select name="도착지">
              <option value="">도착지 선택</option>
              <option value="지역 1">지역 1</option>
              <option value="지역 2">지역 2</option>
              <option value="지역 3">지역 3</option>
            </select>
          

          알람시간
          <p>
            <input type="number" name="alarm_time_hour" min="0" max="23" value="0"> : <input type="number" name="alarm_time_min" min="0" max="59" value="0">
          </p>
          
          도착예정시간
          <p>
            <input type="number" name="depart_time_hour" min="0" max="23" value="0"> : <input type="number" name="depart_time_min" min="0" max="59" value="0">
          </p>

          <p><input type="submit" value="확인"></p>
          <p><input type="button" value="취소" onClick="location.href='/alarm'"> </p>
        </form>
      </div>
    </div>`;
}

exports.funcname = (user_id, nick ,adress) => {
    let userID = user_id;
    let len = nick.length;
    let nick_adress_form = ``;
    for (let i = 0; i < len; i++) {
      nick_adress_form += `<div class="dataBox"><span class="nickName">${nick[i]}</span><span style="font-weight: 350;">|</span><span class="address">${adress[i]}</span></div>`;
    }
    return `
    <link rel="stylesheet" type="text/css" href="./profile.css">
      <p class="idTemplate"><span>ID</span><span style="flex-grow:1;text-align: end;">${userID}</span><span style="padding-left: 1rem;">님</span></p>
      <div class="profile">
        <div class="table">
            <p class="title"><span style="padding-left: 1rem;">별칭</span><span style="padding-left: 5rem;">주소</span></p>
            ${nick_adress_form}
        </div>
        <input class="createBtn" type="button" value="사용자 정의 위치 생성" onClick="location.href='/create_userloc'">
        <button name="edit_delete_userlocation" onClick="location.href='/edit_delete_userlocation'">수정,삭제</button>
      </div>  
  `;
  },

  /**
   * 사용자가 저장한 위치 정보를 수정 삭제가 가능한 HTML 코드를 반환하는 로직
   * @param {*} user_id 접속한 사용자의 세션 userid 
   * @param {*} nickList 해당되는 사용자의 위치 별명 리스트
   * @param {*} adressList 해당되는 사용자의 주소 리스트
   * @returns HTML 코드
   */
   exports.edit_delete_userlocation = (user_id, nickList ,adressList) => {
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
   exports.alarm = (alarms) => {
    return `
    ${alarms} 
    <p><input type="button" name="redirect_create_alarm" onClick="location.href='/create_alarm'" value="알람 생성 버튼"></p><br>
    
    <button name="edit_delete_alarm" onClick="location.href='/edit_delete_alarm'">수정,삭제</button>`;
  },
  
  /**
   * 주소를 입력받을 수 있는 틀을 제공하는 메서드
   * @returns HTML 코드
   */
   exports.create_userLoc = function () {
    const APIkey = "6c2ba4ae316b4be8e59c17b0af464fec"; //kakao

    const getAdressScript = `
    let xpos; 
    let ypos;

    // 우편번호 찾기 찾기 화면을 넣을 element
    var element_wrap = document.getElementById('wrap');

    var geocoder = new daum.maps.services.Geocoder();

    function foldDaumPostcode() {
        // iframe을 넣은 element를 안보이게 한다.
        element_wrap.style.display = 'none';
    }

    function sample3_execDaumPostcode() {
        // 현재 scroll 위치를 저장해놓는다.
        var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        new daum.Postcode({
            oncomplete: function(data) {
                console.log(geocoder);
                // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var addr = ''; // 주소 변수
                var extraAddr = ''; // 참고항목 변수

                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                document.getElementById("sample3_address").value = addr;
                document.getElementById("adresss").value = addr;

                // iframe을 넣은 element를 안보이게 한다.
                // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
                element_wrap.style.display = 'none';

                // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
                document.body.scrollTop = currentScroll;
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
                    }
                });
            },
            // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
            onresize : function(size) {
                element_wrap.style.height = size.height+'px';
            },
            width : '100%',
            height : '100%'
        }).embed(element_wrap);

        // iframe을 넣은 element를 보이게 한다.
        element_wrap.style.display = 'block';
    }
    sample3_execDaumPostcode()
    `;
    return `
    <link rel="stylesheet" type="text/css" href="./userLoc.css">
    <div class="userLoc">
    
      <div id="wrap" style="display:none;border:1px solid;width:388px;height:388px;margin:5px 0;position:relative">
      </div>
      
            <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
            <script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${APIkey}&libraries=services"></script>
            <script>${getAdressScript}</script>
            <input class="textBox" type="text" id="sample3_address" placeholder="주소">
        <form action="create_userloc_process" method="post">
          
          <input type="hidden" id="adresss" name="adress" >
          <input type="hidden" id="xpos" name="xpos" >
          <input type="hidden" id="ypos" name="ypos" >
          <input class="textBox" type="text" name="location_nickname" placeholder="지역 별명">
          <input class="formSubmit" type="submit" value="확인">
        </form>

        
    </div>
    `;
  },

  /**
   * 주소를 입력받을 수 있는 틀을 제공하는 메서드 (수정용)
   * @returns HTML 코드
   */
   exports.edit_userLoc = function (selectedRow) {
    const APIkey = "6c2ba4ae316b4be8e59c17b0af464fec"; //kakao

    const getAdressScript = `
    let xpos; 
    let ypos;

    // 우편번호 찾기 찾기 화면을 넣을 element
    var element_wrap = document.getElementById('wrap');

    var geocoder = new daum.maps.services.Geocoder();

    function foldDaumPostcode() {
        // iframe을 넣은 element를 안보이게 한다.
        element_wrap.style.display = 'none';
    }

    function sample3_execDaumPostcode() {
        // 현재 scroll 위치를 저장해놓는다.
        var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        new daum.Postcode({
            oncomplete: function(data) {
                console.log(geocoder);
                // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var addr = ''; // 주소 변수
                var extraAddr = ''; // 참고항목 변수

                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                document.getElementById("sample3_address").value = addr;
                document.getElementById("adresss").value = addr;

                // iframe을 넣은 element를 안보이게 한다.
                // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
                element_wrap.style.display = 'none';

                // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
                document.body.scrollTop = currentScroll;
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
                    }
                });
            },
            // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
            onresize : function(size) {
                element_wrap.style.height = size.height+'px';
            },
            width : '100%',
            height : '100%'
        }).embed(element_wrap);

        // iframe을 넣은 element를 보이게 한다.
        element_wrap.style.display = 'block';
    }
    sample3_execDaumPostcode()
    `;
    return `
    <link rel="stylesheet" type="text/css" href="./userLoc.css">
    <div class="userLoc">
    
      <div id="wrap" style="display:none;border:1px solid;width:388px;height:388px;margin:5px 0;position:relative">
      </div>
      
            <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
            <script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${APIkey}&libraries=services"></script>
            <script>${getAdressScript}</script>
            <input class="textBox" type="text" id="sample3_address" placeholder="주소">
        <form action="create_userloc_process" method="post">
        <input type="hidden" name="origin" value = ${selectedRow}>
          <input type="hidden" id="adresss" name="adress" >
          <input type="hidden" id="xpos" name="xpos" >
          <input type="hidden" id="ypos" name="ypos" >
          <input class="textBox" type="text" name="location_nickname" placeholder="지역 별명">
          <input class="formSubmit" type="submit" value="확인">
        </form>

        
    </div>
    `;
  },

  exports.liveForm = function (estimated_time, departure_time, expect_time) {
    return `
    <div class="dataTag">
      <p>예상 소요 시간:${estimated_time}</p>
      <div class="timeTag">
        <p class="timeTagP" style="margin-right: 0.2rem;">출발시간:${departure_time}</p>
        <p class="timeTagP" style="margin-left: 0.2rem;">도착시간:${expect_time}</p>
      </div>
    </div>
    `;
  },

  exports.liveBeforeProcess = function (request, response) {
    const title = "live_before_process";
    const getLD = getLiveData.getLiveData(request, response, title);
    return getLD;
  }, 
  exports.loadingLive = async function (request, response) {
    const itsAPIKEY = 'd81d3254072d4f96ac9338294785d036';
    let cctvUrlList = [];
    let cctvDataList = [];     //정체구간 근방 cctv src url데이터
    const cookies = cookie.parse(request.headers.cookie);
    if (request.headers.cookie !== undefined){
      const jamSectionList = JSON.parse(cookies.trafficJamList);  //정체구간 좌표
      if(jamSectionList == null) {
        return ;
      }
      for (const jamSection of jamSectionList) {
          let cenY = jamSection.lat;
          let cenX = jamSection.lng;
          let cctvUrl = getCctvData.getCctvUrl(itsAPIKEY, cenX, cenY);    
          let cctvSrc = await getCctvData.getCctvSrc(cctvUrl);
          if (cctvSrc.length > 1) {
              for (const ob in cctvSrc) {
                cctvDataList.push(cctvSrc[ob]);
              }            
          } else if (cctvSrc.length == 1) {
            cctvDataList.push(cctvSrc);
          } else {
              console.log("empty src list");
          }
      }
    } else {
      console.log("empty cookie");
    }
    request.session.cctvDataList = cctvDataList;
  }, 
  exports.cctvTabForm = function (request) {
    const cctvDataList = request.session.cctvDataList; //{name, src, coordx, coordy}
    const cookies = cookie.parse(request.headers.cookie);
    let cctvArrIndex = cookies.cctvArrIndex;  //유저가 선택한 cctv데이터 배열 endIndex
    cctvArrIndex = parseInt(cctvArrIndex);
    const src = cctvDataList[cctvArrIndex].src;
    return`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>CCTV</title>
    </head>
    <body>
          <link rel="stylesheet" type="text/css" href="./cctvTab.css">
          <video id="video" class="cctvStreaming" width="auto" height="auto" controls autoplay></video>
          <input type="button" class="closeTab" value="돌아가기" onclick="winClose()">
          <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
          <script>
          const video = document.getElementById('video');
          const videoSrc = '${src}';
      
          if (Hls.isSupported()) {
              const hls = new Hls();
      
              hls.loadSource(videoSrc);
              hls.attachMedia(video);                    
          } else if (video,canPlayType('application/vnd.apple.mpegurl')) {
              video.src = videoSrc;
              video.addEventListener('loadedmetadata', () => {
                  video.play();
              });
          }
          const winClose = () => {
            window.open('','_self').close();
          }
        </script>
    </body>
    </html>
    `;
}
 



