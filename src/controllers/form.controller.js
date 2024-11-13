const Form = require('../models/Form');
const User = require('../models/User');
const { error, success } = require('../utils/responseWrapper');

const createFormController = async (req, res) => {
	'use strict';

	const { name, phone, email, course, message } = req.body;
	const userId = req._id;
	const messageFormat = /^.{10,}$/;
	const phoneFormat = /^.{10,}$/;

	if (!name) {
		return res.send(error(400, 'Name is required'));
	}

	if (!phone) {
		return res.send(error(400, 'Phone number is required'));
	}

	if (!course) {
		return res.send(error(400, 'Course name is required'));
	}

	if (!message) {
		return res.send(error(400, 'Message is required'));
	}

	if (!messageFormat.test(message)) {
		return res.send(error(400, 'Message must be 10 characters in length.'));
	}

	if (!phoneFormat.test(phone)) {
		return res.send(
			error(400, 'Phone number must be 10 characters in length.')
		);
	}

	try {
		if (userId) {
			const user = await User.findById({ _id: userId });
			console.log(user);

			const form = await Form.create({
				publisher: req._id,
				name,
				phone,
				email,
				course,
				message,
			});

			await user.forms.push(form._id);
			await user.save();

			return res.send(success(201, { form }));
		}

		const form = await Form.create({
			name,
			phone,
			email,
			course,
			message,
		});

		return res.send(success(201, { form }));
	} catch (err) {
		console.log(err);
		return res.send(error(500, err.message));
	}
};

module.exports = {
	createFormController,
};
