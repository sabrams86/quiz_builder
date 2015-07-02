var parser = require('./../lib/validator');

describe('splitByNewLine', function(){
  it('splits an incoming string into an array', function(){
    var input = 'stuff\nother\nthing';
    var expectedOutput = ['stuff', 'other', 'thing'];
    expect(parser.splitByNewLine(input)).toEqual(expectedOutput);
  });
});

describe('splitByChar', function(){
  it('splits an incoming string into an array')
}
