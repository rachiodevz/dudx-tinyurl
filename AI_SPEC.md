# AI Specification Document - TinyURL Project

> **Purpose**: This document provides comprehensive technical specifications for AI agents to understand and work on this codebase effectively.

**Last Updated**: 2025-11-11  
**Project**: TinyURL - URL Shortener with OAuth & AI Chat  
**Tech Stack**: Node.js, Express.js, NeDB, Passport.js, Vanilla JS

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Specifications](#api-specifications)
5. [Authentication & Authorization](#authentication--authorization)
6. [Frontend Components](#frontend-components)
7. [Business Rules](#business-rules)
8. [Code Conventions](#code-conventions)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## Project Overview

### Description
TinyURL is a URL shortening service with Google OAuth authentication, role-based access control, analytics, and AI chat integration.

### Key Features
- URL shortening with custom/auto-generated codes
- Google OAuth 2.0 authentication
- Role-based access (User, Admin, Super Admin)
- URL expiration system
- Click tracking and analytics
- AI chat with multi-provider support (GLM, Groq, OpenRouter, Together)
- Internationalization (Thai/English)

### Tech Stack
- **Backend**: Express.js (Node.js)
- **Database**: NeDB (embedded, file-based JSON database)
- **Authentication**: Passport.js + Google OAuth 2.0
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI Integration**: OpenAI SDK (compatible with multiple providers)

---

## Architecture

### Directory Structure

```
dudx-tinyurl/
├── server.js                      # Entry point
├── src/
│   ├── app.js                    # Express app setup
│   ├── config/
│   │   ├── index.js              # Main configuration
│   │   └── ai-models.js          # AI providers config
│   ├── middleware/
│   │   └── auth.js               # Passport configuration
│   ├── models/
│   │   ├── url.js                # URL data model
│   │   ├── user.js               # User data model
│   │   └── chat/                 # AI chat models (MVC)
│   │       ├── glm.model.js
│   │       ├── groq.model.js
│   │       ├── openrouter.model.js
│   │       └── together.model.js
│   ├── routes/
│   │   ├── page.js               # Page routes (HTML)
│   │   ├── url.js                # URL API routes
│   │   ├── user.js               # User API routes
│   │   └── chat.js               # Chat API routes
│   └── services/
│       ├── url-shortener.js      # URL business logic
│       └── user-manager.js       # User business logic
├── public/
│   ├── css/                      # Stylesheets
│   ├── page/                     # HTML pages
│   ├── uploads/                  # User avatars
│   ├── navbar.js                 # Navbar component
│   └── i18n.js                   # Internationalization
├── data/                         # NeDB database files
│   ├── urls.nedb
│   └── users.nedb
├── .env                          # Environment variables
└── README.md
```

### MVC Pattern

**Models** (`src/models/`)
- Handle data structure and database operations
- No HTTP logic, only data manipulation
- Return promises or data objects

**Routes/Controllers** (`src/routes/`)
- Handle HTTP requests/responses
- Validate input
- Call services/models
- Return JSON responses

**Services** (`src/services/`)
- Business logic layer
- Called by routes
- Orchestrate model operations

---

## Database Schema

### NeDB Overview
- **Type**: File-based JSON database
- **Location**: `./data/`
- **Format**: Line-delimited JSON
- **Query**: MongoDB-like syntax

### Collections

#### 1. Users Collection (`data/users.nedb`)

```javascript
{
  _id: String,                    // NeDB auto-generated ID
  googleId: String,               // Google OAuth ID (unique)
  email: String,                  // User email
  name: String,                   // Display name
  photo: String,                  // Avatar URL or local path
  role: String,                   // "USER" | "ADMIN" | "SUPER_ADMIN"
  isActive: Boolean,              // Account status
  createdAt: Date,                // Registration date
  lastLogin: Date                 // Last login timestamp
}
```

**Indexes**: `googleId` (unique)

**Role Hierarchy**:
- `USER` - Default role, can manage own URLs
- `ADMIN` - Can view/manage all URLs and users
- `SUPER_ADMIN` - Full system access, set via SUPER_ADMIN_EMAILS env

#### 2. URLs Collection (`data/urls.nedb`)

```javascript
{
  _id: String,                    // NeDB auto-generated ID
  code: String,                   // Short code (unique, 3-20 chars)
  target: String,                 // Original long URL
  createdBy: String,              // User's googleId
  createdAt: Date,                // Creation timestamp
  clicks: Number,                 // Click counter (default: 0)
  memo: String,                   // Optional note/description
  expiresAt: Date | null,         // Expiration date (null = permanent)
  isActive: Boolean               // Soft delete flag
}
```

**Indexes**: `code` (unique), `createdBy`

---

## API Specifications

### Base URL
`http://localhost:8080`

### Authentication APIs

#### `GET /auth/google`
Initiate Google OAuth login flow.

**Response**: Redirects to Google OAuth consent screen

---

#### `GET /auth/google/callback`
Google OAuth callback endpoint.

**Query Parameters**:
- `code`: OAuth authorization code (provided by Google)

**Response**: Redirects to `/create` on success, `/` on failure

---

#### `GET /auth/logout`
Logout current user.

**Response**: Redirects to `/`

---

#### `GET /auth/user`
Get current authenticated user info.

**Auth Required**: Yes

**Response**:
```json
{
  "googleId": "123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "photo": "/uploads/avatar_123.jpg",
  "role": "USER",
  "isActive": true
}
```

**Error Response** (401):
```json
{
  "error": "Not authenticated"
}
```

---

### URL APIs

#### `POST /api/shorten`
Create a new short URL.

**Auth Required**: Yes

**Request Body**:
```json
{
  "url": "https://example.com/very-long-url",
  "customCode": "mycode",           // Optional (3-20 alphanumeric)
  "memo": "My important link",      // Optional
  "expiresInDays": 30               // Optional (1-365, null = permanent)
}
```

**Validation Rules**:
- `url`: Required, valid URL format
- `customCode`: Optional, 3-20 chars, alphanumeric only, must be unique
- `expiresInDays`: Optional, integer 1-365

**Response** (200):
```json
{
  "short": "http://localhost:8080/mycode",
  "code": "mycode",
  "target": "https://example.com/very-long-url"
}
```

**Error Responses**:
- 400: Invalid URL or code format
- 409: Custom code already exists
- 401: Not authenticated

---

#### `GET /api/urls`
Get current user's URLs.

**Auth Required**: Yes

**Response**:
```json
[
  {
    "_id": "abc123",
    "code": "mycode",
    "target": "https://example.com",
    "createdBy": "google_123",
    "createdAt": "2025-11-11T10:00:00.000Z",
    "clicks": 42,
    "memo": "My link",
    "expiresAt": "2025-12-11T10:00:00.000Z",
    "isActive": true
  }
]
```

---

#### `GET /api/urls/all`
Get all URLs in the system (Admin only).

**Auth Required**: Yes (ADMIN or SUPER_ADMIN)

**Response**: Same as `/api/urls` but includes all users' URLs

**Error Response** (403):
```json
{
  "error": "Admin access required"
}
```

---

#### `PUT /api/urls/:code`
Update an existing URL.

**Auth Required**: Yes (owner or admin)

**Request Body**:
```json
{
  "target": "https://new-url.com",  // Optional
  "memo": "Updated note"            // Optional
}
```

**Response** (200):
```json
{
  "message": "URL updated successfully"
}
```

---

#### `DELETE /api/urls/:code`
Delete a URL (soft delete).

**Auth Required**: Yes (owner or admin)

**Response** (200):
```json
{
  "message": "URL deleted successfully"
}
```

---

#### `GET /:code`
Redirect to target URL and track click.

**Auth Required**: No

**Response**: 
- 302 redirect to target URL
- 404 if code not found or expired

**Side Effects**:
- Increments `clicks` counter
- Checks expiration before redirect

---

### User APIs (Admin Only)

#### `GET /api/users`
Get all users.

**Auth Required**: Yes (ADMIN or SUPER_ADMIN)

**Response**:
```json
[
  {
    "_id": "user123",
    "googleId": "google_123",
    "email": "user@example.com",
    "name": "John Doe",
    "photo": "/uploads/avatar.jpg",
    "role": "USER",
    "isActive": true,
    "createdAt": "2025-11-11T10:00:00.000Z",
    "lastLogin": "2025-11-11T12:00:00.000Z"
  }
]
```

---

#### `PUT /api/users/:googleId/role`
Change user role.

**Auth Required**: Yes (SUPER_ADMIN only)

**Request Body**:
```json
{
  "role": "ADMIN"  // "USER" | "ADMIN" | "SUPER_ADMIN"
}
```

**Response** (200):
```json
{
  "message": "User role updated successfully"
}
```

**Business Rules**:
- Cannot change own role
- Cannot change SUPER_ADMIN role (set via env only)

---

#### `PUT /api/users/:googleId/status`
Toggle user active status.

**Auth Required**: Yes (ADMIN or SUPER_ADMIN)

**Request Body**:
```json
{
  "isActive": false
}
```

**Response** (200):
```json
{
  "message": "User status updated successfully"
}
```

**Business Rules**:
- Cannot deactivate self
- Deactivated users cannot login

---

### Chat APIs

#### `POST /api/chat`
Send message to AI chat.

**Auth Required**: Yes

**Request Body**:
```json
{
  "message": "Hello, AI!",
  "history": []                    // Optional: previous messages
}
```

**Response** (200):
```json
{
  "reply": "Hello! How can I help you?",
  "provider": "GLM",
  "model": "glm-4.6"
}
```

**Error Response** (503):
```json
{
  "error": "AI service not configured"
}
```

---

#### `GET /api/chat/info`
Get current AI provider information.

**Auth Required**: No

**Response**:
```json
{
  "name": "GLM-4.6",
  "provider": "GLM",
  "model": "glm-4.6",
  "configured": true
}
```

---

## Authentication & Authorization

### Session Management
- **Library**: `express-session`
- **Storage**: Memory (default), consider Redis for production
- **Cookie**: `connect.sid`, httpOnly, secure in production

### Passport.js Strategy
- **Strategy**: `passport-google-oauth20`
- **Serialization**: Stores `googleId` in session
- **Deserialization**: Fetches fresh user data from database

### Google OAuth Configuration
```javascript
{
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",  // Relative URL
  proxy: true  // For reverse proxy support
}
```

### Authorization Middleware

**`requireAuth`** - Check if user is authenticated
```javascript
// Usage in routes
router.get('/api/urls', requireAuth, handler);
```

**`requireAdmin`** - Check if user has admin role
```javascript
function requireAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const role = req.user.role;
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
}
```

---

## Frontend Components

### Navbar Component (`public/navbar.js`)

**Purpose**: Reusable navigation bar with authentication state

**Features**:
- Dynamic menu generation from config
- Role-based menu visibility
- Language switcher (TH/EN)
- Floating menu (language + logout)
- Auto-initialization

**Configuration**:
```javascript
const navbar = new Navbar({
  menuItems: [
    {
      href: "/create",
      i18nKey: "nav.create",
      id: "createLink",
      icon: "✨"
    },
    {
      href: "/admin",
      i18nKey: "nav.admin",
      id: "adminLink",
      icon: "📊",
      requiresRole: ["ADMIN", "SUPER_ADMIN"]  // Role-based visibility
    }
  ]
});
```

**API**:
- `checkAuth()` - Verify authentication and update UI
- `updateMenuVisibility(role)` - Show/hide menus based on role

---

### Internationalization (`public/i18n.js`)

**Purpose**: Multi-language support (Thai/English)

**Features**:
- Translation key-value pairs
- Dynamic language switching
- Placeholder replacement (`{n}`, `{name}`, etc.)
- Auto-updates DOM elements with `data-i18n` attributes

**Usage in HTML**:
```html
<!-- Text content -->
<h1 data-i18n="home.title"></h1>

<!-- Placeholder -->
<input data-i18n-placeholder="placeholder.enterUrl" />
```

**Usage in JavaScript**:
```javascript
// Simple translation
const text = window.i18n.t("nav.create");

// With parameters
const text = window.i18n.t("time.minutesAgo", { n: 5 });
// Returns: "5 นาทีที่แล้ว" or "5 minutes ago"
```

**Translation Structure**:
```javascript
const translations = {
  th: {
    "nav.create": "สร้างลิงก์",
    "time.minutesAgo": "{n} นาทีที่แล้ว"
  },
  en: {
    "nav.create": "Create Link",
    "time.minutesAgo": "{n} minutes ago"
  }
};
```

---

## Business Rules

### URL Short Code Generation
1. **Custom Code**:
   - User provides code (3-20 alphanumeric chars)
   - Validate uniqueness
   - Reject if already exists

2. **Auto-generated Code**:
   - Generate random 6-character code
   - Use alphanumeric charset (A-Z, a-z, 0-9)
   - Retry if collision occurs (max 5 attempts)

### URL Expiration
- **Permanent URLs**: `expiresAt` = `null`
- **Expirable URLs**: `expiresAt` = `createdAt + expiresInDays`
- **Check on Redirect**: Return 404 if `expiresAt < now`
- **Display Status**:
  - Expired: "❌ หมดอายุแล้ว"
  - < 1 day: "⚠️ เหลือ < 1 วัน"
  - 1-7 days: "⏰ เหลือ {n} วัน" (warning color)
  - > 7 days: "⏳ เหลือ {n} วัน" (neutral color)
  - Permanent: "✅ ถาวร"

### User Roles

**Role Assignment**:
1. **First Registration**: Role = `USER`
2. **Super Admin**: Email in `SUPER_ADMIN_EMAILS` env → Role = `SUPER_ADMIN`
3. **Admin Assignment**: Super Admin can promote users to `ADMIN`

**Role Permissions**:
| Action | USER | ADMIN | SUPER_ADMIN |
|--------|------|-------|-------------|
| Create URL | ✅ | ✅ | ✅ |
| View own URLs | ✅ | ✅ | ✅ |
| Edit own URLs | ✅ | ✅ | ✅ |
| Delete own URLs | ✅ | ✅ | ✅ |
| View all URLs | ❌ | ✅ | ✅ |
| Edit any URL | ❌ | ✅ | ✅ |
| Delete any URL | ❌ | ✅ | ✅ |
| View users | ❌ | ✅ | ✅ |
| Change user status | ❌ | ✅ | ✅ |
| Change user role | ❌ | ❌ | ✅ |

### Avatar Management
- **Default**: Use Google profile photo
- **Local Storage**: Download and save to `public/uploads/avatar_{googleId}.jpg`
- **Fallback**: Hide avatar on error, show name only
- **Format**: JPEG, max 500KB (enforced in download)

---

## Code Conventions

### Naming Conventions

**Files**:
- Routes: `{resource}.js` (e.g., `url.js`, `user.js`)
- Models: `{entity}.js` (e.g., `url.js`, `user.js`)
- Services: `{entity}-{action}.js` (e.g., `url-shortener.js`)
- Pages: `{page-name}.html` (e.g., `create.html`, `my-urls.html`)
- CSS: Match HTML filename (e.g., `create.css` for `create.html`)

**Variables**:
- camelCase for variables and functions
- PascalCase for classes
- UPPER_SNAKE_CASE for constants

**Database Fields**:
- camelCase (e.g., `createdAt`, `expiresAt`)
- Avoid abbreviations unless standard (e.g., `_id` is NeDB standard)

### Error Handling

**API Responses**:
```javascript
// Success
res.json({ data: result });

// Error
res.status(statusCode).json({ error: "Error message" });
```

**Common Status Codes**:
- 200: Success
- 400: Bad Request (validation error)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate resource)
- 500: Internal Server Error
- 503: Service Unavailable (AI not configured)

### Async/Await Pattern
```javascript
// Always use try-catch with async functions
async function handler(req, res) {
  try {
    const result = await someAsyncOperation();
    res.json({ data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### NeDB Query Patterns

**Find One**:
```javascript
db.findOne({ code: 'abc123' }, (err, doc) => {
  if (err) return callback(err);
  callback(null, doc);
});
```

**Find Many**:
```javascript
db.find({ createdBy: 'google_123' })
  .sort({ createdAt: -1 })
  .exec((err, docs) => {
    if (err) return callback(err);
    callback(null, docs);
  });
```

**Insert**:
```javascript
db.insert(newDoc, (err, doc) => {
  if (err) return callback(err);
  callback(null, doc);
});
```

**Update**:
```javascript
db.update(
  { code: 'abc123' },           // Query
  { $set: { clicks: 10 } },     // Update
  {},                           // Options
  (err, numReplaced) => {
    if (err) return callback(err);
    callback(null, numReplaced);
  }
);
```

**Delete** (soft delete preferred):
```javascript
db.update(
  { code: 'abc123' },
  { $set: { isActive: false } },
  {},
  callback
);
```

---

## Common Tasks

### Adding a New Page

1. **Create HTML file** in `public/page/`:
```html
<!doctype html>
<html lang="th">
<head>
    <meta charset="UTF-8" />
    <title>Page Title</title>
    <link rel="stylesheet" href="/css/navbar.css" />
    <link rel="stylesheet" href="/css/mypage.css" />
</head>
<body>
    <!-- Navbar will be injected here -->
    
    <div class="container">
        <h1 data-i18n="mypage.title">Page Title</h1>
    </div>

    <script src="navbar.js"></script>
    <script src="i18n.js"></script>
</body>
</html>
```

2. **Create CSS file** in `public/css/mypage.css`

3. **Add route** in `src/routes/page.js`:
```javascript
router.get("/mypage", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "page", "mypage.html"));
});
```

4. **Add i18n translations** in `public/i18n.js`:
```javascript
const translations = {
  th: {
    "mypage.title": "หน้าของฉัน",
    "nav.mypage": "หน้าของฉัน"
  },
  en: {
    "mypage.title": "My Page",
    "nav.mypage": "My Page"
  }
};
```

5. **Add to navbar** in `public/navbar.js` (optional):
```javascript
menuItems: [
  // ... existing items
  {
    href: "/mypage",
    i18nKey: "nav.mypage",
    id: "mypageLink"
  }
]
```

---

### Adding a New API Endpoint

1. **Create route handler** in appropriate route file (`src/routes/`):
```javascript
// src/routes/myresource.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

export default function initMyResourceRoutes(dependencies) {
  router.post('/api/myresource', requireAuth, async (req, res) => {
    try {
      const { data } = req.body;
      
      // Validate input
      if (!data) {
        return res.status(400).json({ error: 'Data required' });
      }
      
      // Process request
      const result = await dependencies.myService.process(data);
      
      res.json({ result });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
```

2. **Register route** in `src/app.js`:
```javascript
import initMyResourceRoutes from './routes/myresource.js';

// ... in setupApp function
app.use(initMyResourceRoutes(dependencies));
```

3. **Add i18n messages** if needed (for error messages)

4. **Test endpoint** manually or write tests

---

### Adding a New AI Chat Provider

1. **Create model file** in `src/models/chat/`:
```javascript
// src/models/chat/newprovider.model.js
import OpenAI from 'openai';

class NewProviderChatModel {
  constructor() {
    this.config = {
      name: "Provider Name",
      apiKeyEnv: "NEW_PROVIDER_API_KEY",
      baseURL: "https://api.provider.com/v1",
      model: "model-name",
    };
    this.client = null;
  }

  init() {
    const apiKey = process.env[this.config.apiKeyEnv];
    if (!apiKey) {
      console.warn(`${this.config.apiKeyEnv} not configured`);
      return false;
    }

    this.client = new OpenAI({
      apiKey,
      baseURL: this.config.baseURL,
    });

    return true;
  }

  isConfigured() {
    return this.client !== null;
  }

  async chat(message, history = []) {
    if (!this.isConfigured()) {
      throw new Error(`${this.config.name} not configured`);
    }

    const messages = [
      ...history,
      { role: "user", content: message },
    ];

    const completion = await this.client.chat.completions.create({
      model: this.config.model,
      messages: messages,
    });

    const reply = completion.choices[0].message.content;

    return {
      success: true,
      reply,
      provider: this.config.name,
      model: this.config.model,
    };
  }

  getInfo() {
    return {
      name: this.config.name,
      provider: this.config.name,
      model: this.config.model,
      configured: this.isConfigured(),
    };
  }
}

export default NewProviderChatModel;
```

2. **Register in chat router** (`src/routes/chat.js`):
```javascript
import NewProviderChatModel from '../models/chat/newprovider.model.js';

const CHAT_MODELS = {
  GLM: GLMChatModel,
  GROQ: GroqChatModel,
  NEWPROVIDER: NewProviderChatModel,  // Add here
  // ...
};
```

3. **Add to `.env.example`**:
```env
AI_PROVIDER=NEWPROVIDER
NEW_PROVIDER_API_KEY=your_api_key_here
```

4. **Update README** with new provider info

---

### Adding i18n Translation Keys

1. **Open** `public/i18n.js`

2. **Add to both `th` and `en` objects**:
```javascript
const translations = {
  th: {
    // ... existing keys
    "myfeature.title": "ชื่อฟีเจอร์",
    "myfeature.description": "คำอธิบาย"
  },
  en: {
    // ... existing keys
    "myfeature.title": "Feature Title",
    "myfeature.description": "Description"
  }
};
```

3. **Use in HTML**:
```html
<h1 data-i18n="myfeature.title"></h1>
```

4. **Use in JavaScript**:
```javascript
const title = window.i18n.t("myfeature.title");
```

5. **Use with parameters**:
```javascript
// Translation
"message.greeting": "Hello, {name}!"

// Usage
window.i18n.t("message.greeting", { name: "John" });
// Returns: "Hello, John!"
```

---

## Guest Mode Features

### Overview
Guest users can create URLs without authentication, with limitations to encourage signup.

### Guest Tracking System
- **Cookie-based**: `guest_id` UUID stored in cookie
- **IP tracking**: Secondary identifier for redundancy  
- **Database**: `src/models/guest.js` tracks usage per day
- **Cleanup**: Auto-delete records older than 30 days

### Guest Limitations
- **Daily limit**: 3 URLs per day
- **No custom codes**: Auto-generated codes only
- **No memo field**: Hidden from UI
- **Fixed expiry**: 90 days (cannot customize)
- **No editing**: Cannot edit or delete URLs
- **No analytics**: Cannot view click statistics

### Guest UI Elements
**Benefits Banner** (`benefitsBanner`):
- Shown on `create.html` and `showlink.html` for guests only
- Hidden for authenticated users
- Displays 5 benefits of signing up
- Purple gradient design

**Guest Counter** (`guestCounter`):
- Shows remaining URLs count (e.g., "เหลืออีก 2 ครั้ง/วัน")
- Updates after each URL creation
- Turns red when limit reached

### Implementation Files
- `src/models/guest.js` - Guest database model
- `src/middleware/guest.js` - Guest middleware (tracking, limits)
- `src/utils/qrcode-generator.js` - QR code generation
- `public/css/create.css` - Guest UI styles

---

## Debugging Best Practices

### Systematic Debugging Approach

#### 1. **i18n Translation Issues**

**Symptom**: Showing key instead of translated text (e.g., "message.enterUrl")

**ALWAYS CHECK IN THIS ORDER**:
1. ✅ Does key exist in **Thai** translations?
2. ✅ **Does key exist in English translations?** ← Most common issue!
3. Check current language: `console.log(window.i18n.currentLang)`
4. Check i18n is loaded: `console.log(window.i18n)`

**Pattern Recognition**:
- Key shows as-is = **Key missing in active language**
- Nothing shows = i18n not loaded
- Wrong language = Language detection issue

**Example Fix**:
```javascript
// ❌ WRONG: Only in Thai
const translations = {
  th: { "message.enterUrl": "⚠️ กรุณาใส่ URL ก่อน" },
  en: { /* missing! */ }
};

// ✅ CORRECT: In both languages
const translations = {
  th: { "message.enterUrl": "⚠️ กรุณาใส่ URL ก่อน" },
  en: { "message.enterUrl": "⚠️ Please enter a URL" }
};
```

#### 2. **Navbar/Component Not Showing**

**Symptom**: Navbar HTML injected but not displayed properly

**CHECK**:
1. CSS path correct? (use `/css/navbar.css` not `css/navbar.css`)
2. Body layout conflicts? (flex centering breaks fixed navbar)
3. i18n not translating navbar elements?
4. JavaScript errors blocking execution?

**Solution Pattern**:
```css
/* Guest mode: centered content */
body:not(:has(.navbar:not(.hidden))) {
    display: flex;
    justify-content: center;
}

/* Logged-in: navbar at top */
body:has(.navbar:not(.hidden)) {
    padding-top: 60px;
}
```

#### 3. **Shared Component Pattern**

**When refactoring duplicated code**:
1. Identify common pattern across pages
2. Create shared component (e.g., `navbar.js`)
3. Support multiple modes/styles (e.g., `navbar` vs `user-bar`)
4. Maintain backward compatibility
5. Test on ALL pages using the component

**Anti-pattern**: Copy-pasting navbar HTML in every page  
**Better**: Single navbar component with configuration

#### 4. **Console-Driven Debugging**

When stuck, **add console.log immediately**:
```javascript
console.log('Current lang:', window.i18n.currentLang);
console.log('Translation result:', window.i18n.t("key"));
console.log('Has key?:', window.i18n.translations.en["key"]);
```

Remove debug logs after fixing, don't commit them.

#### 5. **Feature Addition Checklist**

When adding guest-restricted features:
- [ ] Update `checkAuth()` logic in page
- [ ] Hide UI elements for guests (`.style.display = "none"`)
- [ ] Show benefits banner for guests
- [ ] Enforce restrictions in API (defense in depth)
- [ ] Update i18n with new keys (**both languages!**)
- [ ] Test as guest AND logged-in user

---

## Troubleshooting Guide

### Common Issues

#### 1. "Cannot find module" error
**Symptom**: `Error: Cannot find module 'module-name'`

**Solution**:
```bash
npm install
```

---

#### 2. Google OAuth redirect fails
**Symptom**: "redirect_uri_mismatch" error

**Solution**:
1. Check Google Cloud Console → OAuth 2.0 Client IDs
2. Ensure authorized redirect URI matches exactly:
   - `http://localhost:8080/auth/google/callback`
3. No trailing slashes
4. Protocol (http/https) must match

---

#### 3. Session not persisting
**Symptom**: User logged out on every request

**Possible Causes**:
1. SESSION_SECRET not set in `.env`
2. Cookie settings incorrect
3. Using HTTPS without `secure: true` cookie flag

**Solution**:
```javascript
// In src/app.js
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000  // 24 hours
  }
}));
```

---

#### 4. NeDB data corrupted
**Symptom**: Database errors, cannot read data

**Solution**:
1. Backup `data/` folder
2. Check for malformed JSON in `.nedb` files
3. Remove corrupted lines
4. Or delete and reinitialize (data loss)

---

#### 5. AI Chat not working
**Symptom**: "AI service not configured" error

**Checklist**:
1. Check `.env` has correct `AI_PROVIDER` value
2. Verify API key is set (e.g., `GLM_API_KEY`)
3. Check network connectivity to AI provider
4. Review logs for specific error messages

---

#### 6. i18n not updating
**Symptom**: Text not changing when switching language

**Solution**:
1. Check browser console for errors
2. Verify translation keys exist in both `th` and `en`
3. Ensure element has `data-i18n` attribute
4. Call `window.i18n.updatePage()` manually if needed

---

## Git Workflow

### Branch Strategy
- `master` - Production-ready code
- `staging` - Pre-production testing
- `dev` - Active development (default)
- `feature/*` - Feature branches
- `stable-version` - Stable release snapshots

### Commit Message Convention
```
<type>(<emoji>): <description>

Types:
✨ :sparkles: - New feature
🐛 :bug: - Bug fix
📝 :memo: - Documentation
🔧 :wrench: - Configuration
♻️ :recycle: - Refactoring
🎨 :art: - UI/Style changes
⚡ :zap: - Performance improvement
🔒 :lock: - Security fix

Examples:
✨ Add chat feature with MVC architecture
🐛 Fix i18n placeholder replacement
📝 Update README with OAuth setup instructions
```

### Merging to All Branches
```bash
# From dev branch
git checkout staging && git merge dev && git push origin staging
git checkout master && git merge dev && git push origin master
git checkout stable-version && git merge dev && git push origin stable-version
git checkout dev
```

---

## Environment Variables Reference

```env
# Server Configuration
PORT=8080                           # Server port
BASE_URL=http://localhost:8080      # Base URL for OAuth callbacks
SESSION_SECRET=random_secret_here   # Session encryption key (change in production)

# Google OAuth 2.0
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
# Get from: https://console.cloud.google.com/

# Super Admin Configuration
SUPER_ADMIN_EMAILS=admin@example.com,admin2@example.com
# Comma-separated list of emails with super admin access

# AI Chat Configuration
AI_PROVIDER=GLM                     # GLM | GROQ | OPENROUTER | TOGETHER
GLM_API_KEY=xxx                     # GLM-4.6 API key
GROQ_API_KEY=xxx                    # Groq API key (free tier available)
OPENROUTER_API_KEY=xxx              # OpenRouter API key
TOGETHER_API_KEY=xxx                # Together AI API key

# Optional: Development
NODE_ENV=development                # development | production
```

---

## Testing Checklist

When making changes, verify:

### Authentication
- [ ] Login with Google works
- [ ] Logout works
- [ ] Session persists across page loads
- [ ] Protected routes redirect to login
- [ ] User avatar loads correctly

### URL Management
- [ ] Create URL with auto-generated code
- [ ] Create URL with custom code
- [ ] Edit URL (memo, target)
- [ ] Delete URL
- [ ] View URL list
- [ ] Click tracking works
- [ ] Expiration works correctly
- [ ] Search/filter works

### Admin Features
- [ ] View all URLs
- [ ] View all users
- [ ] Change user role
- [ ] Toggle user status
- [ ] Appropriate permissions enforced

### Chat
- [ ] Send message to AI
- [ ] Receive response
- [ ] History maintained
- [ ] Error handling for unavailable service

### i18n
- [ ] Switch language updates all text
- [ ] Placeholders work correctly
- [ ] All pages support both languages

### UI/UX
- [ ] Responsive design works on mobile
- [ ] Navbar shows appropriate menus by role
- [ ] Error messages are user-friendly
- [ ] Loading states shown appropriately

---

## Performance Considerations

### Database
- NeDB is file-based, suitable for small-medium scale
- For high traffic, consider migration to MongoDB/PostgreSQL
- Indexes on `code` and `createdBy` improve query performance

### Session Storage
- Currently using memory storage (default)
- For production with multiple servers, use Redis:
```javascript
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient();
app.use(session({
  store: new RedisStore({ client: redisClient }),
  // ... other options
}));
```

### AI Chat
- Consider rate limiting to prevent abuse
- Implement caching for common queries
- Set timeout for AI requests (current: none)

---

## Security Best Practices

### Current Implementation
- ✅ Session secret from environment
- ✅ httpOnly cookies
- ✅ Role-based access control
- ✅ Input validation
- ✅ Soft deletes (data recovery)

### Recommended Improvements
- [ ] Add rate limiting (express-rate-limit)
- [ ] Implement CSRF protection
- [ ] Add Content Security Policy headers
- [ ] Sanitize user input (DOMPurify for HTML)
- [ ] Add request logging (morgan)
- [ ] Implement API key rotation
- [ ] Add 2FA support

### URL Security
- Validate target URLs to prevent:
  - JavaScript injection (`javascript:` protocol)
  - Data URLs (`data:` protocol)
  - File URLs (`file:` protocol)

```javascript
// Example validation
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
```

---

## Deployment Guide

### Prerequisites
- Node.js v16+ on server
- Domain with DNS configured
- SSL certificate (Let's Encrypt recommended)
- Reverse proxy (Nginx recommended)

### Steps

1. **Clone repository**:
```bash
git clone https://github.com/rachiodevz/dudx-tinyurl.git
cd dudx-tinyurl
```

2. **Install dependencies**:
```bash
npm install --production
```

3. **Configure environment**:
```bash
cp .env.example .env
nano .env  # Edit with production values
```

4. **Set up Google OAuth**:
   - Add production callback URL to Google Console
   - Update `BASE_URL` in `.env`

5. **Start application**:
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start server.js --name tinyurl
pm2 save
pm2 startup

# Or using systemd (see systemd service file below)
```

6. **Configure Nginx** (reverse proxy):
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Systemd Service File
```ini
# /etc/systemd/system/tinyurl.service
[Unit]
Description=TinyURL Service
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/dudx-tinyurl
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable tinyurl
sudo systemctl start tinyurl
sudo systemctl status tinyurl
```

---

## Monitoring & Logging

### Recommended Tools
- **Application**: PM2 (logs, monitoring, clustering)
- **Server**: Nginx access logs
- **Database**: Manual backup script for `data/` folder
- **Errors**: Consider Sentry or similar

### Backup Strategy
```bash
#!/bin/bash
# backup.sh - Run daily via cron
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backups/tinyurl_$DATE.tar.gz /path/to/dudx-tinyurl/data/
# Keep only last 7 days
find /backups -name "tinyurl_*.tar.gz" -mtime +7 -delete
```

---

## Future Enhancements

### Potential Features
- [ ] QR code generation for URLs
- [ ] URL analytics dashboard (charts)
- [ ] Custom domains support
- [ ] API rate limiting per user
- [ ] URL preview before redirect
- [ ] Bulk URL import/export
- [ ] Webhook notifications
- [ ] Password-protected URLs
- [ ] URL templates/categories
- [ ] Integration with URL scanners (VirusTotal)

### Technical Improvements
- [ ] Migrate to TypeScript
- [ ] Add comprehensive test suite (Jest)
- [ ] Implement GraphQL API
- [ ] Add WebSocket for real-time updates
- [ ] Containerize with Docker
- [ ] Add CI/CD pipeline (GitHub Actions)
- [ ] Implement database migrations
- [ ] Add API documentation (Swagger/OpenAPI)

---

## Contact & Support

- **Repository**: https://github.com/rachiodevz/dudx-tinyurl
- **Issues**: Report bugs via GitHub Issues
- **Author**: rachiodevz

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-11  
**Maintained by**: AI-assisted development

---

## Quick Reference

### Useful Commands
```bash
# Development
npm start                  # Start server
npm run dev               # Start with nodemon (auto-reload)

# Git
git status                # Check status
git log --oneline         # View commits
git branch -a            # List all branches

# Database
cat data/urls.nedb       # View URLs database
cat data/users.nedb      # View users database

# Logs (with PM2)
pm2 logs tinyurl         # View logs
pm2 monit                # Monitor resources
```

### Key Files to Check First
1. `src/app.js` - Main application setup
2. `src/routes/page.js` - Page routing
3. `public/navbar.js` - Navbar component
4. `public/i18n.js` - Translations
5. `.env` - Configuration

### When Something Breaks
1. Check browser console for errors
2. Check server logs (`pm2 logs` or terminal output)
3. Verify `.env` configuration
4. Check database files for corruption
5. Review recent commits (`git log`)
6. Check this specification document

---

*This document should be updated whenever significant changes are made to the codebase.*
