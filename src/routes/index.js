var express  = require('express'),
    path     = require('path'),
    configs  = require(path.resolve(__dirname, '../common/configs/globalConfigs')),
    router   = express.Router(),
    ROOT_DIR = configs.paths.ROOT_DIRECTORY;

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'SR Stemmer' });
  var baseHomePage = ROOT_DIR + '/stem/templates/home.html';

  try {
    res.sendFile(baseHomePage);
  } catch (e) {
    console.log('ERROR: Cannot render homepage');
    console.log(e);
  } finally {
    // res.render('index', { title: 'Bummer... page not found!' });
    res.sendFile(baseHomePage);
  }
});

module.exports = router;
