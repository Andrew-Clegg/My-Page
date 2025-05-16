var express = require('express');
var router = express.Router();

/* GET blackjack page. */
router.get('/', function(req, res, next) {
  res.render('blackjack', { title: 'BlackJack' });
  
});

module.exports = router;