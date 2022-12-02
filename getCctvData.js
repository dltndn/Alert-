const axios = require("axios");
exports.getCctvSrc = async (cctvUrl) => {
    let srcList = [];
    await axios({
        url: cctvUrl,
        method:'get',
      }).then(function(res) {
        let info = res.data.response.data; //cctvList
        if (info !== undefined) {
            for (let i=0; info.length>i; i++) {
                let cctvData = {
                    name : info[i].cctvname,
                    src : info[i].cctvurl,
                    coordx : info[i].coordx,
                    coordy : info[i].coordy
                }
                srcList.push(cctvData);
            }
        } else {
            console.log("cctv is nothing");
        }
      });
    return srcList;
};

exports.getCctvUrl = (apiKey, centerX, centerY) => { //중심좌표 근방 cctv url 리턴

  //중심 좌표를 기준으로 반경 500m 범위 내 cctv 목록 계산
//   const k = 0.0050445;
   const k = 0.0100445;
  const minX = centerX - k;
  const maxX = centerX + k;
  const minY = centerY - k;
  const maxY = centerY + k;
  const url = `https://openapi.its.go.kr:9443/cctvInfo?apiKey=${apiKey}&type=ex&cctvType=1&minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}&getType=json`;
  return url;
};

exports.addCctvMarkers = (cctvDataList) => {
    let script;
    if (cctvDataList == undefined) {
        return ``;
    }
    for (let i=0; i<cctvDataList.length; i++) {
        let s = addMarkers(cctvDataList[i].coordx, cctvDataList[i].coordy);
        script += s;
    }
    return script;
}

const addMarkers = (coordx, coordy) => {
    const cctvIcon = "https://cdn-icons-png.flaticon.com/512/4601/4601587.png";
    if (coordx == undefined) {
        return ;
    }
    return`
    infoObj = {
        markerImage : "${cctvIcon}",
        lng : ${coordx},  //127.xxx
        lat : ${coordy},  //37.xxx
        pointType : ""
    };
    // 마커 추가
    addMarkers(infoObj);
    `;
}

exports.cctvVideoScript = (src) => {
    if (src ==undefined) {
        return ``;
    } else {
  return `
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
`;
    }
};

exports.newTabLauncher = (request) => {
    let cctvDataList = request.session.cctvDataList; //{name, src, coordx, coordy}
    let divTag ="";
    if (cctvDataList == undefined) {  //정체 구간 없을 시 테스트용
        cctvDataList = [];
        let a = {
            name : "[수도권제1순환선] 성남",
            src : "http://cctvsec.ktict.co.kr/2/zdu3vCWMqm8BOoAocdd4FEt4ZG93hWE8Nybgbe5qFEmGtymzqbkEiw3HXGaXgIbGWtUOHSErYTddpGAU31Gtog==",
            coordx : 127.12361,
            coordy : 37.42889
        };
        let b = {
            name : "[수도권제1순환선] 송파",
            src : "http://cctvsec.ktict.co.kr/4/HAUIKUqV9pGO2its+ETwaTPtNnbE19Tj+PF7JJB5C4FEFDP9P3Tb4JBSW3qc7WHV2oXSICWKQoA+BITA4W35UA==",
            coordx : 127.12944,
            coordy : 37.475
        };
        let c = {
            name : "[수도권제1순환선] 하남분기점",
            src : "http://cctvsec.ktict.co.kr/8/m3hu1EnLHpqRRbY5OsUvXdiGh+EBUU0Lfzr32k33ORhxo4m9vzT1Dyhv8JatjJd1tDNLY3hoIAa6Nh0NTKpABQ==",
            coordx : 127.19361,
            coordy : 37.5325
        };
        let d = {
            name : "[수도권제1순환선] 남양주",
            src : "http://cctvsec.ktict.co.kr/12/3qY9KkqtXlmcqSUUMA0LNwObni0xgPcG4gq5sLbNb2FpdiwnvQ0AcomSs81OU72669Jf36WPAudVNOljxJlDS/1oZG9cO5iNwhDbu9KqCzY=",
            coordx : 127.1536111,
            coordy : 37.60222222
        };
        cctvDataList.push(a);
        cctvDataList.push(b);
        cctvDataList.push(c);
        cctvDataList.push(d);
    }
    for (let i=0; i<cctvDataList.length; i++) {
        divTag += addSrcImg(i, cctvDataList[i].name);
    }
    return `
    ${divTag}
    <script>
        const goCctvTab = (i) => {
            document.cookie = "cctvArrIndex=" + (i).toString();
            const new_window_width = 300;
            const new_window_height = 270;
            const positionX = ( window.screen.width / 2 ) - ( new_window_width / 2 );
            const positionY = ( window.screen.height / 2 ) - ( new_window_height / 2 );
            window.open(
                "http://localhost:3000/cctvTab",
                "cctv",
                "width=" + new_window_width + ", height=" + new_window_height + ", top=" + positionY + ", left=" + positionX,                               
              );
        }
    </script>
    `;
};

const addSrcImg = (i, name) => {
    const cctvImg = "https://cdn-icons-png.flaticon.com/512/4601/4601587.png";
    return `
    <div onclick="goCctvTab(${i})" class="cctvImgTag">
        <img src="${cctvImg}" class="cctvIconImg">
        ${name}
    </div>
    `;
};