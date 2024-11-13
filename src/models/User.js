const { default: mongoose } = require('mongoose');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
    forms: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'form'
		}
	]
});

module.exports = mongoose.model('user', userSchema);
