# TinyURL - URL Shortener

Modern URL shortener service with Google OAuth authentication, role-based access control, and AI chat integration.

## Features

### Core Features
- 🔗 Shorten long URLs to custom or auto-generated short codes
- 🔐 User authentication via Google OAuth 2.0
- 👤 Role-based access control (User, Admin, Super Admin)
- 📊 URL analytics and click tracking
- ⏰ Expirable URLs with customizable duration
- 📝 URL memo/notes support
- 🔍 Search and filter URLs
- 📱 Responsive design

### Admin Features
- 👥 User management (role assignment, activation/deactivation)
- 📈 System-wide URL statistics
- 🔗 Manage all URLs across users
- 📊 Dashboard with analytics

### Additional Features
- 💬 AI Chat integration (supports multiple AI providers: GLM-4.6, Groq, OpenRouter, Together AI)
- 🌐 Internationalization (Thai/English)
- 🎨 Modern UI with clean design
- 📥 Export data (CSV, JSON)

## Prerequisites

- Node.js (v16 or higher recommended)
- Google OAuth 2.0 credentials
- AI API key (optional, for chat feature)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/rachiodevz/dudx-tinyurl.git
cd dudx-tinyurl
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
```env
# Server Configuration
PORT=8080
BASE_URL=http://localhost:8080
SESSION_SECRET=your_random_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Super Admin (comma-separated emails)
SUPER_ADMIN_EMAILS=your-email@gmail.com

# AI Chat Configuration (optional)
AI_PROVIDER=GLM
GLM_API_KEY=your_glm_api_key_here
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
TOGETHER_API_KEY=your_together_api_key_here
```

## Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API** (or People API)
4. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add **Authorized redirect URIs** (add all URLs you'll use):
   - `http://localhost:8080/auth/google/callback` (local development)
   - `http://YOUR_LOCAL_IP:8080/auth/google/callback` (for LAN access)
   - `https://yourdomain.com/auth/google/callback` (production domain)

**Note**: The application uses relative callback URLs, so it works with any registered host/IP in Google OAuth Console.

## AI Chat Configuration

The chat feature supports multiple AI providers. Configure by setting `AI_PROVIDER` in `.ENV`:

- **GLM** (GLM-4.6) - Default
- **GROQ** (Llama 3.1 70B) - Free tier available
- **OPENROUTER** (Various models) - Free tier available
- **TOGETHER** (Together AI)

Get API keys from:
- GLM: https://bigmodel.cn/
- Groq: https://console.groq.com/
- OpenRouter: https://openrouter.ai/
- Together: https://www.together.ai/

## Usage

Start the server:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
dudx-tinyurl/
├── server.js                   # Main server entry point
├── src/
│   ├── app.js                 # Express app configuration
│   ├── config/
│   │   ├── index.js           # Main configuration
│   │   └── ai-models.js       # AI models configuration
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── models/
│   │   ├── chat/              # AI chat models (MVC pattern)
│   │   │   ├── glm.model.js
│   │   │   ├── groq.model.js
│   │   │   ├── openrouter.model.js
│   │   │   └── together.model.js
│   │   ├── url.js             # URL database model
│   │   └── user.js            # User database model
│   ├── routes/
│   │   ├── page.js            # Page routes
│   │   ├── url.js             # URL API routes
│   │   ├── user.js            # User API routes
│   │   └── chat.js            # Chat API routes
│   └── services/
│       ├── url-shortener.js   # URL shortening logic
│       └── user-manager.js    # User management logic
├── public/                    # Frontend files
│   ├── css/                   # Stylesheets
│   │   ├── navbar.css
│   │   ├── create.css
│   │   ├── my-urls.css
│   │   ├── admin.css
│   │   ├── login.css
│   │   └── chat.css
│   ├── page/                  # HTML pages
│   │   ├── login.html
│   │   ├── create.html
│   │   ├── my-urls.html
│   │   ├── admin.html
│   │   └── chat.html
│   ├── uploads/               # User avatars
│   ├── navbar.js              # Reusable navbar component
│   └── i18n.js                # Internationalization
├── data/                      # Database files (auto-created)
│   ├── urls.nedb
│   └── users.nedb
├── .env                       # Environment variables (not tracked)
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

## User Roles

- **User** - Can create and manage their own URLs
- **Admin** - Can view and manage all URLs and users
- **Super Admin** - Full system access, assigned via SUPER_ADMIN_EMAILS in .ENV

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/logout` - Logout
- `GET /auth/user` - Get current user info

### URLs
- `POST /api/shorten` - Create short URL
- `GET /api/urls` - Get user's URLs
- `GET /api/urls/all` - Get all URLs (Admin only)
- `PUT /api/urls/:code` - Update URL
- `DELETE /api/urls/:code` - Delete URL
- `GET /:code` - Redirect to target URL

### Users (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:googleId/role` - Change user role
- `PUT /api/users/:googleId/status` - Toggle user active status

### Chat
- `POST /api/chat` - Send message to AI
- `GET /api/chat/info` - Get current AI provider info

## Technologies Used

- **Backend**: Express.js, Node.js
- **Authentication**: Passport.js, Google OAuth 2.0
- **Database**: NeDB (embedded, file-based)
- **AI Integration**: OpenAI SDK (compatible with multiple providers)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Internationalization**: Custom i18n implementation

## Development

The project uses a clean MVC architecture:
- **Models**: Handle data and business logic
- **Routes**: Handle HTTP requests and responses (controllers)
- **Services**: Reusable business logic
- **Public**: Frontend static files

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m '✨ Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ by [rachiodevz](https://github.com/rachiodevz)
