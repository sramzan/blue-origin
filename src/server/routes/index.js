var express    = require('express'),
    path       = require('path'),
    request    = require('request'),
    os         = require("os"),
    configs    = require(path.resolve(__dirname, '../common/configs/globalConfigs')),
    stemUtil   = require(path.resolve(__dirname, '../stemmer/wordListStemmer')),
    errContent = configs.content.exceptionContent,
    router     = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    res.sendFile(__dirname + '/ui/templates/index.html');
  } catch (e) {
    console.log('ERROR: Cannot render homepage');
    console.log(e);
    res.render('index', { title: 'Bummer... we seem to be experiencing some technical difficulties =/' });
  }
});

// Call to stem algo
router.get('/stemmer', function(req, res, next) {
  console.log('Stemming word(s) now!!');
  var url      = req.query.userInput,
      delim    = req.query.delim,
      results  = {};
  if(delim === null || delim === undefined || delim !== ',' || delim !== ' '){ // REALLY dislike this sort of check. Refactor if time permits
    delim = os.EOL;
  }
  try {
    // var wordListRequest = request(url, function(error, response, body){
      console.log('Word List acquired');
      var wordList = ['preface','face','walk','walking','fetch','bearable','enlighten', null, undefined, '', ' ', 'forcemeat', 'speedometer', 'force', 'meat', 'speed', 'meter', 'forcemeat', 'speedometer', 'force']; // body.split(delim),
          stemEngine = new stemUtil.StemEngine(wordList, 'en');
      results = stemEngine.stemWordList();
    // });
  } catch (e) {
    console.log('ERROR: ' + e);
    console.log(errContent.static.badStemmerCall);
    results.errMessage = errContent.static.badStemmerCall;
  } finally{
    res.json(results);
  }

  // Test data
  // var wordList   = ['face', 'preface', 'lift', 'facelift', 'facing', 'lifting'], //body.split(delim),
  // var wordList   = ['preface','face','walk','walking','fetch','bearable','enlighten', null, undefined, '', ' ', 'forcemeat', 'speedometer', 'force', 'meat', 'speed', 'meter', 'forcemeat', 'speedometer', 'force','speed','meter'];
  // wordList   = ['apple', 'data', 'blastvark', 'banana', 'aardvark', 'aardwolf', 'aaron', 'enlighten', 'hey-there', 'oh-no-yes', '', null, undefined],
  // res.redirect('/#/stemWordResults');
});

module.exports = router;
