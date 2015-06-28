var parser = require('./../lib/gameplay');

describe('shuffleQuestions', function(){
  it('splits an incoming string into seperate questions', function(){
    var input = 'stuff';
    var expectedOutput = 'other';
    expect(parser.thing(input)).toEqual(expectedOutput);
  });
});
