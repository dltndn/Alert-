
const getTemplate = require("./template.js");
const xlsx = require("xlsx");
const cookie = require('cookie');
const access = require('./DB/access');


// cctv 엑셀 파일 json 데이터로 추출
const cctvFile = xlsx.readFile("./OpenDataCCTV.xlsx");
const sheetName = cctvFile.SheetNames[0];
const firstSheet = cctvFile.Sheets[sheetName];
const cctvData = xlsx.utils.sheet_to_json(firstSheet);
const cctvDataClone = []; //x, y좌표 타입이 num으로 변경된 딕셔너리
let obj;
for (let i = 0; i < cctvData.length; i++) {
  // cctv 엑셀 파일 json 데이터 x, y좌표 타입 num으로 변경
  let x = cctvData[i].XCOORD;
  let y = cctvData[i].YCOORD;
  x = parseFloat(x);
  y = parseFloat(y);
  obj = {
    CCTVID: cctvData[i].CCTVID,
    XCOORD: x,
    YCOORD: y,
  };
  cctvDataClone.push(obj);
}


const getCctvList = function (centerX, centerY) {  //return type -> arr
  //중심 좌표를 기준으로 반경 500m 범위 내 cctv 목록 계산
  const k = 0.0050445;
  const minX = centerX - k;
  const maxX = centerX + k;
  const minY = centerY - k;
  const maxY = centerY + k;
  let targetCctvArr = [];
  for (let i=0; i<cctvDataClone.length; i++) {
    let x = cctvDataClone[i].XCOORD;
    let y = cctvDataClone[i].YCOORD;
    if (x > minX && x < maxX) {
        if (y > minY && y < maxY) {
            targetCctvArr.push(cctvDataClone[i]);
        }
    }
  }
   
  return targetCctvArr;
};

