# TinyURL - URL Shortener

URL shortener service with Google OAuth authentication.

## Features

- Shorten long URLs to short codes
- User authentication via Google OAuth 2.0
- User-specific URL management
- View shortened URL statistics

## Prerequisites

- Node.js (v14 or higher)
- Google OAuth 2.0 credentials

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tinyurl
```

2. Install dependencies:
```bash
npm install
```

3. Create `.ENV` file from the example:
```bash
cp .env.example .ENV
```

4. Configure your `.ENV` file with your credentials:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_random_secret_key
BASE_URL=http://localhost:8080
```

## Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs (add all URLs you'll use):
   - `http://localhost:8080/auth/google/callback`
   - `http://192.168.1.87:8080/auth/google/callback` (your local network IP)
   - Add any other IPs or domains you need

**Note**: The application now uses relative callback URLs, so it will work with any host/IP as long as it's registered in Google OAuth Console.

## Usage

Start the server:
```bash
node server.js
```

The application will be available at `http://localhost:8080`

## Project Structure

```
tinyurl/
├── server.js           # Main server file
├── public/            # Static files
│   └── index.html     # Frontend interface
├── package.json       # Dependencies
└── .ENV              # Environment variables (not tracked)
```

## Technologies Used

- Express.js - Web framework
- Passport.js - Authentication middleware
- NeDB - Embedded database
- Google OAuth 2.0 - Authentication provider

## License

MIT
