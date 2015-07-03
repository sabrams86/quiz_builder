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

Errors.prototype.unique = function(doc, message, that){
  if (doc) {
    that._errors.push(message);
    return true;
  } else {
    return false;
  }
}
Errors.prototype.uniqueUser = function(input, collection, message, callback){
  collection.findOne({email: input}, {}, function (err, doc) {
    if (doc) {
      callback(message);
    } else {
      callback('');
    }
  });
}

Errors.prototype.compare = function(input1, input2, message){
  if (input1 !== input2) {
    this._errors.push(message);
  }
}

Errors.prototype.email = function(input, message){
  if (input.split(' ').length !== 1 || input.split('@').length !== 2 || input.split('@')[1].split('.').length !== 2 || input.split('@')[0].trim().length === 0 || input.split('@')[1].split('.')[0].trim().length === 0 || input.split('@')[1].split('.')[1].trim().length === 0){
    this._errors.push(message);
  }
}

Errors.prototype.length = function(input, n, message){
  if (input.length < n){
    this._errors.push(message);
  }
}

Errors.prototype.maxLength = function(input, n, message){
  if (input.length > n){
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

Errors.prototype.lengthOfSubArray = function(array, n, message){
  for (var i = 0; i < array.length; i++){
    if (array[i].length !== n){
      this._errors.push(message);
    }
  }
}

Errors.prototype.uniqueCSVQuestions = function(array, message){
  for( var i = 0; i < array.length; i++){
    var count = 0;
    for (var j = 0; j < array.length; j++) {
      if (array[i][1] === array[j][1]){
        count += 1;
      }
    }
    if (count > 1){
      this._errors.push(message);
      break;
    }
  }
}

Errors.prototype.uploadType = function(array, message){
  for( var i = 0; i < array.length; i++){
    if (array[i][0] === 'plain-text' || array[i][0] === 'image-url'){
    } else {
      this._errors.push(message);
      break;
    }
  }
}

module.exports = Errors;
