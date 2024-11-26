const mongoose = require('mongoose');

const formSchema = mongoose.Schema({
	publisher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: Number,
		required: true,
	},
	email: {
		type: String,
		lowercase: true,
	},
	course: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
		trim: true,
	},
	isProcessed: { type: Boolean, default: false },
});

module.exports = mongoose.model('form', formSchema);