module.exports = {
  livePage: function (request,response, title, header, cssFile) {
    let arriveData = access.query(request, response, 
        `select * from Alert.user_location WHERE user_id = '${request.session.userid}' AND nickname = '${request.arriveAdress}'`)[0];
    let departrueData = access.query(request, response, 
        `select * from Alert.user_location WHERE user_id = '${request.session.userid}' AND nickname = '${request.departrueAdress}'`)[0];

    // let departrueXPos = departrueData.xpos;
    // let departrueYPos = departrueData.ypos;
    // let arriveXPos = arriveData.xpos;
    // let arriveYPos = arriveData.ypos;
    const departrueXPos  = 126.787101543581;
    const departrueYPos = 37.4528612784565; //test: 집
    const arriveXPos = 127.107967944506;
    const arriveYPos = 37.5457267681008;  //test: 예스24라이브홀

    let cctvList = [];     //정체구간 근방 cctv 데이터
    const cookies = cookie.parse(request.headers.cookie);
    if (request.headers.cookie !== undefined){
        const jamSectionList = JSON.parse(cookies.cctvList);
        for (let i=0; i<jamSectionList.length; i++) {
            const lat = jamSectionList[i].lat;
            const lng = jamSectionList[i].lng;
            const arr = getCctvList(lng, lat);           
            if (arr.length > 1) {
                cctvList.concat(arr);               
            }else if (arr.length == 1) {
                cctvList.push(arr);               
            }else {
                
            }
        }
    }
    for(let i=0; i<cctvList.length; i++) { //정체구간 근방 cctv 데이터 출력 방식
        console.log(cctvList[i][0].CCTVID);
    }

    let tTimeData = JSON.parse(cookies.totalTime);
    let tTime = tTimeData / 60; 
    tTime = Math.round(tTime);
    tTime = tTime / 60;
    let hour = 0;
    let min = 0;
    let estimated_time;
    min = tTime % 1;
    min = Math.round(min * 100);
    min = min * 60 / 100;
    min = Math.round(min); //최종 분

    
    //let departureTime = request.departTime;
    let departureTime = "8:00";
    let departureHour;
    let departureMin ;
    for (let col = 0; col < departureTime.length ;col++) {
        if (departureTime.substring(col,col+1) === ":") {
            departureHour = parseInt(departureTime.substring(0,col)); 
            departureMin = parseInt(departureTime.substring(col+1,parseInt(departureTime.length + 1)))
            departureMin += min;
            departureHour += hour;
            break;
        }
    }
    if (departureMin >= 60){
        departrueMin %= 60;
        departureHour++;
        if (departureHour >= 24) {
            departureHour%=24
        }
    }else {
        if (departureHour >= 24) {
            departureHour%=24
        }
    }
    let expectTime = departureHour + ":" + departureMin
    if (tTime < 1) {
        hour = 0;
        estimated_time = min + "분"; //소요시간 string
    } else {
        hour = Math.round(tTime);  //최종 시
        estimated_time = hour + "시간 " + min + "분"; //소요시간 string
    }
    const openAPIkey =
      "EOjOA8lO2JOXmhT2dR7nyMXybjrrOxMihUgHegeYa2AtkL2lPr2mDUdx27Qa3Msw"; //openData

    const cctvId = "E350030";
    const kind = "CC";
    const cctvCh = "20";
    const id = "null";

    const cctvUrl = `http://www.utic.go.kr/view/map/openDataCctvStream.jsp?key=${openAPIkey}&cctvid=${cctvId}&kind=${kind}&cctvch=${cctvCh}&id=${id}`;
    //const cctvUrl = `http://www.utic.go.kr/view/map/openDataCctvStream.jsp?key=RDIm1i1mP1Dxx0uoxlV1JJFA3tBNSU2WxpUISZkIq9k0YT2FWjnDv887EHHDMxc`;
    const tMapAPIKEY = "l7xx16b2283d260c4bbabae01b727e1a8b75";
    const startX = departrueXPos; //출발지 x좌표
    const startY = departrueYPos; //출발지 y좌표
    const endX = arriveXPos; //도착지 x좌표
    const endY = arriveYPos; //도착지 y좌표
    return `<!DOCTYPE html>
            <html>
                <head>
                    <title>${title}</title>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                    <script	src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
                    <script src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=${tMapAPIKEY}"></script>
                </head>
                <body onload="initTmap();">
                    ${header}
                    ${getTemplate.liveForm(estimated_time,departureTime,expectTime )}
                   
                    <div id="map_wrap" class="map_wrap">
                        <div id="map_div"></div>
                    </div>
                    <div class="map_act_btn_wrap clear_box"></div>
                    <br />
                    <embed src=${cctvUrl} class="cctv">                   
                    <script type="text/javascript"> 
                    var map;
                    var markerInfo;
                    //출발지,도착지 마커
                    var marker_s, marker_e, marker_p;
                    //경로그림정보
                    var drawInfoArr = [];
                    var drawInfoArr2 = [];
                
                    var chktraffic = [];
                    var resultdrawArr = [];
                    var resultMarkerArr = [];
                
                    function initTmap() {        

                        // 1. 지도 띄우기
                        map = new Tmapv2.Map("map_div", {
                            center : new Tmapv2.LatLng(${startY},
                                ${startX}),
                            width : "100%",
                            height : "400px",
                            zoom : 11,
                            zoomControl : true,
                            scrollwheel : true
                        });
                
                        // 2. 시작, 도착 심볼찍기
                        // 시작
                        marker_s = new Tmapv2.Marker(
                                {
                                    position : new Tmapv2.LatLng(${startY},
                                        ${startX}),
                                    icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
                                    iconSize : new Tmapv2.Size(24, 38),
                                    map : map
                                });
                
                        //도착
                        marker_e = new Tmapv2.Marker(
                                {
                                    position : new Tmapv2.LatLng(${endY},
                                        ${endX}),
                                    icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
                                    iconSize : new Tmapv2.Size(24, 38),
                                    map : map
                                });
                
                        // 3. 경로탐색 API 사용요청                                        
                                            //기존 맵에 있던 정보들 초기화
                                            resettingMap();
                
                                            var searchOption = $("#selectLevel").val();
                
                                            var trafficInfochk = "Y"; //교통 정보 표시
                
                                            //JSON TYPE EDIT [S]
                                            $
                                                    .ajax({
                                                        type : "POST",
                                                        url : "https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result",
                                                        async : false,
                                                        data : {
                                                            "appKey" : "${tMapAPIKEY}",
                                                            "startX" : "${startX}",
                                                            "startY" : "${startY}",
                                                            "endX" : "${endX}",
                                                            "endY" : "${endY}",
                                                            "reqCoordType" : "WGS84GEO",
                                                            "resCoordType" : "EPSG3857",
                                                            "searchOption" : searchOption,
                                                            "trafficInfo" : trafficInfochk
                                                        },
                                                        success : function(response) {
                
                                                            var resultData = response.features;                                      
                                                                for ( var i in resultData) { //for문 [S]
                                                                    var geometry = resultData[i].geometry;
                                                                    var properties = resultData[i].properties;                                                                    
                                                                    
                                                                    
                                                                    if (geometry.type == "LineString") {
                                                                        //교통 정보도 담음
                                                                        chktraffic
                                                                                .push(geometry.traffic);
                                                                        var sectionInfos = [];
                                                                        var trafficArr = geometry.traffic;
                                                                        
                
                                                                        for ( var j in geometry.coordinates) {
                                                                            // 경로들의 결과값들을 포인트 객체로 변환 
                                                                            var latlng = new Tmapv2.Point(
                                                                                    geometry.coordinates[j][0],
                                                                                    geometry.coordinates[j][1]);
                                                                            // 포인트 객체를 받아 좌표값으로 변환
                                                                            var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                                                                                    latlng);
                                                                                    
                                                                            sectionInfos
                                                                                    .push(convertPoint);
                                                                                   
                                                                        }
                
                                                                        drawLine(sectionInfos,
                                                                                trafficArr);
                                                                    } else {
                
                                                                        var markerImg = "";
                                                                        var pType = "";
                
                                                                        if (properties.pointType == "S") { //출발지 마커
                                                                            markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
                                                                            pType = "S";
                                                                        } else if (properties.pointType == "E") { //도착지 마커
                                                                            markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
                                                                            pType = "E";
                                                                        } else { //각 포인트 마커
                                                                            markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
                                                                            pType = "P"
                                                                        }
                
                                                                        // 경로들의 결과값들을 포인트 객체로 변환 
                                                                        var latlon = new Tmapv2.Point(
                                                                                geometry.coordinates[0],
                                                                                geometry.coordinates[1]);
                                                                        // 포인트 객체를 받아 좌표값으로 다시 변환
                                                                        var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                                                                                latlon);
                
                                                                        var routeInfoObj = {
                                                                            markerImage : markerImg,
                                                                            lng : convertPoint._lng,
                                                                            lat : convertPoint._lat,
                                                                            pointType : pType
                                                                        };
                                                                        // 마커 추가
                                                                        addMarkers(routeInfoObj);
                                                                    }
                                                                }//for문 [E]
                                                                        
                                                        },
                                                        error : function(request, status, error) {
                                                            console.log("code:"
                                                                    + request.status +
                                                                    + "message:"
                                                                    + request.responseText
                                                                    + "error:" + error);
                                                        }
                                                    });
                                            //JSON TYPE EDIT [E]
                                        
                    }
                
                    function addComma(num) {
                        var regexp = /\B(?=(\d{3})+(?!\d))/g;
                        return num.toString().replace(regexp, ',');
                    }
                
                    //마커 생성하기
                    function addMarkers(infoObj) {
                        var size = new Tmapv2.Size(24, 38);//아이콘 크기 설정합니다.
                
                        if (infoObj.pointType == "P") { //포인트점일때는 아이콘 크기를 줄입니다.
                            size = new Tmapv2.Size(8, 8);
                        }
                
                        marker_p = new Tmapv2.Marker({
                            position : new Tmapv2.LatLng(infoObj.lat, infoObj.lng),
                            icon : infoObj.markerImage,
                            iconSize : size,
                            map : map
                        });
                
                        resultMarkerArr.push(marker_p);
                    }
                
                    //라인그리기
                    function drawLine(arrPoint, traffic) {
                        var polyline_;
                        
                        if (chktraffic.length != 0) {
                
                            // 교통정보 혼잡도를 체크
                            // strokeColor는 교통 정보상황에 다라서 변화
                            // traffic :  0-정보없음, 1-원활, 2-서행, 3-지체, 4-정체  (black, green, yellow, orange, red)
                            
                            var lineColor = "";
                            
                            if (traffic != "0") {
                                if (traffic.length == 0) { //length가 0인것은 교통정보가 없으므로 검은색으로 표시
                
                                    lineColor = "#06050D";
                                    //라인그리기[S]
                                    polyline_ = new Tmapv2.Polyline({
                                        path : arrPoint,
                                        strokeColor : lineColor,
                                        strokeWeight : 6,
                                        map : map
                                    });
                                    resultdrawArr.push(polyline_);
                                    //라인그리기[E]
                                } else { //교통정보가 있음
                
                                    if (traffic[0][0] != 0) { //교통정보 시작인덱스가 0이 아닌경우
                                        var trafficObject = "";
                                        var tInfo = [];
                                        
                                        for (var z = 0; z < traffic.length; z++) {
                                            trafficObject = {
                                                "startIndex" : traffic[z][0],
                                                "endIndex" : traffic[z][1],
                                                "trafficIndex" : traffic[z][2],
                                            };                                
                                            tInfo.push(trafficObject)
                                        }
                
                                        var noInfomationPoint = [];
                
                                        for (var p = 0; p < tInfo[0].startIndex; p++) {
                                            noInfomationPoint.push(arrPoint[p]);
                                        }
                
                                        //라인그리기[S]
                                        polyline_ = new Tmapv2.Polyline({
                                            path : noInfomationPoint,
                                            strokeColor : "#06050D",
                                            strokeWeight : 6,
                                            map : map
                                        });
                                        
                                        //라인그리기[E]
                                        resultdrawArr.push(polyline_);
                                        let trafficIndexTem = tInfo[0].trafficIndex;  //출발지 혼잡도 값
                                        for (var x = 0; x < tInfo.length; x++) {
                                            var sectionPoint = []; //구간선언
                
                                            for (var y = tInfo[x].startIndex; y <= tInfo[x].endIndex; y++) {
                                                sectionPoint.push(arrPoint[y]);
                                            }
                                            
                                            if (tInfo[x].trafficIndex == 0) {
                                                lineColor = "#06050D";                                            
                                            } else if (tInfo[x].trafficIndex == 1) {
                                                lineColor = "#61AB25";                                                
                                            } else if (tInfo[x].trafficIndex == 2) {
                                                lineColor = "#FFFF00";                                               
                                            } else if (tInfo[x].trafficIndex == 3) {
                                                lineColor = "#E87506";                                               
                                            } else if (tInfo[x].trafficIndex == 4) {
                                                lineColor = "#D61125";                                                   
                                            }
                                            
                
                                            //라인그리기[S]
                                            polyline_ = new Tmapv2.Polyline({
                                                path : sectionPoint,
                                                strokeColor : lineColor,
                                                strokeWeight : 6,
                                                map : map
                                            });
                                            
                                            //라인그리기[E]
                                            resultdrawArr.push(polyline_);
                                        }
                                    } else { //0부터 시작하는 경우
                
                                        var trafficObject = "";
                                        var tInfo = [];                                        
                                        for (var z = 0; z < traffic.length; z++) {
                                            trafficObject = {
                                                "startIndex" : traffic[z][0],
                                                "endIndex" : traffic[z][1],
                                                "trafficIndex" : traffic[z][2],
                                            };                                                 
                                            
                                            tInfo.push(trafficObject);
                                        }
                                        let trafficIndexTem = tInfo[0].trafficIndex;  //출발지 혼잡도 값
                                        for (var x = 0; x < tInfo.length; x++) {
                                            var sectionPoint = []; //구간선언
                
                                            for (var y = tInfo[x].startIndex; y <= tInfo[x].endIndex; y++) {
                                                sectionPoint.push(arrPoint[y]);
                                            }
                                             
                                            if (tInfo[x].trafficIndex == 0) {
                                                lineColor = "#06050D";                                               
                                            } else if (tInfo[x].trafficIndex == 1) {
                                                lineColor = "#61AB25";                                           
                                            } else if (tInfo[x].trafficIndex == 2) {
                                                lineColor = "#FFFF00";                                              
                                            } else if (tInfo[x].trafficIndex == 3) {
                                                lineColor = "#E87506";
                                            } else if (tInfo[x].trafficIndex == 4) {
                                                lineColor = "#D61125";                                                                                              
                                            }
                
                                            //라인그리기[S]
                                            polyline_ = new Tmapv2.Polyline({
                                                path : sectionPoint,
                                                strokeColor : lineColor,
                                                strokeWeight : 6,
                                                map : map
                                            });
                                            
                                            //라인그리기[E]
                                            resultdrawArr.push(polyline_);
                                        }
                                    }
                                }
                            } else {
                
                            }
                        } else {
                            polyline_ = new Tmapv2.Polyline({
                                path : arrPoint,
                                strokeColor : "#DD0000",
                                strokeWeight : 6,
                                map : map
                            });
                            
                            resultdrawArr.push(polyline_);
                        }
                
                    }
                
                    //초기화 기능
                    function resettingMap() {
                        //기존마커는 삭제
                        marker_s.setMap(null);
                        marker_e.setMap(null);
                
                        if (resultMarkerArr.length > 0) {
                            for (var i = 0; i < resultMarkerArr.length; i++) {
                                resultMarkerArr[i].setMap(null);
                            }
                        }
                
                        if (resultdrawArr.length > 0) {
                            for (var i = 0; i < resultdrawArr.length; i++) {
                                resultdrawArr[i].setMap(null);
                            }
                        }
                
                        chktraffic = [];
                        drawInfoArr = [];
                        resultMarkerArr = [];
                        resultdrawArr = [];
                    }
                </script>
                </body>
            </html>
            `;
  },
};
