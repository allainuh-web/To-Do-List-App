# 📝 React Native To-Do App — Expo + Firebase Firestore

A simple, beginner-friendly To-Do List app with real-time CRUD using Expo and Firebase Firestore.
## 📁 Project Structure
TodoApp/
├── App.js
└── src/
    ├── screens/
    │   └── HomeScreen.js       ← All Firestore logic + main UI
    ├── components/
    │   └── TaskItem.js         ← Individual task row component
    └── firebase/
        └── firebaseConfig.js   ← Your Firebase config (fill in your values)
## 🚀 1. Installation Commands

Run these in order inside your project folder:

```bash
# Step 1: Create a new Expo project (skip if you already have one)
npx create-expo-app TodoApp
cd TodoApp

# Step 2: Install Firebase SDK
npm install firebase

# Step 3: Start the Expo development server
npx expo start
```

> **Note:** Firebase v9+ (modular SDK) is used. No extra Expo plugin is needed for Firestore.

---

## 🔥 2. Firebase Firestore Setup

### A. Create a Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → follow the steps
3. Once created, click **Web** (`</>`) to add a web app
4. Copy the `firebaseConfig` object shown

### B. Enable Firestore Database
1. In the Firebase Console sidebar, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a region → click **Enable**

### C. Paste Your Config
Open `src/firebase/firebaseConfig.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

---

## 📦 3. Firestore Collection Structure

The app uses a single collection called **`tasks`**.

Each document has these fields:

| Field       | Type      | Description                        |
|-------------|-----------|-------------------------------------|
| `title`     | `string`  | The task text                       |
| `completed` | `boolean` | Whether the task is done            |
| `createdAt` | `timestamp` | Server timestamp for ordering     |

---

## ✨ 4. Features

| Feature              | Implementation                          |
|----------------------|-----------------------------------------|
| Add Task             | `addDoc()` with server timestamp        |
| View All Tasks       | `onSnapshot()` real-time listener       |
| Edit Task            | `updateDoc()` on title field            |
| Delete Task          | `deleteDoc()` with Alert confirmation   |
| Mark as Completed    | `updateDoc()` toggling `completed` bool |
| Real-time Updates    | `onSnapshot` auto-syncs the list        |
| Prevent empty tasks  | `trim()` check before `addDoc`          |

---

## 🛠 5. Troubleshooting

**"FirebaseError: Missing or insufficient permissions"**  
→ Your Firestore rules are in production mode. Switch to test mode in the Firebase Console under Firestore → Rules, or set:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
⚠️ Only use this in development. Add proper auth rules before going to production.

---

**"Cannot find module 'firebase/firestore'"**  
→ Run: `npm install firebase`

---

## 🔒 6. Before Going to Production
- Replace open Firestore rules with authenticated rules
- Add Firebase Authentication
- Move your `firebaseConfig` values to environment variables (`.env`)
