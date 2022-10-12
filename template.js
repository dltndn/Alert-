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

  funcname: function () {
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
