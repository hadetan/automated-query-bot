const { createFormController } = require('../../controllers/form.controller');
const idExtractor = require('../../middleware/idExtractor');

const router = require('express').Router();

router.post('/', idExtractor, createFormController);

module.exports = router;
