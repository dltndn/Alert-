module.exports = {
    filterURL : function (queryData_id) {
        let title = queryData_id.substring(1, queryData_id.length);
        return title;    
      },
  }