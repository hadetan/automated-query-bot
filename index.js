const express = require('express');
const { success } = require('./src/utils/responseWrapper');
const { PORT, RECIPIENTGROUP } = require('./src/configs');
const dbConnect = require('./src/configs/dbConnect');
const morgan = require('morgan');
const mainRouter = require('./src/routers/index');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsConfig = require('./src/configs/corsConfig');
const sendDataService = require('./src/services/sendData.service');
const { initializeClient } = require('./src/services/whatsappClient.service');

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

// Initialize WhatsApp Client ->
initializeClient();

/* Calling for service */

setInterval(() => {
	sendDataService()
}, 10000);