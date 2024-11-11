# Full Stack Chat Application

A real-time chat application built with React and Node.js that allows users to communicate with each other after authentication.

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (version 20.9.0)
- npm (version 10.1.0)

## Project Structure

The project consists of two main directories:
- `chat-front`: React frontend application (runs on port 3000)
- `chat-back`: Node.js backend application (runs on port 5000)

## Installation & Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd chat-back
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
The backend server will run on http://localhost:5000

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd chat-front
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React application:
   ```bash
   npm start
   ```
The frontend application will run on http://localhost:3000

## Testing the Application

### User Authentication
1. First, create at least two user accounts using the signup page
2. To test chat functionality with multiple users:
   - Log in with the first user in your regular browser
   - Open an incognito window and log in with the second user
   
### Chat Features
- Users must be logged in to access the chat
- Chat is available only after successful authentication
- Messages are delivered in real-time between users
- Users can sign out and create new accounts as needed

### Available Pages
1. Signup (/signup)
   - Create a new user account
2. Login (/login)
   - Authenticate existing users
3. Chat (/chat)
   - Main chat interface (requires authentication)

## Notes
- Both servers (frontend and backend) must be running simultaneously for the application to work
- The application uses local storage for session management
- Multiple users can be created and tested simultaneously using regular and incognito browser windows

## Logout
- Users can safely sign out using the logout button
- After logout, users will be redirected to the login page

## Troubleshooting
If you encounter any issues:
1. Ensure both servers are running (ports 3000 and 5000)
2. Check if node_modules are properly installed in both directories
3. Verify that no other applications are using the required ports
4. Clear browser cache if experiencing authentication issues
