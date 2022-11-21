//test
module.exports = {
    test : (src) => {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Document</title>
        </head>
        <body>
            <video id="video" width="500" height="500" controls></video>
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
            </script>
        </body>
        </html>`;
    },
    testt : () => {
        return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">
        <head>
        <title>UTIC 도시교통정보센터</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=0,maximum-scale=10,user-scalable=yes">
        <link rel="stylesheet" type="text/css" href="https://www.utic.go.kr/contents/css/global.css" />
        <link rel="stylesheet" type="text/css" href="https://www.utic.go.kr/contents/css/map/sub_map.css" />
                                                                                                                     <!-- 개발할시엔  http 운영할시엔 https 로 수정-->
        <!--  <script language="javascript" type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script> --->
        <script language="javascript" type="text/javascript" src="https://www.utic.go.kr/contents/js/jquery.min.js "></script>
        <script type="text/javascript" src="https://www.utic.go.kr/contents/js/openDataCctvStream.js?ver=1" charset="utf-8"></script>
        <script type="text/javascript" src="https://www.utic.go.kr/contents/js/Component/SmartProtect/JS/Protected.js"></script>
        <script type="text/javascript" src="https://www.utic.go.kr/contents/js/block.js" charset="utf-8"></script>
        <script type="text/javascript">
        var startDate, endDate;
        $(document).ready(function(){
             $.extend({
                     getTime : function() {
                             endDate = new Date();
                             var diff = Math.floor((endDate-startDate)/1000);
                             var hh = Math.floor(Math.floor(diff/60)/60);
                             var mi = Math.floor(diff/60)%60;
                             var ss = diff%60;
                             var result = mi*60+ss;
                             return result;
                     },
                     hit : function(conn) {
                             $.ajax({
                                     type: "GET",
                                     dataType: "html",
                                     contentType: "text/html; charset=utf-8",
                                     url: "http://its.uw21.net/countCCTV.do",
                                     //http://localhost:8080/UTIS-UW/countCCTV.do?cctvID=L160005&connEnd=1&connPeriod=0
                                     //접속종료유무 ConnEnd = 0:종료 1:접속
                                     data: "cctvID=L160006&connEnd="+conn+"&connPeriod="+(parseInt(conn) == 0 ? "0":$.getTime()),
                                     complete: function(xhr, status){
                                             //xml = xhr.responseText;
                                     },
                                     success: function(xml){
                                     },
                                     error: function(xhr, status, error){
                                             $.msg('error' + error);
                                     }
                             }); // end ajax
                     },
                     msg : function(a){
                             alert(a);
                     }
             });
        
             //사이즈 조절
             if($("#innerObject")) {
                     //브라우저 체크
                     var brwoserChk = navigator.userAgent.toLowerCase();
                     //IE일시 사이즈를 더 감소
                     //if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (brwoserChk.indexOf("msie") != -1) ) {
                     //      $("#innerObject").height($("#innerObject").height()-40);
                     //      window.resizeTo( ($("#innerObject").width()+18), ($("#innerObject").height()+90) );
                     //}
                     //else {
                     //      $("#innerObject").height($("#innerObject").height()-40);
                     //      window.resizeTo( ($("#innerObject").width()+18), ($("#innerObject").height()+140) );
                     //}
             }
        });
        /**************************************************************************************
         * 0000
         **************************************************************************************/
        function changeCCTV(id) {
             var f = document.cctvForm;
             f.cctvID.value = id;
             f.submit(f);
        }
        /**************************************************************************************
         * 0000
         **************************************************************************************/
        function Connect(ip) {
             try {
                     var isConn;
                     var activex = document.getElementById("axPlayer");
                     if (!activex) {
                             //alert("activex connection fail!!!");
                     }else{
                             activex.URL = ip;
                             isConn = activex.Connect();
                             if(!isConn) {
                                     var mmpd = document.getElementById('mmp-div');
                                     mmpd.removeChild(document.getElementById('axPlayer'));
                                     mmpd.innerHTML = '<div style="width:400px; height:135px; padding-top:130px; text-align:center; background:#2a2a2a; color: white; font-size:0.85em;">시스템 점검중입니다.</div>';
                             }
                     }
             } catch(e) {
                     self.status = e;
             }
        }
        /**************************************************************************************
         * 0000
         **************************************************************************************/
        function cctvOff() {
             try {
                     var mmp = document.getElementById('axPlayer');
                     if(mmp) {
                             if(mmp.controls)
                                     mmp.controls.Close();
                             else
                                     mmp.Close();
                             mmp.Destroy(); // 해제옵션.
                             var mmpd = document.getElementById('mmp-div');
                             mmpd.removeChild(mmp);
                             mmpd.innerHTML = '<div style="width:400px; height:135px; padding-top:130px; text-align:center; background:#2a2a2a; color: white; font-size:0.85em;">CCTV 영상정보는 1분만 제공됩니다.</div>';
                     }
                     $.hit(1);
             } catch(e) {
                     self.status = e;
             }
        }
        window.onload = function() {
             startDate = new Date();
             Connect();
        };
        /**************************************************************************************
         * 0000
         **************************************************************************************/
        function RotaCCTV2() {
             this.cctvList = [];
             this.layer;
             this.minlevel = 6;
             this.maxlevel = 8;
             this.getCctv = function(c) {
                     var a = this.cctvList.length;
                     for(var b = 0; b < a; b++) {
                             if(this.cctvList[b].CCTVID == c){
                                     return this.cctvList[b];
                             }
                     }
                     return null;
             };
             this.isLoad = function() {
                     if (this.cctvList.length == 0) {
                             return false;
                     } else {
                             return true;
                     }
             };
             this.loadCCTV = function() {
                     var a = "./../cctv.htm";
                     a = "/map/mapcctv.do";
                     var b = this;
                     $.ajax({
                             url : a,
                             dataType : "json",
                             async : false,
                             success : function(c) {
                                     try{
                                             b.cctvList = c;
                                     }catch(e){
                                     }
                             }
                     });
             };
             this.getCCTVTooltipInfo = function(b) {
                     var a = '<table border="0" cellspacing="0" cellpadding="0"><tr><td width="1" height="1"></td><td bgcolor="#1B4E99"></td><td width="1" height="1"></td></tr><tr><td bgcolor="#1B4E99"></td><td><table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#1B4E99"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td height="20"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td style="padding:3px 3px 3px 3px;color:#ffffff;font-weight:bold;font-size:11px;">'
                                     + b
                                     + '</td></tr></table></td></tr></table></td></tr></table></td><td bgcolor="#1B4E99"></td></tr><tr><td width="1" height="1"></td><td bgcolor="#1B4E99"></td><td width="1" height="1"></td></tr></table>';
                     return a;
             };
             this.popupCctvImage = function(c) {
                     var b = this.getCctv(c);
                     if (b.LOCATE == null && b.MOVIE == "Y") {
                             this.popupCctvStream(c);
                             return;
                     }
                     var a = new StreamCctv(b);
                     var d = Mando.wgs84ToMandoMap(a.gDx, a.gDy);
                     cctvPopup.displayPopup(true, new UTISMap.LonLat(d.lon, d.lat), a.getImageHtml(), c);
                     weblog(c, "cctv");
             };
             this.popupCctvStream = function(cctvid, key){
                     var url = '/map/mapcctvonoff.do?cctvid=' + cctvid;
                     var obj = this;
                     $.getJSON(url, function(data) {
                             if(data.length == 1){
                                     if(data[0] == '0'){
                                             var width = 322;
                                             var height = 330;
                                             //var top = (window.screen.height - height) / 2;
                                             //var left = (window.screen.width - width) / 2;
                                             var features = 'width='+ width +',height='+ height +',top='+ top +',left='+ left +',toolbar=no,scrollbars=no,status=no,resizable=no,location=no';
                                             var popCctv;
                                             popCctv = window.open('/view/map/cctvUgo.jsp', 'UTIC도시교통정보센터', features);
                                             popCctv.focus();
                                     }else{
                                             var streamCctv = new StreamCctv(cctvid);
                                             var width = 345;
                                             var height = 330;
                                             if(streamCctv.gKind == "H"){ // 대구
                                                     width = 345;
                                             }else if(streamCctv.gCh != null){
                                                     width = 345;
                                                     height = 324;
                                             }else if(streamCctv.gKind == "F"){ //전주
                                                     width = 343;
                                                     height = 257;
                                             }else if(streamCctv.gKind == "Y"){ //창원
                                                     width = 345;
                                             }else if(streamCctv.gKind == "J"){ //울산
                                                     width  = 340;
                                                     height = 257;
                                             }else if(streamCctv.gKind == "V"){ //군산
                                                     width  = 390;
                                                     height = 390;
                                             }else if(streamCctv.gKind == "T"){ //안산
                                                     width  = 345;
                                                     height = 324;
                                             }
                                             //var top = (window.screen.height - height) / 2;
                                             //var left = (window.screen.width - width) / 2;
                                             var popCctv;
                                             popCctv = window.open('./../view/map/openDataCctvStream.jsp?key=' + key+ '&cctvid=' + cctvid+ '&cctvName=' + encodeURI(encodeURIComponent(streamCctv.gCctvName)
        ) + '&kind=' + streamCctv.gKind + '&cctvip=' + streamCctv.gCctvIp + '&cctvch=' + streamCctv.gCh + '&id=' + streamCctv.gId + '&cctvpasswd=' + streamCctv.gPasswd + '&cctvport=' + streamCctv.gPort, 'PopupCctv',"top=" + top + "px, left=" + left + "px, width=" + width + "px, height=" + height + "px, menubar=no, location=no, toolbar=no, scrollbars=no, status=no, resizable=no");
                                             popCctv.focus();
                                             weblog(cctvid, 'cctv');
                                     }
                             }else{
                                     var streamCctv = new StreamCctv(cctvid);
                                     var width = 346;
                                     var height = 325;
                                     if(streamCctv.gKind == "H"){ // 대구
                                             width = 800;
                                             height = 600;
                                     }
                                     else if(streamCctv.gCh != null){
                                             width = 345; height = 324;
                                     }
                                     else if(streamCctv.gKind == "F"){ //전주
                                             width = 343;
                                     }
                                     else if(streamCctv.gKind == "Y"){ //창원
                                             width = 345;
                                     }else if(streamCctv.gKind == "J"){ //울산
                                             width  = 340;
                                             height = 257;
                                     }else if(streamCctv.gKind == "V"){ //군산
                                             width  = 390;
                                             height = 390;
                                     }else if(streamCctv.gKind == "T"){ //안산
                                             width  = 345;
                                             height = 324;
                                     }
                                     var top = (window.screen.height-height)/2;
                                     var left = (window.screen.width-width)/2;
                                     var popCctv;
                                     popCctv = window.open('./../view/map/openDataCctvStream.jsp?key=' + key+ '&cctvid=' + cctvid+ '&cctvName=' + encodeURI(encodeURIComponent(streamCctv.gCctvName)) + '&kind=' + streamCctv.gKind + '&cctvip=' + streamCctv.gCctvIp + '&cctvch=' + streamCctv.gCh + '&id=' + streamCctv.gId + '&cctvpasswd=' + streamCctv.gPasswd + '&cctvport=' + streamCctv.gPort, 'PopupCctv',"top=" + top + "px, left=" + left + "px, width=" + width + "px, height=" + height+ "px, menubar=no, location=no, toolbar=no, scrollbars=no, status=no, resizable=no");
                                     popCctv.focus();
                                     weblog(cctvid, 'cctv');
                             }
                 });
             };
             this.popupCctvUgo = function(cctvid){
                     var width = 322;
                     var height = 239;
                     var top = (window.screen.height - height) / 2;
                     var left = (window.screen.width - width) / 2;
                     var features = 'width='+ width +',height='+ height +',top='+ top +',left='+ left +',toolbar=no,scrollbars=no,status=no,resizable=no,location=no';
                     window.open('/view/map/cctvUgo.jsp', 'UTIC도시교통정보센터', features);
                     weblog(cctvid, 'cctv');
             };
             this.popupLiveVideo = function(e, d) {
                     var b = this.getCctv(e);
                     var c = b.locate;
                     //var a = getCctvSteamHTML(c, b.cctvname);
                     displayPopup(true, d, new UTISMap.Size(340, 298), new UTISMap.Size(0, -298 - IconType.IconCCTV.size.h), a);
             };
             this.getCctvFileName = function(b) {
                     var c = b;
                     if (c == undefined) {
                             return "";
                     }
                     var a = c.lastIndexOf("/");
                     if (a > -1) {
                             return c.substring(a + 1, c.length);
                     }
                     return "";
             };
             this.getRealtimeCctvPath = function(b, c) {
                     var e = networkCheck.getCctvPath();
                     var a = "./../map/mapcctvinfo.do?cctvid=" + b.cctvid;
                     var d = this;
                     $.getJSON(a, function(j) {
                             var k = null;
                             if (j.length == 1) {
                                     k = j[0];
                             }
                             var h;
                             if (j.length == 0 || k == null || k.locate == undefined) {
                                     h = "./../contents/images/map/cctv_no.gif";
                             } else {
                                     var g = k.locate;
                                     var i = d.getCctvFileName(g);
                                     h = e + i;
                             }
                            //  var f = d.getCctvHTML(b, h, c);
                            //  cctvPopup.displayPopup(true, c, f);
                     });
             };
             this.playCCTV = function() {
                     if (!confirm("해당 컨텐츠는 지속적으로 인터넷 패킷을 사용합니다. 3G 망에서 시청시 과도한 요금이 부가될 수 있습니다.동영상을 재생하시겠습니까?")) {
                             return
                     }
                     document.getElementById("mov").play();
             };
            //  this.getCctvSteamHTML = function(c, e) {
            //          var d = c.locate;
            //          var b = '<video id="mov" width="500" height="224" src="' + d + '" onclick="playCCTV()"/>';
            //          var a = '<div class="video shad cctv"><p>'
            //                          + c.cctvname
            //                          + "<span><a onclick=\"javascript:cctv.popupCctv2('"
            //                          + c.cctvid
            //                          + "',"
            //                          + e.lon
            //                          + ","
            //                          + e.lat
            //                          + ',\'stop\');" class="pdr"><img src="../../contents/images/map/btn_stop_video.gif" alt="정지영상보기" /></a><a href="javascript:cctvPopup.hidePopup(\''
            //                          + c.cctvid
            //                          + '\');"><img src="../../contents/images/map/btn_cctv_clse.gif" alt="닫기" /></a></span></p><div class="cctv_area player">'
            //                          + b + "</div></div>";
            //          return a;
            //  };
            //  this.getCctvHTML = function(c, b, d) {
            //          var a = '<div class="screenshop shad cctv" unselectable="on" style="-webkit-user-select: none;" ><p unselectable="on" style="-webkit-user-select: none;" >'
            //                          + c.cctvname
            //                          + "<span><a onclick=\"javascript:cctv.popupLiveVideo('"
            //                          + c.cctvid
            //                          + "',"
            //                          + d.lon
            //                          + ","
            //                          + d.lat
            //                          + ');" class="pdr"><img src="./../contents/images/map/btn_live_video.gif" alt="동영상보기" /></a><a onclick="javascript:cctvPopup.hidePopup(\''
            //                          + c.cctvid
            //                          + '\');"><img src="./../contents/images/map/btn_cctv_clse.gif" alt="닫기" /></a></span></p><div class="screenshot_area player"><img src="'
            //                          + b
            //                          + '" alt="" width="100%" height="100%" /></div></div>';
            //          return a;
            //  };
             this.popupCctv2 = function(b, e, d, a) {
                     var c = Mando.wgs84ToMandoMap(e, d);
                     this.popupCctv(b, new UTISMap.LonLat(c.lon, c.lat), a);
             };
             this.popupCctv = function(d, e, c) {
                     var b = this.getCctv(d);
                     var f = null;
                     if (b.type == "02") {
                             f = true;
                     }
                     if (!c && f) {
                             //var a = this.getCctvSteamHTML(b, e);
                             cctvPopup.displayPopup(true, e, a);
                     } else {
                             this.getRealtimeCctvPath(b, e);
                             return;
                     }
             };
             this.openCctvIPhone = function(a) {
                     var b = document.getElementById("mov");
                     b.src = a;
             };
        }
        var cctv = new RotaCCTV2();
        cctv.loadCCTV();
        var streamCctv = new StreamCctv('');
        /**************************************************************************************
         * 0000
         **************************************************************************************/
        function getUrlParams() {
            var params = {};
            window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
            return params;
        }
        var params = getUrlParams();
        var key = 'RDIm1i1mP1Dxx0uoxlV1JJFA3tBNSU2WxpUISZkIq9k0YT2FWjnDv887EHHDMxc';
        var domainName = "www.utic.go.kr"; // 내부 도메인 비교 변수
        //console.log(document.referrer);
        //console.log((document.referrer).indexOf(domainName) !== -1);
        if(document.referrer.indexOf(domainName) > -1 && opener){
             if(key){
                     if(opener != null && opener.key != key){
                             alert('유효한 KEY값이 아닙니다.');
                             window.opener.closePopup();
                     }
             }else{
                     alert('발급받은 Key값을 넣어주세요.');
                     location.replace('https://www.utic.go.kr:449/main/main.do');
             }
        }else{
             if(key != null){
                      $.ajax({
                             type: "POST"
                            ,url : "/guide/selectKey.do"
                            ,dataType : "json"
                            ,data : {key : key}
                                ,success : function(data) {
                                             var keyVal = eval(data);
                                             var keyValSize = keyVal.length;
                                             if(keyVal[0].CNT < 1){
                                                     alert('유효한 KEY값이 아닙니다.');
                                                     location.replace('https://www.utic.go.kr:449/main/main.do');
                                             }
                                     }
                             });
             }else{
                     alert('발급받은 Key값을 넣어주세요.');
                     location.replace('https://www.utic.go.kr:449/main/main.do');
             }
        }
        </script>
        </head>
        <body style="overflow: hidden;" scroll='no'  style="width:100%; height:100%  " >
        <div id="cctvarea">
        <!-- 국도 -->
        <!-- 세종시  -->
        <!-- 경기도교통정보센터 -->
        <!-- 서울내부순환 -->
        <!-- 전주 -->
        <!-- 2018_10 수정 (현재 전주시 영상송출 문제로 재생 불가)-->
        <!-- 광주 -->
        <!-- 대구 -->
        <!-- 대전 2017_0215 by indi -->
        <!-- 울산 -->
        <!-- 제주 -->
        <!-- 마산 창원 -->
        <!-- 천안 -->
        <!-- 2018_10 수정 -->
        <!-- 서울외곽순환 -->
        <!-- 청주 -->
        <!-- 순천 -->
        <!-- 2018_10_26 수정 -->
        <!-- -->
        <!-- 평택 -->
        <!-- 2018_10_26 수정 -->
        <!-- 2019_10_22 수정 -->
        <!-- 경주 -->
        <!-- 인천 -->
        <!-- 원주 2017_0630 by indi -->
        <!-- 부천 -->
        <!-- 2018_10_26수정 -->
        <!-- 광명 -->
        <!-- 안양 -->
        <!-- 과천 -->
        <!-- 성남  -->
        <!-- 고양 -->
        <!-- 파주  -->
        <!-- 양주 -->
        <!-- 의정부 -->
        <!-- 김포 -->
        <!-- 의왕 -->
        <!-- 군포 -->
        <!-- 남양주 -->
        <!-- 수원 -->
        <!-- 경기광주 -->
        <!-- 구리 : 2020.01.06 by INDI -->
        <!-- 하남 -->
        <!-- 부산 -->
        <!-- 양산 -->
        <!-- 2018_10_26수정  -->
        <!-- 김해 -->
        <!-- 2018_10_26수정 'http://211.236.72.94:1935/live/video.stream/playlist.m3u8-->
        <!-- 거제 -->
        <!-- 2018_10_26 수정 -->
        <!-- Seoul 2018.0910. by INDI -->
        <!-- 용인 -->
        <!-- 2018_10_26 -->
        <!-- 전라광주 -->
        <!-- 포항 -->
        <!-- 2018_10_26 수정 -->
        <!-- 구미 -->
        <!-- 충주  -->
        <!-- 국가교통정보센터(국도) -->
        <!-- 국가교통정보센터(고속도로) -->
        <!-- 안산 -->
        <!-- 군산 -->
        <!-- 목포  CCTV영상 재생로직  작성자:조병조 -->
        <!-- 아산 -->
        <!-- 경산 -->
        <!-- 여수  CCTV영상 재생로직  -->
        <script type="text/javascript">
        window.onload = cctvInit;
        window.onunload = cctvFinish;
        function cctvInit(){
             try{
                     var kind = '';
                     var cctvch = '';
                     var cctvip = '';
                     var id = '';
                     var port = streamCctv.gPort;
                     var cctvId = streamCctv.gCctvId;
                     cctvId = cctvId.substring(0,3) + cctvId.substring(cctvId.length - 3 ,cctvId.length);
                     switch(kind){
                             case 'A': //서울내부순환(CENTERID : E04)
                                     break;
                             case 'D': //서울국토(CENTERID :E06)
                                     break;
                             case 'E': //대전(CENTERID :E07)
                                     break;
                             case 'F': //전주(CENTERID : E08)
                                     if ('' < 189) {
                                             Connect("rtsp://" + cctvip + "/video" + id + "d");
                                     }
                                     if(cctvch == '1' || cctvch == '3'){
                                             Connect("rtsp://" + cctvip + "/video" + id + "d");
                                     } else{
                                             document.getElementById("cctvarea").innerHTML = streamCctv.getStreamHtml();
                                             streamCctv.cctvPlay();
                                     }
                                     break;
                             case 'G': //광주(전라도)(CENTERID : E09)
                                     break;
                             case 'H': //대구(CENTERID :E10)
                                     break;
                             case 'J': //울산(CENTERID : E12)
                                     break;
                             case 'K': //제주(CENTERID : E13)
                                     break;
                             case 'Y': //마산창원(CENTERID :E17)
                                     break;
                             case 'Z': //천안(CENTERID : L36)
                                     break;
                             case 'V': //군산
                                     break;
                             case 'Q': //대전국토(CENTERID : E19)
                                     if(cctvip.substring(0, 3) == 'dvr')
                                             initObject(cctvip, id);
                                     break;
                             case 'R': //익산국토(CENTERID :E20)
                                     break;
                             case 'S': //부산국토(CENTERID :E21)
                                     break;
                             case 'U'://서울외곽순환(CENTERID :E23)
                                     Connect("rtsp://" + cctvip + "/Ch1:D");
                                     break;
                             case 'x': //청주(CENTERID :E31)
                                     break;
                             case 'AA': //순천(CENTERID :E33)
                                     break;
                             case 'BB': //평택(CENTERID :E34)
                                     break;
                             case 'CC': //경주(CENTERID :E35)
                                     //Connect("rtsp://221.157.65.152/" + id + "/video1");
                                     break;
                             case 'M' : //원주(CENTERID : E30)
                                     break;
                             case 'N': //인천(CENTERID : L02)
                             case 'L02':
                                     //Connect("rtsp://61.40.94.7/" + id + "/video" + cctvch);
                                     break;
                             case 'O': //부천(CENTERID :L03)
                                     break;
                             case 'P': //광명(CENTERID : L04)
                                     Connect("rtsp://61.108.209.254/" + cctvId + "/video1");
                                     break;
                             case 'X': //안양(CENTERID : L05)
                                     init();
                                     break;
                             case 'a': //과천(CENTERID : L06)
                                     Connect("rtsp://61.108.209.254/" + cctvId + "/video1");
                                     break;
                             case 'b': //성남(CENTERID : L09)
                                     break;
                             case 'k': //고양(CENTERID : L10)
                                     Connect("rtsp://210.95.12.127:554/" + id);
                                     break;
                             case 'e': //파주(CENTERID :L12)
                                     break;
                             case 'f': //양주(CENTERID : L13)
                                     Connect("rtsp://61.108.209.254/"+cctvId+"/video1");
                                     break;
                             case 'g': //의정부(CENTERID : L14)
                                     Connect("rtsp://61.108.209.254/" + cctvId.substring(0, 3) + "" + cctvId.substring(3, 6) +"/video1");
                                     break;
                             case 'l': //김포(CENTERID : L15)
                                     //tvs_connect("vnms://121.143.60.52:" + cctvip + "/video1s", "admin", "1234");
                                     break;
                             case 'h': //의왕(CENTERID : L16)
                                     Connect("rtsp://218.148.33.151/" + id);
                                     break;
                             case 'i': //군포(CENTERID : L17)
                                     break;
                             case 'j': //경기광주(CENTERID :L20)
                                     Connect("rtsp://211.175.58.104/" + port + "/video3");
                                     break;
                             case 'n': //남양주(CENTERID : L18)
                                     //Connect("rtsp://" + cctvip + "/" + port + "/video1");
                                     break;
                             case 'C': //수원(CENTERID :L19)
                                     break;
                             //case 'j': //경기광주(CENTERID : L20)
                             //      break;
                             case 'o': //구리(CENTERID : L21)
                                     Connect("rtsp://210.100.174.233/" + port + "/video1");
                                     break;
                             case 'q': //하남(CENTERID :L22)
                                     break;
                             case 'I': //부산(CENTERID : L23)
                                     break;
                             case 's': //양산(CENTERID :L24)
                                     break;
                             case 'r': //김해(CENTERID :L26)
                                     break;
                             case 't': //거제(CENTERID :L28)
                                     break;
                             case 'd': //용인(CENTERID : L08) 2017.01.11 by INDI
                                     Connect("rtsp://211.249.12.147:1935/live/video"+cctvch+".stream");
                                     break;
                             case 'v': //전라광주(CENTERID :L31)
                                     break;
                             case 'w': //포항(CENTERID :L37)
                                     break;
                             case 'Seoul' : //서울(CENTERID : L01)
                                     break;
                             case 'DD': //구미(CENTERID :L41)
                                     break;
                             case 'EE' : //경기도교통정보센터
                                     break;
                             case 'FF' : //충주
                                     break;
                             case 'ZZ' : //국도
                                     break;
                             case 'Z1' : //세종특별자치시
                                     break;
                             case 'Z2' : // <!-- 국가교통정보센터(국도 - E90)  -->
                                     break;
                             case 'Z3' : // <!-- 국가교통정보센터(고속도로 - E91)  -->
                                     break;
        
                             case 'Z9' : // <!-- 아산교통정보센터(E43)  -->
                                     break;
                             case 'T' : // <!-- 안산시 교통정보센터  -->
                                     break;
                             case 'V' : // <!-- 군산시 교통정보센터  -->
                                     break;
                             case 'MP' : // <!-- 목포시 교통정보센터 -->
                                     break;
        
                             case 'GG' : // <!-- 경산시 교통정보센터 -->
                                     break;
                             case 'y' :
                                     break; // <!-- 여수시 교통정보센터 -->
                             default:
                             {
                                     document.getElementById("cctvarea").innerHTML = streamCctv.getStreamHtml();
                                     streamCctv.cctvPlay();
                                     break;
                             }
                     }
                     setTimeout(function(){location.reload();},1000 * 60);
             }
             catch(e) {setTimeout(function(){location.reload();},1000 * 60);}
        }
        function cctvFinish(){
             try{
                     var kind = '';
                     if(kind == 'J'){
                             var CCTVVIEW = document.getElementById("CCTVVIEW");
                             CCTVVIEW.Disconnect();
                     } else if(kind == 'I'){
                             if(!''){
                                     if (lChID == 0){
                                             return;
                                     }
                                 document.Tvs.Pause(lChID);
                                 document.Tvs.SetMute(lChID, 1);
                                 document.Tvs.Disconnect(lChID);
                                 lChID = 0;
                             }
                     } else if(kind == 'k'){
                             var player = document.getElementById("IP_CAM");
                             player.DisconnectSrv();
                     }
             } catch(e) {}
        }
        function goyangConn(){
             var player = document.getElementById("IP_CAM");
             player.DisconnectSrv();
             player.ConnectSrv('root', 'vas7264', '210.95.12.', 0, 0, 1, 0, 0);
        }
        console.log(window);
        </script>
        <iframe id="logifrm" src="" style="display: none; width:100%; height:0px; padding:0; margin:0;" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>
        </body>
        </html>`;
    }
}