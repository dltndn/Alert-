//[{"lat":37.45525326987871,"lng":126.7971490103368},{"lat":37.45682526188185,"lng":126.79447143261505},{"lat":37.48557942585608,"lng":126.74785821174484},{"lat":37.543080827902216,"lng":126.73413007896661},{"lat":37.54334458503499,"lng":126.72843336927583}]
//as
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

                // iframe을 넣은 element를 안보이게 한다.
                // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
                element_wrap.style.display = 'none';

                // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
                document.body.scrollTop = currentScroll;
                geocoder.addressSearch(data.address, function(results, status) {
                    // 정상적으로 검색이 완료됐으면
                    if (status === daum.maps.services.Status.OK) {

                        var result = results[0]; //첫번째 결과의 값을 활용
                        
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
    }`;
    return `
    <link rel="stylesheet" type="text/css" href="./userLoc.css">
    <div class="userLoc">
    <input type="text" id="sample3_address" placeholder="주소">
    <input type="button" onclick="sample3_execDaumPostcode()" value="우편번호 찾기"><br>
    
    <div id="wrap" style="display:none;border:1px solid;width:500px;height:300px;margin:5px 0;position:relative">
    <img src="//t1.daumcdn.net/postcode/resource/images/close.png" id="btnFoldWrap" style="cursor:pointer;position:absolute;right:0px;top:-1px;z-index:1" onclick="foldDaumPostcode()" alt="접기 버튼">
    </div>
    
          <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
          <script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${APIkey}&libraries=services"></script>
          <script>${getAdressScript}</script>
      <form action="create_userloc_process" method="post">
        
        <input type="hidden" id="adresss" name="adress" >
        <input type="hidden" id="xpos" name="xpos" >
        <input type="hidden" id="ypos" name="ypos" >
        <p>지역 별명 : <input type="text" name="location_nickname" ></p> 
        <p><input type="submit" value="확인"></p>
      </form>
      <img src="//t1.daumcdn.net/postcode/resource/images/close.png" id="btnFoldWrap" style="cursor:pointer;position:absolute;right:0px;top:-1px;z-index:1" onclick="foldDaumPostcode()" alt="접기 버튼">
    </div>
    `;
  }