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

Errors.prototype.unique = function(input, collection, fieldName){

  this._errors.push(message);
}

module.exports = Errors;
