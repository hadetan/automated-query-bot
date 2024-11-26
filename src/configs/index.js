require('dotenv').config();

module.exports = {
	PORT: process.env.PORT,
	MONGO_URI: process.env.MONGO_URI,
	ACCESS_TOKEN_PRIVATE_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY,
	REFRESH_TOKEN_PRIVATE_KEY: process.env.REFRESH_TOKEN_PRIVATE_KEY,
	ALLOWED_URL: process.env.ALLOWED_URL,
	SCOPES: process.env.SCOPES,
	SPREADSHEET_ID: process.env.SPREADSHEET_ID,
	RANGE: process.env.RANGE,
	RECIPIENTNUMBER: process.env.RECIPIENTNUMBER,
	RECIPIENTGROUP: process.env.RECIPIENTGROUP
};
