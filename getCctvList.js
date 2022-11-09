const xlsx = require("xlsx");

module.exports = {
  getCctvArrFunc: function (centerX, centerY) {
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
    const getCctvArr = function (centerX, centerY) {
      //return type -> arr
      //중심 좌표를 기준으로 반경 500m 범위 내 cctv 목록 계산
      const k = 0.0050445;
      const minX = centerX - k;
      const maxX = centerX + k;
      const minY = centerY - k;
      const maxY = centerY + k;
      let targetCctvArr = [];

      for (let i = 0; i < cctvDataClone.length; i++) {
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
    const arr = getCctvArr(centerX, centerY);
    return arr;
  },
};
