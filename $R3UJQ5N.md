# EduKit - Mobile Learning App

A single-page, mobile-first learning application built with HTML, Tailwind CSS, and vanilla JavaScript. Features course management, user authentication, and an admin panel with all data stored locally in the browser.

## Features

### 🔐 Authentication
- User signup and login with SHA-256 password hashing
- Session management with localStorage
- Admin user support with elevated permissions
- Account blocking/unblocking functionality

### 📚 Course Management
- Free, locked (code-protected), and paid course types
- Course enrollment and progress tracking
- Lesson viewer with completion tracking
- Course search functionality

### 👤 User Experience
- Mobile-first responsive design
- Bottom tab navigation (native app feel)
- Disabled browser interactions (right-click, zoom)
- Dark/light theme support
- Profile management with avatar support

### 🛠️ Admin Panel
- User management (block, delete, promote to admin)
- Course creation, editing, and deletion
- Analytics dashboard with user/course statistics
- Data export functionality (JSON download)

### ⚙️ Settings & Developer Tools
- Toggle browser interaction restrictions
- Theme switching (light/dark)
- Developer mode with localStorage inspection
- Demo data reset functionality

## Getting Started

### Installation
1. Download the project files
2. Open `index.html` in a modern web browser
3. The app will automatically seed demo data on first run

### Demo Accounts
- **Admin**: admin@edukit.com / admin123
- **Student 1**: john@example.com / password123
- **Student 2**: jane@example.com / password123

### Demo Courses
- JavaScript Fundamentals (Free)
- Advanced React Patterns (Paid - ₹2999)
- UI/UX Design Principles (Locked - Code: DESIGN2024)
- Python for Beginners (Paid - ₹1999)
- Web Development Bootcamp (Free)

## Technical Details

### Data Storage
All data is stored in browser localStorage using these keys:
- `ek_app_users` - User accounts and profiles
- `ek_app_courses` - Course content and metadata
- `ek_app_enrollments` - User course enrollments and progress
- `ek_app_session` - Current user session
- `ek_app_settings` - App preferences and settings

### Security Considerations
⚠️ **Important**: This is a client-side only application. All authentication and data storage happens in the browser's localStorage, which is inherently insecure for production use. This implementation is for demonstration purposes only.

**Security limitations:**
- Passwords are hashed client-side but can be inspected in browser dev tools
- All user data is accessible through browser localStorage
- No server-side validation or protection
- Session management is purely client-side

### Browser Compatibility
- Modern browsers with ES6+ support
- localStorage support required
- Web Crypto API support for password hashing

## File Structure
\`\`\`
/
├── index.html          # Main SPA shell and UI
├── js/
│   ├── app.js         # Main application logic
│   ├── auth.js        # Authentication utilities
│   ├── storage.js     # localStorage management
│   └── ui.js          # UI components and helpers
└── README.md          # This file
\`\`\`

## Accessibility Features
- Keyboard navigation support
- ARIA labels and semantic HTML
- Focus management for modals and navigation
- Screen reader friendly content structure

**Note**: The zoom disable feature can harm accessibility. Users can toggle this off in Settings for better accessibility support.

## Development

### Resetting Demo Data
1. Go to Settings → Enable Developer Mode
2. Click "Reset Demo Data" button
3. Page will reload with fresh demo content

### Exporting Data
1. Admin Panel → Export button, or
2. Settings → Developer Mode → Download button

### Adding New Features
The modular JavaScript structure makes it easy to extend:
- Add new views in `index.html`
- Extend storage schema in `storage.js`
- Add UI components in `ui.js`
- Implement business logic in `app.js`

## Known Limitations
- Client-side only (no real backend)
- Limited file upload (base64 storage only)
- No real payment processing (simulated)
- Basic course content types (text only in demo)
- No real-time collaboration features

## License
This project is for educational and demonstration purposes.
