module.exports = {

  processCSV: function(string){
    var questionList = string.split('\r\n');
    var arrOfArrs = questionList.map(function(e){
      return e.split(',').map(function(f){
        return f.trim();
      });
    });
    return arrOfArrs.map(function(item){
      return {type: item[0],
              question: item[1],
              answer: item[2]};
    });
  }
}
