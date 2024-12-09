const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { RECIPIENTGROUP } = require('../configs');

//#region

let whatsappClient;
let isClientReady = false;

// Function to initializing whatsApp client
const initializeClient = async () => {
	if (whatsappClient) {
		return whatsappClient; //Return the existing client if already initialized
	}

	whatsappClient = new Client({
		authStrategy: new LocalAuth(),
	});

	// Generating QR code for authentication
	whatsappClient.on('qr', (qr) => {
		console.log('Scan this QR code to log in to WhatsApp:');
		qrcode.generate(qr, { small: true });
	});

	// Set the client as ready once initialized
	whatsappClient.on('ready', () => {
		isClientReady = true;
		console.log('WhatsApp client is ready!');
	});

	// Handle client disconnection
	whatsappClient.on('disconnected', (reason) => {
		console.log(`WhatsApp client disconnected: ${reason}`);
		// Reset the client for reinitialization
		isClientReady = false;
		whatsappClient = null;
	});

	// Initialize the client
	await whatsappClient.initialize();

	return whatsappClient;
};

// Function to wait until the WhatsApp client is ready
const waitForClientReady = () => {
	return new Promise((resolve, reject) => {
		if (isClientReady) {
			resolve(); // Resolve immediately if the client is already ready
		} else {
			whatsappClient.on('ready', resolve); // Wait for the `ready` event
			whatsappClient.on('disconnected', () => {
				reject(
					new Error(
						'WhatsApp client disconnected before it was ready.'
					)
				);
			});
		}
	});
};

// Function to send WhatsApp messages
const messageToWhatsapp = async (message) => {
	try {
		const client = await initializeClient();

		// Wait until the client is ready
		await waitForClientReady();

		// WhatsApp formatted number and group id
		// const formattedNumber = `${recipientNumber}@c.us`;

		const formattedGroup = `${RECIPIENTGROUP}@g.us`;

		// Sending message to the specified number with the message
		await client.sendMessage(formattedGroup, message);
		return console.log('WhatsApp message sent successfully!');
	} catch (err) {
		console.log(`Error sending WhatsApp message: ${err}`);
	}
};

module.exports = {
	messageToWhatsapp,
	initializeClient,
};

//#endregion
