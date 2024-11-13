const router = require('express').Router();
const authRouter = require('./auth.routes');
const formRouter = require('./form.routes');

router.use('/auth', authRouter);
router.use('/form', formRouter);

module.exports = router;
