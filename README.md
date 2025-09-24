# Automated query bot

## Description

A server which is capable of saving form data **[publisher: not required, name, phone number, email, course: course they are wishing to apply for, message: additional message they want to leave]** and **signup & login [name, email, password, forms: not required]** where login/signup feature is not required in order to use our service. The forms data will be sent to google sheet's specified sheet where the server will manage heading rows for example [S. No., Name, Phone Number, Email, Course, Message] and data rows with auto generation of row serial number and filling out the row's data with the unprocessed data from MongoDB. The data will be fetched and sent to whatsapp's specified group/phone number depending on the use cases, the data format will be as equal as the google sheet with [S. No.: Number, Name: user name, Phone Number: user phone number, Email: user email, Course: course they want to do, Message: their message]. Only the data that has not been sent to google sheet and whatsapp will be fetched, by tracking the [isProcessed: default: false] from form schema. The data will be processed for sending to google sheet and whatsapp group in a specific interval.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Environments](#environments)
- [License](#license)
- [Contact Information](#contact-information)

## Installation

### Prerequisites

- Node.js
- Mongodb Atlas
- WhatsApp
- Google Account for Google Sheet

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/hadetan/Social-media-app-server.git

# Navigate to the project directory
cd yourproject

# Install dependencies
npm install
```

## Usage

```bash
# Start the development server
npm start
```

## API Documentation

### End Points

```bash
# Base API url
${server url}/api/v1
```

- POST

```bash
# Creating a new user
/auth/signup

# logging into existing user
/auth/login

# Refreshing token of an existing user
/auth/refreshtoken

# Creating a new form
/form/
```

- DELETE

```bash
# Logging out the user
/auth/logout
```

## Database

### MongoDB

#### Schema

- `user`: Email (required), Password (required), Name (required), forms. [Referred to `form`]
- `form`: Publisher [Referred to `user`], name (required), phone (required), email (required), course (required), message, isProcessed {Boolean: Default: false}.

## Environments

```bash
PORT=any_port
MONGO_URI=your_mongodb_atlas_url
ACCESS_TOKEN_PRIVATE_KEY=randomized_string_for_jwt_access_token
REFRESH_TOKEN_PRIVATE_KEY=randomized_string_for_jwt_refresh_token
ALLOWED_URL=your_frontend_url
SCOPES=https://www.googleapis.com/auth/spreadsheets
SPREADSHEET_ID=your_spreadsheet_id_of_google_sheet
RANGE=your_sheet_name
RECIPIENTNUMBER=on_the_number_you_want_to_send_the_data
RECIPIENTGROUP=on_the_group_you_want_to_send_the_data
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contact Information

Email: <aquibsyed83@gmail.com>

Maintainer: Aquib Ali
