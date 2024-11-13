const {
	signupController,
	loginController,
	refreshAccessTokenController,
	logoutController,
} = require('../../controllers/auth.controller');

const router = require('express').Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.delete('/logout', logoutController);
router.post('/refreshtoken', refreshAccessTokenController);

module.exports = router;
