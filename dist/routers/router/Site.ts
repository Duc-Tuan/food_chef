import express from 'express';
var router = express.Router();

const SiteController = require('../../controllers/SiteController');

router.get('/', SiteController.index);

module.exports = router;
