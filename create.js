module.exports =  {
    alarm: (userLoc) => {
        let userNickList = []
        for (let i = 0; i < userLoc.length;i++) {
            userNickList.push(userLoc[i].nickname)
        }
        let nickOptions = ``;
        for (let i = 0; i < userNickList.length;i++) {
            nickOptions += `<option value="${userNickList[i]}">${userNickList[i]}</option>`
        }
        return `
        <link rel="stylesheet" type="text/css" href="./createAlarm.css">
        <div id="background" >        
            <div class="container">
                <form class="createAlarmForm" action="/create_alarm_process" method="post">
                    <input class="button" type="button" value="사용자 정의 위치 생성" onClick="location.href='/create_userloc'">
                    
                    <div>
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="0" id="일">
                    <label class="checkboxLabel" for="일">일</label>
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="1" id="월">
                    <label class="checkboxLabel" for="월">월</label>
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="2" id="화">
                    <label class="checkboxLabel" for="화">화</label>
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="3" id="수">
                    <label class="checkboxLabel" for="수">수</label>            
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="4" id="목">
                    <label class="checkboxLabel" for="목">목</label>
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="5" id="금">
                    <label class="checkboxLabel" for="금">금</label>
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="6" id="토">    
                    <label class="checkboxLabel" for="토">토</label>
                    </div>
                    
                    <div class="select_options">
                    <select class="select" name="출발지">${nickOptions}</select>
                    
                    =>  
                    <select class="select" name="도착지"> ${nickOptions} </select>
                    </div>
                
                    <div class="alram time">
                    알람시간
                    
                        <input type="number" name="alarm_time_hour" min="0" max="23" value="0"> : <input type="number" name="alarm_time_min" min="0" max="59" value="0">
                    
                    </div>

                    <div class="departure time">

                    출발시간
                    
                        <input type="number" name="depart_time_hour" min="0" max="23" value="0"> : <input type="number" name="depart_time_min" min="0" max="59" value="0">
                    </div>
                
                    <input class="button"  type="submit" value="확인">
                    <input class="button cancel"  type="button" value="취소" onClick="location.href='/alarm'">
                </form>
                </div>
                </div>`;
      },

      editAlarm: (userLoc, alarm_id) => {
        
        
        let userNickList = []
        for (let i = 0; i < userLoc.length;i++) {
            userNickList.push(userLoc[i].nickname)
        }
        let nickOptions = ``;
        for (let i = 0; i < userNickList.length;i++) {
            nickOptions += `<option value="${userNickList[i]}">${userNickList[i]}</option>`
        }
        return `
        <link rel="stylesheet" type="text/css" href="./updateAlarm.css">
        <div id="background" >        
            <div class="container">
            <form action="/update_alarm_process" class="updateAlarmForm" method="post">
                <input type="hidden" name="exist_alarm_id" value="${alarm_id}"></input>
                <input class="button" type="button" value="사용자 정의 위치 생성" onClick="location.href='/create_userloc'">
                    
                    <div>
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="0" id="일">
                    <label class="checkboxLabel" for="일">일</label>
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="1" id="월">
                    <label class="checkboxLabel" for="월">월</label>
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="2" id="화">
                    <label class="checkboxLabel" for="화">화</label>
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="3" id="수">
                    <label class="checkboxLabel" for="수">수</label>            
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="4" id="목">
                    <label class="checkboxLabel" for="목">목</label>
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="5" id="금">
                    <label class="checkboxLabel" for="금">금</label>
                    <input class="dayCheckBox" type="checkbox" name="Day_of_the_week" value="6" id="토">    
                    <label class="checkboxLabel" for="토">토</label>
                    </div>
                    




                    <div class="select_options">
                    <select class="select" name="출발지">${nickOptions}</select>
                    
                    =>  
                    <select class="select" name="도착지"> ${nickOptions} </select>
                    </div>
                
                    <div class="alram time">
                    알람시간
                    
                        <input type="number" name="alarm_time_hour" min="0" max="23" value="0"> : <input type="number" name="alarm_time_min" min="0" max="59" value="0">
                    
                    </div>

                    <div class="departure time">

                    출발시간
                    
                        <input type="number" name="depart_time_hour" min="0" max="23" value="0"> : <input type="number" name="depart_time_min" min="0" max="59" value="0">
                    </div>
                
                    <input class="button"  type="submit" value="확인">
                    <input class="button cancel"  type="button" value="취소" onClick="location.href='/alarm'">
                </form>
            </div>
        </div>`;
      },
}