const cookie = require('cookie');
const access = require('./DB/access')
module.exports = {
  getLiveData : function (request, response, title) {    
    const tMapAPIKEY = "l7xxc243b4151b1245f6a9792ca962a8398c";
    let arriveData = access.query(request, response, 
        `select * from Alert.user_location WHERE user_id = '${request.session.userid}' AND nickname = '${request.arriveAdress}'`)[0];
    let departrueData = access.query(request, response, 
        `select * from Alert.user_location WHERE user_id = '${request.session.userid}' AND nickname = '${request.departrueAdress}'`)[0];

        const startX  = departrueData.xpos;
        const startY = departrueData.ypos;
        const endX = arriveData.xpos;
        const endY = arriveData.ypos;
    
    return `<!DOCTYPE html>
            <html>
                <head>
                    <title>${title}</title>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                    <script	src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
                    <script src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=${tMapAPIKEY}"></script>
                </head>
                <body onload="initTmap();">
                    <div id="map_wrap" class="map_wrap">
                        <div id="map_div"></div>
                    </div>
                    <div class="map_act_btn_wrap clear_box"></div>
                    <br />
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

                    
                
                        // 3. 경로탐색 API 사용요청                                                                                                   
                                            var searchOption = $("#selectLevel").val();
                
                                            var trafficInfochk = "Y"; //교통 정보 표시                                            
                                            let cctvArr = [];
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
                                                            let tTime = resultData[0].properties.totalTime    
                                                            document.cookie = "totalTime=" + tTime;            //소요 시간 cookie에 임시 저장(초단위)                                                                                                                                            

                                                            //localStorage.setItem('totalTime', resultData[0].properties.totalTime);   //소요 시간 로컬스토리지에 임시 저장(초단위)
                                                            //localStorage.setItem('totalDistance', resultData[0].properties.totalDistance);   //총 거리 로컬스토리지에 임시 저장(m단위)
                                                            //localStorage.setItem('totalFare', resultData[0].properties.totalFare);   //총 요금 로컬스토리지에 임시 저장(won단위)                                                                                                                  
                                                            
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
                
                                                                        const arrr = drawLine(sectionInfos, trafficArr);
                                                                        if (arrr.length != 0) {
                                                                            cctvArr = cctvArr.concat(arrr);                                                                            
                                                                        }                                                                                                                                                

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
                                            if (cctvArr.length == 0) {
                                                console.log("정체구간 없음");
                                            } else {
                                                let cctvData = [];
                                                let lat = 0;
                                                let lng = 0;
                                                let objj = {};
                                                for (let i=0; i<cctvArr.length; i++) {
                                                    lat = cctvArr[i]._lat;
                                                    lng = cctvArr[i]._lng;
                                                    objj = {
                                                        lat: lat,
                                                        lng: lng
                                                    }                                                
                                                    cctvData.push(objj);
                                                }                                                                                            
                                                document.cookie = "cctvList=" + JSON.stringify(cctvData); //cctv객체 배열 쿠키에 저장
                                                
                                            }                                            
                    }
            
                
                    //라인그리기
                    function drawLine(arrPoint, traffic) {
                        var polyline_;
                        let drawLineCctvArr = [];
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
                                        let cctvDataList = []; //정체구간 cctv 리스트 arr
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
                                                if (trafficIndexTem == 4) {                                                    
                                                    cctvDataList.push(arrPoint[tInfo[x].startIndex]);                                                    
                                                    trafficIndexTem = tInfo[x].trafficIndex;
                                                }
                                            } else if (tInfo[x].trafficIndex == 1) {
                                                lineColor = "#61AB25";
                                                if (trafficIndexTem == 4) {
                                                    cctvDataList.push(arrPoint[tInfo[x].startIndex]);                                                    
                                                    trafficIndexTem = tInfo[x].trafficIndex;
                                                }
                                            } else if (tInfo[x].trafficIndex == 2) {
                                                lineColor = "#FFFF00";
                                                if (trafficIndexTem == 4) {
                                                    cctvDataList.push(arrPoint[tInfo[x].startIndex]);                                                    
                                                    trafficIndexTem = tInfo[x].trafficIndex;
                                                }
                                            } else if (tInfo[x].trafficIndex == 3) {
                                                lineColor = "#E87506";
                                                if (trafficIndexTem == 4) {
                                                    cctvDataList.push(arrPoint[tInfo[x].startIndex]);                                                    
                                                    trafficIndexTem = tInfo[x].trafficIndex;
                                                }
                                            } else if (tInfo[x].trafficIndex == 4) {
                                                lineColor = "#D61125";
                                                if (trafficIndexTem != 4) {  
                                                    cctvDataList.push(arrPoint[tInfo[x].startIndex]);                                                                                                      
                                                    trafficIndexTem = tInfo[x].trafficIndex;                                                                    
                                                }       
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
                                        if (cctvDataList.length != 0) {                                    
                                            drawLineCctvArr.push(cctvDataList);
                                        }                                                            
                                    } else { //0부터 시작하는 경우
                                        let cctvDataList = []; //정체구간 cctv 리스트 arr
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
                                                if (trafficIndexTem == 4) {
                                                    cctvDataList.push(arrPoint[tInfo[x].startIndex]);                                                    
                                                    trafficIndexTem = tInfo[x].trafficIndex;
                                                }
                                            } else if (tInfo[x].trafficIndex == 1) {
                                                lineColor = "#61AB25";
                                                if (trafficIndexTem == 4) {
                                                    cctvDataList.push(arrPoint[tInfo[x].startIndex]);                                                    
                                                    trafficIndexTem = tInfo[x].trafficIndex;
                                                }
                                            } else if (tInfo[x].trafficIndex == 2) {
                                                lineColor = "#FFFF00";
                                                if (trafficIndexTem == 4) {
                                                    cctvDataList.push(arrPoint[tInfo[x].startIndex]);                                                    
                                                    trafficIndexTem = tInfo[x].trafficIndex;
                                                }
                                            } else if (tInfo[x].trafficIndex == 3) {
                                                lineColor = "#E87506";
                                                if (trafficIndexTem == 4) {
                                                    cctvDataList.push(arrPoint[tInfo[x].startIndex]);                                                    
                                                    trafficIndexTem = tInfo[x].trafficIndex;                                                    
                                                }
                                            } else if (tInfo[x].trafficIndex == 4) {
                                                lineColor = "#D61125";
                                                if (trafficIndexTem != 4) {  
                                                    cctvDataList.push(arrPoint[tInfo[x].startIndex]);                                             
                                                    trafficIndexTem = tInfo[x].trafficIndex;                                                                    
                                                }                                                
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
                                        if (cctvDataList.length != 0) {                                            
                                            drawLineCctvArr.push(cctvDataList);
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
                        let rtrnCctvArr = [];
                        if (drawLineCctvArr.length != 0) {                                                       
                            for (let i=0; i<drawLineCctvArr[0].length; i++) {
                                rtrnCctvArr.push(drawLineCctvArr[0][i]);
                            }                            
                        }                        
                        return rtrnCctvArr;
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
