# LinkCamp Client (React Native + Expo)
Cross-platform mobile/web client for LinkCamp, a role-based campus community platform.

## Companion Repository
- Server (Node.js + Express + Socket.IO): https://github.com/f-zaman-rafi/Link-Camp-server

## Overview
LinkCamp Client delivers the full user experience for:
- Secure sign-up/sign-in with Firebase Authentication
- Email verification + profile onboarding flow
- Role-aware navigation and access (`student`, `teacher`, `admin`)
- Realtime feed interactions (posts, comments, votes, reposts)
- Admin moderation panel for users and reports

The app runs on Android, iOS, and Web using Expo.

## Key Features
- Auth flow with guarded route groups using Expo Router
- Profile creation and update with image upload
- Feed sections:
  - Main feed
  - Teacher announcements
  - Admin noticeboard
- Content interactions:
  - Create/edit/delete post
  - Vote (up/down), comment, repost
  - Report post/comment
- Realtime updates over Socket.IO:
  - New/updated/deleted posts
  - Vote and comment changes
  - User profile changes reflected in feed/comments
- Admin panel:
  - Browse users by role/status
  - Approve/block users
  - Review and resolve report queues

## Tech Stack
- Expo + React Native
- TypeScript
- Expo Router
- Firebase Auth
- Axios
- Socket.IO Client
- React Hook Form
- NativeWind (Tailwind-style RN classes)
- AsyncStorage / Secure Store

## App Route Groups
- `app/(auth)` -> sign in, sign up, verify email, profile onboarding, blocked state
- `app/(tabs)` -> main app tabs (`feed`, `announcements`, `create`, `noticeboard`, `profile`)
- `app/(admin)` -> admin users/reports panel

## Local Setup
### Prerequisites
- Node.js 18+ (Node 20 recommended)
- npm
- Expo-compatible emulator/simulator (Android Studio or Xcode), or web browser
- Running LinkCamp backend API

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment
Create `.env` in project root:

```env
EXPO_PUBLIC_API_URL=http://localhost:5001

EXPO_PUBLIC_API_KEY=your_firebase_api_key
EXPO_PUBLIC_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_PROJECT_ID=your_project_id
EXPO_PUBLIC_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_APP_ID=your_app_id
```

Notes:
- `EXPO_PUBLIC_API_URL` should point to the backend base URL.
- For Android emulator, use host mapping/IP that your emulator can reach.

### 3) Run
```bash
# Expo dev server
npm run start

# Android native run
npm run android

# iOS native run
npm run ios

# Web
npm run web
```

## Scripts
- `npm run start` -> start Expo
- `npm run android` -> run Android build
- `npm run ios` -> run iOS build
- `npm run web` -> run web target
- `npm run lint` -> lint + formatting check
- `npm run format` -> auto-fix lint + format

## Project Structure (High Level)
```text
app/                  # Expo Router route groups and screens
components/           # Reusable UI and feature components
Hooks/                # Data, auth, feed, and admin hooks
providers/            # Auth/user/socket/global providers
firebase/             # Firebase initialization
types/                # Shared TypeScript types
utils/                # Utilities (uploads, helpers, etc.)
```

## Backend Integration
- HTTP calls use Axios hooks (`useAxiosCommon`, `useAxiosSecure`)
- Authenticated requests attach Firebase ID tokens in `Authorization` header
- Realtime layer connects to backend Socket.IO and subscribes by feed/post rooms
- Error routing handles pending/blocked account states from backend response codes

