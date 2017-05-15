var express     = require('express'),
    path        = require('path'),
    configs     = require(path.resolve(__dirname, '../common/configs/globalConfigs')),
    cleaner     = require(path.resolve(__dirname, '../common/util/stringUtil')),
    router      = express.Router(),
    ROOT_DIR    = configs.paths.ROOT_DIRECTORY,
    SINGLE_WORD = configs.consts.SINGLE_WORD,
    WORD_LIST   = configs.consts.WORD_LIST;

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    res.redirect('index.html');
  } catch (e) {
    console.log('ERROR: Cannot render homepage');
    console.log(e);
    res.render('index', { title: 'Bummer... we seem to be experiencing some technical difficulties =/' });
  }
});

// Call to stem algo
router.get('/stemmer', function(req, res, next) {
  console.log('Stemming word(s) now!!');
  var type      = req.query.type,
      userInput = cleaner.trim(req.query.userInput),
      results   = null;

  // Client-side validation ensures proper format of word. BUT, in real env, there should be server-side validations for security purposes (i.e. in case JS is turned off in the browser)
  if (type === SINGLE_WORD){
    results = stemmer.stemWord(userInput);
  }else if (type === WORD_LIST){
    var wordList =
    results = stemmer.stemWordList(userInput);
  }else{
    // TODO: Implement unrecognized type error
  }
  res.json({
    // 'status' : 'SUCCESS'
  });
  // res.redirect('/#/stemWordResults');
});

module.exports = router;
