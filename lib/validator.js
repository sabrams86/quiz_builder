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
  console.log(input.split('@')[1].split('.')[1].trim().length);
  if (input.split(' ').length !== 1 || input.split('@').length !== 2 || input.split('@')[1].split('.').length !== 2 || input.split('@')[0].trim().length === 0 || input.split('@')[1].split('.')[0].trim().length === 0 || input.split('@')[1].split('.')[1].trim().length === 0){
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
