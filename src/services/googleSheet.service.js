const { RANGE, SPREADSHEET_ID } = require('../configs/index.js');

//#region Appending on Google Sheet
module.exports = async (sheets, batchStart, newEntries) => {
	try {

		//Logic for google sheets processing
		const sheetData = await sheets.spreadsheets.values.get({
			//Your spreadSheet id extracted from link in parameter
			spreadsheetId: SPREADSHEET_ID,
			//Sheet name
			range: RANGE,
		});

		// Get sheetId
		const sheetInfo = await sheets.spreadsheets.get({
			spreadsheetId: SPREADSHEET_ID,
		});
		const sheetId = sheetInfo.data.sheets[0].properties.sheetId;

		// Check if the spreadsheet already contains a header row by verifying specific column names
		const currentData = sheetData.data.values || [];
		const hasHeader =
			currentData.length > 0 && // Ensure thee is at least one row of data
			currentData[0][0] === 'S. No.' && // Verify the first column
			currentData[0][1] === 'Name'; // Verify the second column matches expected header

		// Add header if missing
		if (!hasHeader) {
			await sheets.spreadsheets.values.update({
				spreadsheetId: SPREADSHEET_ID,
				range: RANGE,
				valueInputOption: 'RAW',
				resource: {
					values: [
						[
							'S. No.',
							'Name',
							'Phone Number',
							'Email',
							'Course',
							'Message',
						],
						...(currentData || []),
					],
				},
			});
		}

		// // Prepare rows
		// const lastSerialNumber =
		// 	currentData.length > 1
		// 		? parseInt(currentData[currentData.length - 1][0]) || 0
		// 		: 0;

		const rows = newEntries.map((entry, index) => [
            // lastSerialNumber + 1 + index, //old way
			batchStart + 1 + index, //Serial Number
			entry.name,
			entry.phone,
			entry.email,
			entry.course,
			entry.message,
		]);

		// Append rows to sheet
		const appendResponse = await sheets.spreadsheets.values.append({
			spreadsheetId: SPREADSHEET_ID,
			range: RANGE,
			valueInputOption: 'RAW',
			resource: {
				values: rows,
			},
		});

		// Extract `startRowIndex` from `updatedRange`
		const updatedRange = appendResponse.data.updates?.updatedRange || '';
		let startRowIndex;

		if (updatedRange) {
			//Extract the start row from the range string (e.g. "Sheet1!A2:A6")
			const match = updatedRange.match(/\d+/); // Extract the first numeric row value

			if (match) {
				startRowIndex = parseInt(match[0]) - 1; // Convert to zero-based index
			}
		}

		// Fallback if `updatedRange` is missing or invalid
		if (!startRowIndex || isNaN(startRowIndex)) {
			startRowIndex = currentData.length + (hasHeader ? 0 : 1); // Add 1 if no header
		}

		// Validate `startRowIndex`
		if (startRowIndex < 0) {
			return console.log(
				'Invalid startRowIndex calculated for formatting.'
			);
		}

		// Apply yellow background to the serial number column for new rows
		const requests = rows.map((_, index) => ({
			repeatCell: {
				range: {
					sheetId: sheetId,
					startRowIndex: startRowIndex + index,
					endRowIndex: startRowIndex + index + 1,
					startColumnIndex: 0,
					endColumnIndex: 1,
				},
				cell: {
					userEnteredFormat: {
						backgroundColor: {
							red: 1.0,
							green: 1.0,
							blue: 0.0,
						},
					},
				},
				fields: 'userEnteredFormat.backgroundColor',
			},
		}));

		// Finally update the spreadsheet
		await sheets.spreadsheets.batchUpdate({
			spreadsheetId: SPREADSHEET_ID,
			resource: {
				requests,
			},
		});

        return newEntries;
	} catch (err) {
		return console.log(
			`Error while appending to google sheet: ${err.message}`
		);
	}
};
//#endregion Appending on Google Sheet
