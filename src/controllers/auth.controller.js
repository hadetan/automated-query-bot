const {
	REFRESH_TOKEN_PRIVATE_KEY,
	ACCESS_TOKEN_PRIVATE_KEY,
} = require('../configs');
const cookieConfig = require('../configs/cookieConfig');
const User = require('../models/User');
const { error, success } = require('../utils/responseWrapper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signupController = async (req, res) => {
	'use strict';

	const { name, email, password } = req.body;
	const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordFormat =
		/^(?=.*[A-Z])(?=.*[!@#$%^&*_])(?=.*[0-9])[A-Za-z0-9!@#$%^&*_]{8,}$/;

	if (!name && !email && !password) {
		return res.send(error(400, 'Name, Email and Password are required'));
	}

	if (!name) {
		return res.send(error(400, 'Name is required'));
	}

	if (!email) {
		return res.send(error(400, 'Email is required'));
	}

	if (!password) {
		return res.send(error(400, 'Password is required'));
	}

	if (!emailFormat.test(email)) {
		return res.send(error(400, 'The format of email is wrong.'));
	}

	if (!passwordFormat.test(password)) {
		return res.send(
			error(
				400,
				`The password must contain at least one number. It should at least have one symbol "!@#$%^_&*". There should be at least one capital letter. Password must be at least length of 8 characters`
			)
		);
	}

	try {
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.send(error(409, 'User already registered'));
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		const accessToken = generateAccessToken({
			_id: user._id,
		});

		const refreshToken = generateRefreshToken({
			_id: user._id,
		});

		res.cookie('jwt', refreshToken, cookieConfig);

		return res.send(
			success(201, {
				accessToken,
				refreshToken,
			})
		);
	} catch (err) {
		console.log(err);
		return res.send(error(500, err.message));
	}
};

const loginController = async (req, res) => {
	'use strict';

	const { email, password } = req.body;

	if (!email && !password) {
		return res.send(error(400, 'Email and Password are required'));
	}

	if (!email) {
		return res.send(error(400, 'Email is required'));
	}

	if (!password) {
		return res.send(error(400, 'Password is required'));
	}

	try {
		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			return res.send(error(404, 'User not found'));
		}

		const matchPassword = await bcrypt.compare(password, user.password);

		if (!matchPassword) {
			return res.send(error(403, 'Incorrect password'));
		}

		const accessToken = generateAccessToken({
			_id: user._id,
		});

		const refreshToken = generateRefreshToken({
			_id: user._id,
		});

		res.cookie('jwt', refreshToken, cookieConfig);

		return res.send(
			success(200, {
				accessToken,
				refreshToken,
			})
		);
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

const logoutController = async (req, res) => {
	'use strict';
	try {
		res.clearCookie('jwt', cookieConfig);
		return res.send(success(200, 'Logged out successfully'));
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

const refreshAccessTokenController = async (req, res) => {
	'use strict';

	const cookies = req.cookies;

	if (!cookies.jwt) {
		return res.send(error(401, 'Refresh token in cookie is required'));
	}

	const refreshToken = cookies.jwt;

	try {
		const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_PRIVATE_KEY);

		const _id = decoded._id;
		const newAccessToken = await generateAccessToken({ _id });

		return res.json(success(201, { accessToken: newAccessToken }));
	} catch (err) {
		return res.send(error(401, 'Invalid refresh token'));
	}
};

const generateAccessToken = (data) => {
	try {
		const accessToken = jwt.sign(data, ACCESS_TOKEN_PRIVATE_KEY, {
			expiresIn: '1d',
		});
		return accessToken;
	} catch (err) {
		console.log(err);
	}
};

const generateRefreshToken = (data) => {
	try {
		const refreshToken = jwt.sign(data, REFRESH_TOKEN_PRIVATE_KEY, {
			expiresIn: '1y',
		});
		return refreshToken;
	} catch (err) {
		console.log(err);
	}
};

module.exports = {
	signupController,
	loginController,
	logoutController,
	refreshAccessTokenController,
};
