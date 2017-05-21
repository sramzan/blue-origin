var express     = require('express'),
    path        = require('path'),
    configs     = require(path.resolve(__dirname, '../common/configs/globalConfigs')),
    utils       = require(path.resolve(__dirname, '../common/util/utils')),
    // cleaner     = require(path.resolve(__dirname, '../common/util/stringUtil')),
    router      = express.Router(),
    stemUtil    = utils.stemmer;
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

  // var type      = req.query.type,
  //     userInput = cleaner.trim(req.query.userInput),
  //     results   = [{}];
  //
  // // Client-side validation ensures proper format of word. BUT, in real env, there should be server-side validations for security purposes (i.e. in case JS is turned off in the browser)
  // if (type === SINGLE_WORD){
  //   results = stemmer.stemWord(userInput);
  // }else if (type === WORD_LIST){
  //   var wordList =
  //   results = stemmer.stemWordList(userInput);
  // }else{
  //   // TODO: Implement unrecognized type error
  // }
  // res.send(results);
  var stemEngine = new stemUtil.StemEngine(1,2);
  stemEngine.test();
  res.json({
      'payload' : [{
         word    : 'test',
         stems   : ['stem1', 'stem2'],
         affixes : ['affix1', 'affix2']
      }],
      'stemColSpan'  : 2,
      'affixColSpan' : 2
  });
  // res.redirect('/#/stemWordResults');
});

module.exports = router;
