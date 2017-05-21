module.exports = {
  static : {
    'invalidWordListInput' : 'Bad input passed to be stemmed!',
    'invalidWord'          : 'Bad word in list!'
  },
  dynamic : {
    'notExpectedType' : function(input){
                          return 'The following is not of type ' + input.expectedType +
                                 '! Received instead : {var:' + input.name + ', type:' + input.type + '}';}
  }
};
