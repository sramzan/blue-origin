var express     = require('express'),
    path        = require('path'),
    request     = require('request'),
    os          = require("os"),
    configs     = require(path.resolve(__dirname, '../common/configs/globalConfigs')),
    utils       = require(path.resolve(__dirname, '../common/util/utils')),
    router      = express.Router(),
    stemUtil    = utils.stemmer;

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
      wordList = [];
  if(delim === null || delim === undefined || delim !== ',' || delim !== ' '){ // REALLY dislike this sort of check. Refactor if time permits
    delim = os.EOL;
  }
  // var wordListRequest = request(url, function(error, response, body){
        console.log('Word List acquired');
        var wordList   = ['face', 'preface', 'lift', 'facelift', 'facing', 'lifting'], //body.split(delim),
            stemEngine = new stemUtil.StemEngine(wordList, 'en'),
            results    = stemEngine.stemWordList();
        res.json(results);
      // });
  // wordList   = ['apple', 'data', 'blastvark', 'banana', 'aardvark', 'aardwolf', 'aaron', 'enlighten', 'hey-there', 'oh-no-yes', '', null, undefined],
  // res.redirect('/#/stemWordResults');
});

module.exports = router;
