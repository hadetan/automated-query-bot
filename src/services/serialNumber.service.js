const Counter = require('../models/Counter');

//#region

// Function to get and increment the counter.
module.exports = async (batchSize) => {
	try {
		const counter = await Counter.findOneAndUpdate(
			{ name: 'serialNumber' },
			{
				$inc: {
					value: batchSize,
				},
			},
			{ upsert: true, new: true }
		);
		return counter.value - batchSize;
	} catch (err) {
		console.log(`Error accessing counter: ${err.message}`);
		throw new Error('Failed to retrieve the serial number counter.');
	}
};

//#endregion
