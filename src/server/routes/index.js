var express     = require('express'),
    path        = require('path'),
    configs     = require(path.resolve(__dirname, '../common/configs/globalConfigs')),
    utils       = require(path.resolve(__dirname, '../common/util/utils')),
    // cleaner     = require(path.resolve(__dirname, '../common/util/stringUtil')),
    router      = express.Router(),
    // urlCrawler  = utils.urlCrawler,
    stemUtil    = utils.stemmer,
    ROOT_DIR    = configs.paths.ROOT_DIRECTORY,
    SINGLE_WORD = configs.consts.SINGLE_WORD,
    WORD_LIST   = configs.consts.WORD_LIST;
    // router.use(function(req, res, next) {
    //   console.log('Setting stuff');
    //     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //     // res.header("Access-Control-Allow-Credentials", true);
    //     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    //     // next();
    //     res.sendStatus(200);
    // });
    // router.all('/', function(req, res, next) {
    //   res.header("Access-Control-Allow-Origin", "*");
    //   res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //   next()
    // });

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
  var url        = req.query.userInput,
      // wordList   = urlCrawler.getWordListFrom(url),
      wordList   = ['apple', 'data', 'blastvark', 'banana', 'aardvark', 'aardwolf', 'aaron', 'enlighten', '', null, undefined],
      stemEngine = new stemUtil.StemEngine(wordList, 'en'),
      results    = stemEngine.stemWordList();
      console.log('RESULTS: ' + results);
  res.json(results);
  // res.redirect('/#/stemWordResults');
});

module.exports = router;
