module.exports = {
  static : {
    'invalidWordListInput' : 'Bad word list input passed to be stemmed!',
    'invalidWord'          : 'Bad word in list!',
    'invalidLanguage'      : 'Bad language passed to Stem Engine!'
  },
  dynamic : {
    'notExpectedType' : function(input){
                          return 'The following is not of type ' + input.expectedType +
                                 '! Received instead : {var:' + input.name + ', type:' + input.type + ' value: ' + input.value + '}';}
  }
};
