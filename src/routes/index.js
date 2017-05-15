var express  = require('express'),
    path     = require('path'),
    configs  = require(path.resolve(__dirname, '../common/configs/globalConfigs')),
    router   = express.Router(),
    ROOT_DIR = configs.paths.ROOT_DIRECTORY;

/* GET home page. */
router.get('/', function(req, res, next) {
  var baseHomePage = ROOT_DIR + '/ui/templates/home.html';
  try {
    res.redirect('index.html');
  } catch (e) {
    console.log('ERROR: Cannot render homepage');
    console.log(e);
    res.render('index', { title: 'Bummer... we seem to be experiencing some technical difficulties =/' });
  }
});

router.get('/stemmer', function(req, res, next) {
  console.log('Stemming word(s) now!!');
  var type      = req.query.type,
      userInput = req.query.userInput;
  res.json({
    // 'status' : 'SUCCESS'
  })
  // res.redirect('/#/stemWordResults');
});

module.exports = router;
