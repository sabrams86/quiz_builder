var parser = require('./../lib/validator');

describe('exists', function(){
  it('splits an incoming string into seperate questions', function(){
    var input = 'stuff';
    var expectedOutput = 'other';
    expect(parser.thing(input)).toEqual(expectedOutput);
  });
});
