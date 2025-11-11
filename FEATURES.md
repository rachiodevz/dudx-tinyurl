# TinyURL - Feature Updates & Changelog

## 📋 Overview
This document tracks all features, improvements, and changes made to the TinyURL application.

---

## 🗓️ 2025-11-11

### ✨ Major Refactoring
- **Restructured codebase** to `src/` folder architecture
  - Separated concerns: `routes/`, `middleware/`, `database/`, `config/`, `utils/`
  - Better code organization and maintainability
- **Switched entry point** from `server.js` to `init.js`
  - Better initialization flow
  - Improved logging during startup

### 👥 User Management System
- **Added User Management Panel** for admins
  - View all users with details (name, email, role, status)
  - Change user roles (User, Admin, Super Admin)
  - Activate/Deactivate users
  - User statistics dashboard
- **Role-Based Access Control (RBAC)**
  - `USER` - Can create and manage own URLs
  - `ADMIN` - Can manage users (except Super Admins) + all USER permissions
  - `SUPER_ADMIN` - Full access to everything
- **Admin API Endpoints**
  - `GET /api/admin/users` - Get all users
  - `PUT /api/admin/users/:userId/role` - Change user role
  - `PUT /api/admin/users/:userId/toggle-status` - Toggle user active status
  - `GET /api/admin/stats` - Get user statistics

### 📁 Database Organization
- **Created `data/` folder** for organized storage
  - `data/urls.nedb` - URL database
  - `data/users.nedb` - User database
  - `data/server.log` - Application logs
- **User Database** with full user management
  - Store user profiles from Google OAuth
  - Track roles and active status
  - Track last login time

### 🎨 UI Improvements
- **Admin Panel** with tabbed interface
  - URL Management tab - View and manage all shortened URLs
  - User Management tab - Manage users and permissions
  - Search functionality for both URLs and users
  - Real-time statistics
- **Role badges** with color coding
  - User (Blue), Admin (Orange), Super Admin (Pink)
- **Modal dialogs** for role changes
- **Responsive design** for better mobile experience

### 🔧 Technical Improvements
- **Modular middleware**
  - `auth.js` - Authentication middleware
  - `rbac.js` - Role-based access control
  - `logging.js` - Request logging
- **Database abstraction layer**
  - `Database` class for URL management
  - `UserDatabase` class for user management
  - In-memory caching for performance
- **Centralized configuration** in `src/config/index.js`
- **Utility logger** for consistent logging format

### 🌿 Git Workflow
- Created `dev` branch for development
- Established workflow: develop on `dev`, merge to `master` for releases

---

## 🗓️ Previous Updates

### 2025-11-10 (Estimated)
- **Admin Panel** basic implementation
- **My URLs page** for users to manage their own URLs
- **Authentication middleware** order fixed
- Google OAuth integration

### Initial Release
- **Core URL Shortening** functionality
  - Generate random 6-character codes
  - Store URLs with NeDB database
  - Redirect short codes to target URLs
- **Google OAuth Authentication**
  - Login with Google account
  - User profile storage
  - Session management
- **Basic UI**
  - Homepage with URL shortening form
  - Clean, modern design
  - Responsive layout

---

## 🚀 Upcoming Features (Planned)

### High Priority
- [ ] Click/visit tracking for URLs
- [ ] Custom short codes (user-defined)
- [ ] URL expiration dates
- [ ] QR code generation for short URLs

### Medium Priority
- [ ] Export user URLs (CSV/JSON)
- [ ] Bulk URL operations
- [ ] URL analytics dashboard
- [ ] Email notifications
- [ ] API keys for external access

### Low Priority
- [ ] Dark mode
- [ ] Multiple OAuth providers (GitHub, Facebook)
- [ ] URL categories/tags
- [ ] Share URLs to social media
- [ ] Bundle/build system for production (esbuild)

---

## 🐛 Bug Fixes

### 2025-11-11
- Fixed `urlShortener.getUrlByCode is not a function` error
  - Replaced array-based approach with `URLShortener` class
  - Proper dependency injection in routes
- Fixed database path issues
  - Updated config to point to `data/` folder
  - Removed duplicate database files in root

---

## 📝 Notes

### Architecture Decisions
- **NeDB** chosen for simplicity (file-based, no external database needed)
- **Google OAuth** for secure authentication without managing passwords
- **Express.js** for routing and middleware
- **Passport.js** for authentication strategy
- **ES Modules** for modern JavaScript syntax

### Code Quality
- Consistent code style across all files
- Separated business logic from routes
- Error handling in all API endpoints
- Proper HTTP status codes

---

**Last Updated:** 2025-11-11
**Version:** 1.0.0
**Maintainer:** Development Team
