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
      
  }