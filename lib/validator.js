Errors = function() {

  this._errors = [];

}

Errors.prototype.exists = function(input, message){
  if (!input || String(input).trim() === ''){
    this._errors.push(message)
  }
}

Errors.prototype.minLength = function(input, min, message){
  if (input.length < min) {
    this._errors.push(message)
  }
}

// Errors.prototype.unique = function(input, collection, fieldName){
//
//   this._errors.push(message);
// }

Errors.prototype.compare = function(input1, input2, message){
  if (input1 !== input2) {
    this._errors.push(message);
  }
}

Errors.prototype.email = function(input, message){
  var test1 = input.split('@').length;
  var test2 = input.split('@')[1].split('.').length;
  var test3 = input.split('@')[0].length;
  var test4 = input.split('@')[1].split('.')[0].length;
  var test5 = input.split('@')[1].split('.')[1].length;
  if (test1 !== 2 || test2 !== 2 || test3 === 0 || test4 === 0 || test5 === 0){
    this._errors.push(message);
  }
}

Errors.prototype.length = function(input, n, message){
  if (input.length < n){
    this._errors.push(message);
  }
}

Errors.prototype.questionObjects = function(input, message){
  for (var i = 0 ; i < input.length; i++){
    if (!input[i].type || !input[i].question || !input[i].answer){
      this._errors.push(message);
      break;
    }
  }
}

module.exports = Errors;
