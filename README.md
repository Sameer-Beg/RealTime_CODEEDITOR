# 🚀 Real-Time Collaborative Code Editor

A powerful **real-time collaborative code editor** built using modern web technologies.  
This project allows multiple users to write code together, run it, and see shared output instantly — similar to **Google Docs + VS Code Live Share**.

---

## 🌟 Features

### 👨‍💻 Real-Time Collaboration
- Multiple users can edit code simultaneously
- Changes are synced instantly using CRDT (Yjs)
- Live user list (who is online)

### 🧠 Code Execution
- Run JavaScript code directly in browser
- Captures `console.log()` output
- Displays result in output panel

### 🔄 Shared Output
- Output is synchronized across all users
- When one user runs code → everyone sees result

### 🎨 Theme Support
- Dark Theme
- Light Theme
- High Contrast Theme
- Theme preference saved using localStorage

### 🔐 Session Handling
- Username-based login system
- Logout functionality
- Removes user from active session instantly

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Monaco Editor (VS Code editor in browser)

### Real-Time Collaboration
- Yjs (CRDT-based state management)
- y-websocket (real-time sync server)

### Backend (for WebSocket)
- Node.js
- WebSocket (ws)

---

## 📦 Libraries Used

- `@monaco-editor/react`
- `yjs`
- `y-websocket`
- `y-monaco`

---

## ⚙️ How It Works

1. User enters a username
2. Connects to WebSocket server
3. Yjs syncs document across users
4. Monaco Editor binds with shared Yjs state
5. Any change → instantly visible to all users
6. Code execution updates shared output

---


🧠 What I Learned
How real-time collaboration works using CRDT (Yjs)
Integrating Monaco Editor in React
Managing shared state across multiple users
WebSocket communication
Handling live user presence (awareness API)
Capturing and displaying dynamic code output
Building scalable frontend architecture
Improving UI/UX with theme persistence

---

🎯 Future Improvements
🌐 Room-based collaboration (multiple sessions)
💬 Real-time chat system
🎨 Cursor tracking (like VS Code Live Share)
🧠 AI code suggestions
🌍 Deployment (AWS / Docker)
🏆 Project Highlights
Real-time multi-user system
Shared execution output
Clean and modern UI
Scalable architecture


🙌 Author

Sameer

⭐ Support

If you like this project, give it a ⭐ on GitHub!


---

