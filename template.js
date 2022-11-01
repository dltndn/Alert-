module.exports = {
  /**
   * 웹 사이트의 헤더 부분
   * - 상태바
   * - 링크
   * 
   */
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

  /**
   * 웹 사이트의 내용 부분
   * 
   */
  body: function () {
    return `
            this is empty. edit template object body method.
            `;
  },

  /**
   * 웹 사이트의 틀을 구성하는 메서드 
   * - title : 웹 브라우저의 탭 이름
   * - header : 상태바 부분
   * - body : 본문 부분
   */
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

  /**
   * 웹 사이트의 틀을 구성하는 메서드 
   * - title : 웹 브라우저의 탭 이름
   * - header : 상태바 부분
   * - body : 본문 부분
   * - script : 스크립트 코드
   */
   HTML: function (title, header, body, script="") {
    
    return `
            <!doctype html>
            <html>
            <head>
            <title>${title}</title>
            <meta charset="utf-8"> 
            ${script}
            </head>
            <body>
            ${header}
            ${body}
            </body>
            </html>
            `;
  },

  



  funcname: function (user_id) {
    let userID = user_id;
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
          <p><span>${userID}</span><span>님</span></p>
          <div>${nick_adress_form}</div>
      </div>
      <p><input type="button" value="사용자 정의 위치 생성" onClick="location.href='/create_userloc'"></p>
      <button>수정,삭제</button>
  </form>`;
  },

  funcname2: function () {
    let mock_estimated_time = "0:45";
    let mock_start_time = "8:00";
    let mock_arrival_time = "8:45";
    return `<form method="post">
    <div>
      <p>예상 소요 시간:${mock_estimated_time}</p>
      <div>
        <p>출발시간:${mock_start_time}</p>
        <p>도착시간:${mock_arrival_time}</p>
      </div>
    </div>
    <p>지도API</p>
    <p>cctv API</p>
  </form>`;
  },

  alarm : function (title) {
    return `
    ${title} 임시 페이지 내용 추가 필요
    <p><input type="button" name="redirect_create_alarm" onClick="location.href='/create_alarm'" value="알람 생성 버튼"></p>`;
  }
  
};
