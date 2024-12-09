//#region 
const express = require('express');
const { success } = require('./src/utils/responseWrapper');
const { PORT } = require('./src/configs');
const dbConnect = require('./src/configs/dbConnect');
const morgan = require('morgan');
const mainRouter = require('./src/routers/index');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsConfig = require('./src/configs/corsConfig');
const sendDataService = require('./src/services/sendData.service');
const { initializeClient } = require('./src/services/whatsappClient.service');
//#endregion

const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors(corsConfig));

app.get('/', (req, res) => {
	return res.send(success(200, 'Server is running at full capacity'));
});

app.use('/', mainRouter);

app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});

//Connecting with database.
dbConnect;

/* Calling for service */

let isProcessing = false;

setInterval(async () => {
	// Initialize WhatsApp Client ->
	await initializeClient();

	if (isProcessing) return;
	isProcessing = true;
	try {
		await sendDataService();
	} finally {
		isProcessing = false;
	}
}, 24 * 60 * 60 * 1000);
